import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type AreaType = "NEIGHBORHOOD" | "CITY" | "COUNTY" | "STATE" | "COUNTRY";

const NOMINATIM_UA = "ItsGiving/1.0 (https://its-giving.vercel.app)";
const OVERSIZED_COUNTRIES = new Set(["United States", "Russia", "Canada", "China", "Brazil", "Australia"]);

let seattleNeighborhoods: GeoJSON.FeatureCollection | null = null;
async function getSeattleNeighborhoods(): Promise<GeoJSON.FeatureCollection> {
  if (seattleNeighborhoods) return seattleNeighborhoods;
  const filePath = path.join(process.cwd(), "public", "geo", "seattle-neighborhoods.geojson");
  const raw = await fs.readFile(filePath, "utf-8");
  seattleNeighborhoods = JSON.parse(raw) as GeoJSON.FeatureCollection;
  return seattleNeighborhoods;
}

function findNeighborhoodFeature(fc: GeoJSON.FeatureCollection, value: string): GeoJSON.Feature | null {
  const normalize = (s: string) => s.toLowerCase().trim();
  const target = normalize(value);

  // 1. Try exact S_HOOD match first (specific sub-neighborhood)
  const exactSubMatch = fc.features.find(
    (f) => normalize(f.properties?.S_HOOD ?? "") === target
  );
  if (exactSubMatch) return { ...exactSubMatch, properties: { value, type: "NEIGHBORHOOD" } };

  // 2. Try L_HOOD match — collect ALL sub-features and merge into MultiPolygon
  //    e.g. "Ballard" = Loyal Heights + Crown Hill + Adams + Whittier Heights etc.
  const lhoodMatches = fc.features.filter(
    (f) => normalize(f.properties?.L_HOOD ?? "") === target
  );

  if (lhoodMatches.length === 1) {
    return { ...lhoodMatches[0], properties: { value, type: "NEIGHBORHOOD" } };
  }

  if (lhoodMatches.length > 1) {
    // Merge all sub-polygons into a single MultiPolygon feature
    const coordinates = lhoodMatches.flatMap((f) => {
      const geom = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
      if (geom.type === "Polygon") return [geom.coordinates];
      if (geom.type === "MultiPolygon") return geom.coordinates;
      return [];
    });

    return {
      type: "Feature",
      properties: { value, type: "NEIGHBORHOOD" },
      geometry: {
        type: "MultiPolygon",
        coordinates,
      },
    };
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const value   = searchParams.get("value");
  const type    = searchParams.get("type") as AreaType;
  const placeId = searchParams.get("placeId");

  if (!value) {
    return NextResponse.json({ error: "value is required" }, { status: 400 });
  }

  if (type === "COUNTRY" && OVERSIZED_COUNTRIES.has(value)) {
    return NextResponse.json({ error: "Boundary too large" }, { status: 400 });
  }

  try {
    let feature: GeoJSON.Feature | null = null;

    // Neighborhoods — use official Seattle GeoJSON, not Nominatim
    if (type === "NEIGHBORHOOD") {
      const fc = await getSeattleNeighborhoods();
      feature = findNeighborhoodFeature(fc, value);
      // If not found in Seattle data, falls through to Nominatim below
    }

    // OSM direct lookup for any type with a real osm: placeId
    if (!feature && placeId?.startsWith("osm:R")) {
      const osmId = placeId.replace("osm:", "");
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmId}&polygon_geojson=1&format=json`,
        { headers: { "User-Agent": NOMINATIM_UA }, next: { revalidate: 86400 } }
      );
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0 && data[0].geojson) {
          feature = { type: "Feature", geometry: data[0].geojson, properties: { value, type } };
        }
      }
    }

    // Nominatim — cities, counties, states, countries + neighborhood fallback
    if (!feature) {
      const searchQuery = buildSearchQuery(value, type);
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=geojson&polygon_geojson=1&limit=1`,
        { headers: { "User-Agent": NOMINATIM_UA }, next: { revalidate: 86400 } }
      );

      if (!resp.ok) {
        return NextResponse.json({ error: "Nominatim request failed" }, { status: 502 });
      }

      const fc = await resp.json() as GeoJSON.FeatureCollection;
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

function buildSearchQuery(value: string, type: AreaType): string {
  switch (type) {
    case "COUNTY": return value;
    case "STATE":  return `${value}, United States`;
    case "CITY":   return `${value}, Washington, United States`;
    default:       return value;
  }
}