import { NextResponse } from "next/server";

type AreaType = "NEIGHBORHOOD" | "CITY" | "COUNTY" | "STATE" | "COUNTRY";

// Nominatim needs a descriptive User-Agent per their usage policy
const NOMINATIM_UA = "ItsGiving/1.0 (https://its-giving.vercel.app)";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const value   = searchParams.get("value");
  const type    = searchParams.get("type") as AreaType;
  const placeId = searchParams.get("placeId");

  if (!value) {
    return NextResponse.json({ error: "value is required" }, { status: 400 });
  }

  try {
    let url: string;

    if (placeId?.startsWith("osm:R")) {
      // Direct OSM relation lookup — most accurate, used for neighborhoods
      const osmId = placeId.replace("osm:", "");
      url = `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmId}&polygon_geojson=1&format=json`;
    } else {
      // Name-based search — works well for cities, counties, states, countries
      url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=geojson&polygon_geojson=1&limit=1`;
    }

    const resp = await fetch(url, {
      headers: {
        "User-Agent": NOMINATIM_UA,
        "Accept": "application/json",
      },
      // Cache the boundary for 24 hours at the Next.js fetch cache layer
      // This means Nominatim is only hit once per unique area per day
      next: { revalidate: 86400 },
    });

    if (!resp.ok) {
      return NextResponse.json({ error: "Nominatim request failed" }, { status: 502 });
    }

    const data = await resp.json();

    // OSM lookup returns an array; search returns a GeoJSON FeatureCollection
    let feature: GeoJSON.Feature | null = null;

    if (placeId?.startsWith("osm:")) {
      const items = Array.isArray(data) ? data : [];
      if (items.length > 0 && items[0].geojson) {
        feature = {
          type: "Feature",
          geometry: items[0].geojson,
          properties: { value, type },
        };
      }
    } else {
      const fc = data as GeoJSON.FeatureCollection;
      if (fc.features?.length > 0) {
        feature = { ...fc.features[0], properties: { value, type } };
      }
    }

    if (!feature) {
      return NextResponse.json({ error: "Boundary not found" }, { status: 404 });
    }

    return NextResponse.json(feature);
  } catch (err) {
    console.error("Boundaries API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}