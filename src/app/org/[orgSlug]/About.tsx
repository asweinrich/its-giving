import { CakeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import ImpactChart from "./ImpactChart";
import ImpactMap from "./ImpactMap";
import ServiceAreaMap from "./ServiceAreaMap";
import AboutText from "./AboutText";
import { useMemo } from "react";

type AreaType = "NEIGHBORHOOD" | "CITY" | "COUNTY" | "STATE" | "COUNTRY";

interface ServiceArea {
  id: number;
  type: AreaType;
  value: string;
  placeId: string | null;
}

interface FinancialRecord {
  year: number;
  revenue: number;
  expenses: number;
}

interface AboutTabProps {
  category: string | null;
  subcategory: string | null;
  city?: string;
  state?: string;
  address?: string;
  rulingDate?: string;
  financialRecords: FinancialRecord[];
  orgSlug: string;
  serviceAreas?: ServiceArea[];
}

export default function AboutTab({
  category,
  subcategory,
  city,
  state,
  address,
  rulingDate,
  financialRecords,
  orgSlug,
  serviceAreas = [],
}: AboutTabProps) {
  const formatRulingDate = (rulingDate: string | undefined) => {
    if (!rulingDate) return null;
    const date = new Date(rulingDate);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const formattedDate = formatRulingDate(rulingDate);

  // Show the HQ pin map only when there are no service areas
  const MemoizedHQMap = useMemo(
    () => (address && serviceAreas.length === 0 ? <ImpactMap address={address} /> : null),
    [address, serviceAreas.length]
  );

  return (
    <div>
      {category && <p>{category}</p>}
      {subcategory && <p className="text-sm text-slate-300 mb-2">{subcategory}</p>}
      {city && state && (
        <p className="text-slate-300 flex items-center space-x-1 mb-2">
          <BuildingOfficeIcon className="w-5 h-5 inline me-2 mb-0.5" />
          Based in <span className="text-slate-100 ml-1">{city}, {state}</span>
        </p>
      )}
      {formattedDate && (
        <p className="text-slate-300 flex items-center space-x-1">
          <CakeIcon className="w-5 h-5 inline me-2 mb-0.5" />
          Established <span className="text-slate-100 ml-1">{formattedDate}</span>
        </p>
      )}

      {/* Service area map — shown when org has service areas */}
      {serviceAreas.length > 0 && <ServiceAreaMap serviceAreas={serviceAreas} />}

      {/* HQ pin map — fallback when no service areas defined */}
      {MemoizedHQMap}

      {financialRecords.length > 0 && <ImpactChart filingsWithData={financialRecords} />}
      <AboutText orgSlug={orgSlug} />
    </div>
  );
}