"use client";

import { useMemo } from "react";
import {
  MapPinIcon,
} from "@heroicons/react/24/outline";
import ImpactMap from "./ImpactMap";
import ServiceAreaMap from "./ServiceAreaMap";

type AreaType = "NEIGHBORHOOD" | "CITY" | "COUNTY" | "STATE" | "COUNTRY";

interface ServiceArea {
  id: number;
  type: AreaType;
  value: string;
  placeId: string | null;
}

interface AboutAppProps {
  mission?: string;
  city?: string;
  state?: string;
  address?: string;
  websiteHref?: string | null;
  instagramHref?: string | null;
  tiktokHref?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  serviceAreas?: ServiceArea[];
  brandColor?: string;
}


export default function AboutApp({
  city,
  state,
  address,
  serviceAreas = [],
  brandColor = "#22c55e",
}: AboutAppProps) {

  const MemoizedHQMap = useMemo(
    () => (address && serviceAreas.length === 0 ? <ImpactMap address={address} /> : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, serviceAreas.length]
  );

  return (
    <div className="space-y-6">

      {/* Location */}
      {(city || state) && (
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPinIcon className="w-4 h-4 flex-shrink-0" style={{ color: brandColor }} />
          <span>Based in <span className="text-white font-medium">{[city, state].filter(Boolean).join(", ")}</span></span>
        </div>
      )}

      

      {/* Service areas */}
      {serviceAreas.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Serves</p>
          <div className="flex flex-wrap gap-1.5">
            {serviceAreas.map((area) => (
              <span
                key={area.id}
                className="text-xs px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800 text-slate-300"
              >
                {area.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Map — service area map if areas exist, HQ pin map as fallback */}
      {serviceAreas.length > 0
        ? <ServiceAreaMap serviceAreas={serviceAreas} />
        : MemoizedHQMap
      }

    </div>
  );
}