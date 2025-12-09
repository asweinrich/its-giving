import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const orgs = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      include: { tags: true },
    });

    // Optionally sanitize or limit fields here before returning
    return NextResponse.json(orgs);
  } catch (err) {
    console.error("GET /api/org/list error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}