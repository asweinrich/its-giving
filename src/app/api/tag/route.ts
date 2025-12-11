'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/tag?q=...&limit=...
 *
 * Returns an array of tags: [{ id, name, slug }, ... ]
 *
 * Query params:
 * - q (optional): search string; case-insensitive match against name or slug
 * - limit (optional): integer limit (default 50, max 200)
 *
 * Example:
 *  /api/tag?q=food&limit=10
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

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
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