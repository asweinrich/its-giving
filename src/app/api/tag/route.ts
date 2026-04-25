'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { slugify } from "@/lib/slugify";

/**
 * GET /api/tag?q=...&limit=...
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q')?.trim() ?? '';
    const limitParam = url.searchParams.get('limit');
    let limit = 50;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!Number.isNaN(parsed)) {
        limit = Math.min(Math.max(parsed, 1), 200);
      }
    }

    const where: Prisma.TagWhereInput | undefined = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as Prisma.QueryMode } },
            { slug: { contains: q, mode: 'insensitive' as Prisma.QueryMode } },
          ],
        }
      : undefined;

    const tags = await prisma.tag.findMany({
      where,
      orderBy: [{ name: 'asc' }],
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json(tags);
  } catch (err) {
    console.error('api/tag error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/tag
 * Body: { name: string }
 * Creates tag if missing; returns { id, name, slug }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!session || email !== "asweinrich@gmail.com") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ message: "Tag name is required" }, { status: 400 });
    }

    const slug = slugify(name);
    if (!slug) {
      return NextResponse.json({ message: "Invalid tag name" }, { status: 400 });
    }

    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name }, // keep latest capitalization
      create: { name, slug },
      select: { id: true, name: true, slug: true },
    });

    return NextResponse.json(tag);
  } catch (err) {
    console.error("api/tag POST error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}