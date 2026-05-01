"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_DEFAULT_STYLE } from "@/config/mapStyle";
import { SERVICE_AREA_OPTIONS } from "@/app/data/serviceAreas";

type AreaType = "NEIGHBORHOOD" | "CITY" | "COUNTY" | "STATE" | "COUNTRY";

interface ServiceArea {
  id: number;
  type: AreaType;
  value: string;
  placeId: string | null;
}

interface ServiceAreaMapProps {
  serviceAreas: ServiceArea[];
}

const SKIP_POLYGON_TYPES: AreaType[] = [];

async function fetchBoundary(area: ServiceArea): Promise<GeoJSON.Feature | null> {
  if (SKIP_POLYGON_TYPES.includes(area.type)) return null;
  try {
    const params = new URLSearchParams({ value: area.value, type: area.type });
    if (area.placeId) params.set("placeId", area.placeId);

    // Look up region from static data and pass it for neighborhood context
    const staticMatch = SERVICE_AREA_OPTIONS.find(
      (o) => o.value === area.value && o.type === area.type
    );
    if (staticMatch?.region) params.set("region", staticMatch.region);

    const res = await fetch(`/api/boundaries?${params}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getFeatureCoords(geometry: GeoJSON.Geometry): [number, number][] {
  if (geometry.type === "Polygon") {
    return geometry.coordinates[0] as [number, number][];
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.flatMap((poly) => poly[0]) as [number, number][];
  }
  return [];
}

export default function ServiceAreaMap({ serviceAreas }: ServiceAreaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    const mappableAreas = serviceAreas.filter((a) => !SKIP_POLYGON_TYPES.includes(a.type));
    const container = mapContainer.current;

    if (!mappableAreas.length || !container) {
      setStatus("empty");
      return;
    }

    let cancelled = false;

    const map = new maplibregl.Map({
      container,
      style: MAP_DEFAULT_STYLE,
      center: [-98.5795, 39.8283],
      zoom: 4,
      interactive: false,
    });

    map.on("error", (e) => {
      console.error("[ServiceAreaMap] map error:", e.error);
    });

    Promise.all([
      new Promise<void>((resolve) => map.on("load", () => resolve())),
      Promise.all(mappableAreas.map(fetchBoundary)),
    ]).then(([, results]) => {
      if (cancelled) return;

      const features = (results as (GeoJSON.Feature | null)[]).filter(Boolean) as GeoJSON.Feature[];

      if (features.length === 0) {
        setStatus("ready");
        return;
      }

      const allCoords = features.flatMap((f) => getFeatureCoords(f.geometry));
      if (allCoords.length > 0) {
        const lngs = allCoords.map((c) => c[0]);
        const lats  = allCoords.map((c) => c[1]);
        map.fitBounds(
          new maplibregl.LngLatBounds(
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)]
          ),
          { padding: 48, maxZoom: 14, duration: 0 }
        );
      }

      const geojson: GeoJSON.FeatureCollection = { type: "FeatureCollection", features };
      map.addSource("service-areas", { type: "geojson", data: geojson });
      map.addLayer({
        id: "service-areas-fill",
        type: "fill",
        source: "service-areas",
        paint: { "fill-color": "#22c55e", "fill-opacity": 0.15 },
      });
      map.addLayer({
        id: "service-areas-border",
        type: "line",
        source: "service-areas",
        paint: { "line-color": "#22c55e", "line-width": 2, "line-opacity": 0.9 },
      });

      setStatus("ready");
    }).catch((err) => {
      console.error("[ServiceAreaMap] init error:", err);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
      map.remove();
    };
  }, [serviceAreas]);

  if (status === "empty") return null;

  return (
    <div className="relative mt-4 mb-2">
      {status === "loading" && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-slate-800/80"
          style={{ borderRadius: "16px" }}
        >
          <span className="text-sm text-slate-400">Loading service area map…</span>
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        Service Area Map
      </p>
      <div
        ref={mapContainer}
        style={{
          height: "320px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 0 16px #222",
          cursor: "default",
        }}
      />
    </div>
  );
}