import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const npid = searchParams.get("npid"); // Legacy support

  const identifier = slug || npid;

  if (!identifier) {
    return NextResponse.json({ error: "slug or npid is required" }, { status: 400 });
  }

  try {
    // Try to find organization by slug first, then by regulatoryId (npid)
    const organization = await prisma.organization.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { regulatoryId: identifier }
        ]
      },
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
