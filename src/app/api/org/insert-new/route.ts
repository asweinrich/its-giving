'use server';

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!session || email !== "asweinrich@gmail.com") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const name = String(body?.name ?? "").trim();
    const slugRaw = String(body?.slug ?? "").trim();
    const slug = slugify(slugRaw);
    const brandColor = String(body?.brandColor ?? "").trim();
    const mission = String(body?.mission ?? "").trim();

    const websiteUrl = body?.websiteUrl ? String(body.websiteUrl).trim() : null;
    const imageUrl = body?.imageUrl ? String(body.imageUrl).trim() : null;
    const instagram = body?.instagram ? String(body.instagram).trim() : null;
    const tiktok = body?.tiktok ? String(body.tiktok).trim() : null;

    const category = String(body?.category ?? "").trim();
    const type = String(body?.type ?? "").trim();
    const impactScope = String(body?.impactScope ?? "").trim();

    const foundedStr = String(body?.founded ?? "").trim(); // ISO string
    const founded = foundedStr ? new Date(foundedStr) : null;

    const countryCode = String(body?.countryCode ?? "US").trim().toUpperCase();
    const ein = body?.ein ? String(body.ein).trim() : null;

    const hqAddress = body?.hqAddress ? String(body.hqAddress).trim() : null;

    const tagNamesOrSlugs: string[] = Array.isArray(body?.tagNamesOrSlugs)
    ? (body.tagNamesOrSlugs as unknown[])
        .map((t) => String(t).trim())
        .filter(Boolean)
    : [];

    // validation
    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });
    if (!slug) return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    if (!brandColor || !isValidHexColor(brandColor)) {
      return NextResponse.json({ message: "Color must be a valid hex like #38a169" }, { status: 400 });
    }
    if (!mission) return NextResponse.json({ message: "Mission is required" }, { status: 400 });
    if (!category) return NextResponse.json({ message: "Category is required" }, { status: 400 });
    if (!type) return NextResponse.json({ message: "Type is required" }, { status: 400 });
    if (!impactScope) return NextResponse.json({ message: "Service scope is required" }, { status: 400 });
    if (!founded || Number.isNaN(founded.getTime())) {
      return NextResponse.json({ message: "Founded date is required" }, { status: 400 });
    }

    // conditional EIN logic
    const needsEin = type === "NONPROFIT" || type === "FOUNDATION";
    const regulatoryId = needsEin && ein ? ein : null;
    const regulatoryIdType = needsEin && ein ? "EIN" : null;

    // upsert tags + connect
    const tags: Array<{ id: number } | null> = await Promise.all(
      tagNamesOrSlugs.map(async (raw) => {
        const tagSlug = slugify(raw);
        if (!tagSlug) return null;

        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name: raw },
          create: { name: raw, slug: tagSlug },
          select: { id: true },
        });
      })
    );

    const tagConnect = tags
      .filter((t): t is { id: number } => t !== null)
      .map((t) => ({ id: t.id }));

    const created = await prisma.organization.create({
      data: {
        name,
        slug,
        brandColor,
        imageUrl,
        websiteUrl,
        instagram,
        tiktok,
        category,
        type, // Prisma enum is OrgType; runtime string is OK if it matches enum
        founded,
        impactScope, // Prisma enum ImpactScope
        impactAreas: null, // leaving blank for now as requested

        countryCode,
        regulatoryId,
        regulatoryIdType,

        tags: tagConnect.length ? { connect: tagConnect } : undefined,

        detail: {
          create: {
            mission,
            address: hqAddress,
          },
        },
      },
      select: { id: true, slug: true },
    });

    return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "";

    if (message.includes("Unique constraint") || message.includes("unique")) {
      return NextResponse.json({ message: "Slug already exists. Please choose another." }, { status: 409 });
    }

    console.error("api/org/insert-new error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}