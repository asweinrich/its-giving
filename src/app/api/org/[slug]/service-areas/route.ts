import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/org/[slug]/service-areas
// Returns all service areas for the org
export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const org = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const serviceAreas = await prisma.serviceArea.findMany({
      where: { orgId: org.id },
      orderBy: [{ type: "asc" }, { value: "asc" }],
    });

    return NextResponse.json(serviceAreas, { status: 200 });
  } catch (error) {
    console.error("Error fetching service areas:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/org/[slug]/service-areas
// Body: { type: AreaType, value: string, placeId: string }
// Adds a service area to the org — prevents duplicates
export async function POST(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const org = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type, value, placeId } = body;

    if (!type || !value) {
      return NextResponse.json({ error: "type and value are required" }, { status: 400 });
    }

    // Prevent duplicate — same org + same value
    const existing = await prisma.serviceArea.findFirst({
      where: { orgId: org.id, value },
    });

    if (existing) {
      return NextResponse.json({ error: "Service area already added" }, { status: 409 });
    }

    const serviceArea = await prisma.serviceArea.create({
      data: {
        orgId: org.id,
        type,
        value,
        placeId: placeId ?? null,
      },
    });

    return NextResponse.json(serviceArea, { status: 201 });
  } catch (error) {
    console.error("Error creating service area:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}