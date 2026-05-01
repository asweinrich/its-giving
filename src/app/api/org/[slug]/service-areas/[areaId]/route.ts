import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string; areaId: string }>;
}

// DELETE /api/org/[slug]/service-areas/[areaId]
// Removes a single service area — verifies it belongs to this org before deleting
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug, areaId } = await params;

  try {
    const org = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const area = await prisma.serviceArea.findFirst({
      where: { id: parseInt(areaId), orgId: org.id },
    });

    if (!area) {
      return NextResponse.json({ error: "Service area not found" }, { status: 404 });
    }

    await prisma.serviceArea.delete({ where: { id: area.id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting service area:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}