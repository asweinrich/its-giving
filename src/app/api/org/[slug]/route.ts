import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    // Try to find organization by slug
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        detail: true,
        tags: true,
      },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Transform the data to match the expected format
    // If this is a nonprofit with an EIN, we can optionally fetch ProPublica data
    let propublicaData = null;
    if (organization.regulatoryId && organization.type === "NONPROFIT") {
      try {
        const response = await fetch(
          `https://projects.propublica.org/nonprofits/api/v2/organizations/${organization.regulatoryId}.json`
        );
        if (response.ok) {
          propublicaData = await response.json();
        }
      } catch (error) {
        console.log("ProPublica data not available:", error);
        // Continue without ProPublica data
      }
    }

    // Build response combining database and optional ProPublica data
    const responseData = {
      organization: {
        name: organization.name,
        slug: organization.slug,
        type: organization.type,
        description: organization.description,
        websiteUrl: organization.websiteUrl,
        instagram: organization.instagram,
        tiktok: organization.tiktok,
        mission: organization.detail?.mission,
        city: organization.detail?.city || propublicaData?.organization?.city,
        state: organization.detail?.state || propublicaData?.organization?.state,
        zipcode: organization.detail?.zipcode || propublicaData?.organization?.zipcode,
        address: organization.detail?.address || propublicaData?.organization?.address,
        ntee_code: organization.detail?.nteeCode || propublicaData?.organization?.ntee_code,
        ruling_date: organization.detail?.rulingDate || propublicaData?.organization?.ruling_date,
        regulatoryId: organization.regulatoryId,
        regulatoryIdType: organization.regulatoryIdType,
      },
      filings_with_data: propublicaData?.filings_with_data || [],
      detail: organization.detail,
      tags: organization.tags,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
