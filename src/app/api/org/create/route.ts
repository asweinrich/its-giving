import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // expected body shape (example)
    // {
    //   name: "ABC Org",
    //   type: "NONPROFIT",
    //   description: "...",
    //   websiteUrl: "https://...",
    //   instagram: "handle",
    //   tiktok: "handle",
    //   impactScope: "LOCAL",
    //   impactAreas: [ { type: "named", level: "city", name: "Portland", countryCode: "US" } ],
    //   tags: ["education", "youth"]
    // }

    const {
      name,
      type,
      description,
      websiteUrl,
      instagram,
      tiktok,
      impactScope,
      impactAreas,
      tags = []
    } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // Prepare tag connectOrCreate array:
    const tagOps = (Array.isArray(tags) ? tags : [])
      .map((t: string) => ({
        where: { slug: t.toLowerCase().replace(/\s+/g, "-") },
        create: { name: t, slug: t.toLowerCase().replace(/\s+/g, "-") }
      }));

    const org = await prisma.organization.create({
      data: {
        name,
        type,
        description,
        websiteUrl,
        instagram,
        tiktok,
        impactScope,
        impactAreas,
        tags: {
          connectOrCreate: tagOps
        }
      },
      include: { tags: true }
    });

    return NextResponse.json(org, { status: 201 });
  } catch (err) {
    console.error("create org error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}