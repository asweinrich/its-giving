import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // adjust if your prisma client lives elsewhere
import { Prisma } from "@prisma/client";

type OrgCreateBody = {
  name?: unknown;
  slug?: unknown;
  type?: unknown;
  description?: unknown;
  websiteUrl?: unknown;
  instagram?: unknown;
  tiktok?: unknown;
  impactScope?: unknown;
  impactAreas?: unknown;
  tags?: unknown; // expected: string[]
};

/**
 * Normalize a string into a safe slug:
 * - lowercases
 * - strips invalid characters
 * - collapses whitespace to single hyphen
 * - collapses multiple hyphens and trims
 */
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-_ \u00C0-\u017F]/g, "") // allow basic latin letters with diacritics, numbers, hyphen/underscore/space
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Ensure slug is unique in the organizations table.
 * If a collision is found, append a numeric suffix (-2, -3, ...) until unique.
 */
async function ensureUniqueSlug(baseSlug: string | null): Promise<string | null> {
  if (!baseSlug) return null;
  let candidate = baseSlug;
  let suffix = 2;

  // Try to use findUnique assuming slug is a unique field; fall back to findFirst if needed.
  let existing = await prisma.organization
    .findUnique({ where: { slug: candidate } })
    .catch(() => null);

  while (existing) {
    candidate = `${baseSlug}-${suffix++}`;
    existing = await prisma.organization
      .findUnique({ where: { slug: candidate } })
      .catch(() => null);
  }

  return candidate;
}

/** Allowed type keys must match your backend enum keys.
 * Keep this in sync with TYPE_LABELS used in the UI.
 */
const ALLOWED_ORG_TYPES = [
  "NONPROFIT",
  "FOUNDATION",
  "GRASSROOTS",
  "GOVERNMENTAL",
  "FAITH_BASED",
  "PTA",
  "BUSINESS",
  "OTHER",
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrgCreateBody;

    // Validate required fields
    if (!body?.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ message: "Missing required field: name" }, { status: 400 });
    }

    const name = body.name.trim();

    // Compute / normalize slug server-side (use provided slug if present, otherwise derive from name)
    const rawSlug =
      body.slug && typeof body.slug === "string" && body.slug.trim() ? (body.slug as string) : name;
    let normalized = slugify(rawSlug);

    // If normalization produces empty string (e.g. name with unsupported chars), fallback to timestamp
    if (!normalized) {
      normalized = `org-${Date.now()}`;
    }

    const uniqueSlug = await ensureUniqueSlug(normalized);

    // Build create payload using Prisma types. Use a Partial so we can progressively add fields.
    const data: Partial<Prisma.OrganizationCreateInput> = {
      name,
      slug: uniqueSlug ?? undefined,
    };

    // Validate and assign `type` only if it's one of the allowed enum keys.
    if (body.type && typeof body.type === "string") {
      const t = body.type.trim();
      if ((ALLOWED_ORG_TYPES as readonly string[]).includes(t)) {
        data.type = t as Prisma.OrganizationCreateInput["type"];
      }
    }

    if (body.description && typeof body.description === "string") data.description = body.description;
    if (body.websiteUrl && typeof body.websiteUrl === "string") data.websiteUrl = body.websiteUrl;
    if (body.instagram && typeof body.instagram === "string") data.instagram = body.instagram;
    if (body.tiktok && typeof body.tiktok === "string") data.tiktok = body.tiktok;

    // Cast the incoming string to the Prisma enum type after verifying it's a string.
    // Consider replacing this with runtime validation against an allowlist if you want stricter checks.
    if (body.impactScope && typeof body.impactScope === "string") {
      data.impactScope = body.impactScope as Prisma.OrganizationCreateInput["impactScope"];
    }

    if (Array.isArray(body.impactAreas) && body.impactAreas.length) {
      // Treat impactAreas as JSON-compatible data
      data.impactAreas = body.impactAreas as Prisma.InputJsonValue;
    }

    // --- TAGS: handle many-to-many relation via connectOrCreate ---
    // Expect body.tags to be an array of strings (tag names).
    if (Array.isArray(body.tags) && body.tags.length) {
      const rawTags = (body.tags as unknown[])
        .map((t) => (typeof t === "string" ? t.trim() : String(t ?? "").trim()))
        .filter(Boolean) as string[];

      if (rawTags.length) {
        // Map to connectOrCreate entries using slugified tag slugs.
        // NOTE: this assumes Tag model has a unique `slug` field. If your schema differs,
        // adjust `where` to match the unique field (e.g. { name: tagName }).
        data.tags = {
          connectOrCreate: rawTags.map((tagName: string) => {
            const tagSlug = slugify(tagName);
            return {
              where: { slug: tagSlug },
              create: { name: tagName, slug: tagSlug },
            };
          }),
        } as Prisma.TagCreateNestedManyWithoutOrganizationsInput;
      }
    }

    // Attempt create. If slug uniqueness race occurs, catch and retry with a new unique slug.
    try {
      const created = await prisma.organization.create({
        data: data as Prisma.OrganizationCreateInput,
        include: { tags: true }, // include tags so client sees created/connected tags
      });

      // Return created record (select only needed fields)
      return NextResponse.json(
        {
          id: created.id,
          name: created.name,
          slug: created.slug ?? null,
          tags: created.tags ?? [],
        },
        { status: 201 }
      );
    } catch (err: unknown) {
      // Handle Prisma unique constraint error (P2002) on slug by retrying with a new unique slug.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        // generate a new unique slug and retry once
        const fallback = await ensureUniqueSlug(`${normalized}-${Math.floor(Math.random() * 900) + 100}`);
        if (!fallback) {
          return NextResponse.json({ message: "Unable to generate unique slug" }, { status: 500 });
        }
        data.slug = fallback;
        const created = await prisma.organization.create({
          data: data as Prisma.OrganizationCreateInput,
          include: { tags: true },
        });
        return NextResponse.json(
          {
            id: created.id,
            name: created.name,
            slug: created.slug ?? null,
            tags: created.tags ?? [],
          },
          { status: 201 }
        );
      }

      // Unexpected error from prisma
      console.error("prisma create error", err);
      const message = err instanceof Error ? err.message : "Database error";
      return NextResponse.json({ message }, { status: 500 });
    }
  } catch (err: unknown) {
    console.error("Create org route error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}