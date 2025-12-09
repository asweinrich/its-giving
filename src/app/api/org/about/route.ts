import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const npid = searchParams.get("npid") || '00-0000000';

  if (!npid) {
    return NextResponse.json({ error: "npid is required" }, { status: 400 });
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: { regulatoryId: npid },
      select: { description: true },
    });

    if (!organization) {
      return NextResponse.json({ error: "organization not found" }, { status: 404 });
    }

    return NextResponse.json({ about: organization.description });
  } catch (error) {
    console.error("Error fetching about text:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
