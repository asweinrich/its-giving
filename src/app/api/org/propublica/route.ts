// src/app/api/org/propublica/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // Extract query params
  const ein = searchParams.get("ein"); // Get EIN from query parameters

  if (!ein) {
    return NextResponse.json({ error: "EIN is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://projects.propublica.org/nonprofits/api/v2/organizations/${ein}.json`);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch organization data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 }); // Respond with the fetched data
  } catch (error) {
    console.error("Error fetching ProPublica API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
