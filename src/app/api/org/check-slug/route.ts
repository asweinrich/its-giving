'use server';

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!session || email !== "asweinrich@gmail.com") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const raw = (url.searchParams.get("slug") ?? "").trim();
  const slug = slugify(raw);

  if (!slug) {
    return NextResponse.json({ available: false, slug, reason: "invalid" }, { status: 200 });
  }

  const existing = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing, slug }, { status: 200 });
}