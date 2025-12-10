import { CakeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import ImpactChart from './ImpactChart';
import ImpactMap from './ImpactMap';
import AboutText from './AboutText';
import { useMemo } from "react";




interface AboutTabProps {
  category: string | null;
  subcategory: string | null;
  city?: string;
  state?: string;
  address?: string;
  rulingDate?: string;
  financialRecords: FinancialRecord[];
  orgSlug: string;
}

interface FinancialRecord {
  year: number;
  revenue: number;
  expenses: number;
}

export default function AboutTab({
  category,
  subcategory,
  city,
  state,
  address,
  rulingDate,
  financialRecords,
  orgSlug
}: AboutTabProps) {

  const formatRulingDate = (rulingDate: string | undefined) => {
    if (!rulingDate) return null;
    const date = new Date(rulingDate); // Parse the ruling_date
    return date.toLocaleString("en-US", { month: "long", year: "numeric" }); // Format as "Month YYYY"
  };

  const formattedDate = formatRulingDate(rulingDate);

  const MemoizedMap = useMemo(() => address ? <ImpactMap address={address} /> : null, [address]);

  return (
    <div>
      {category && <p>{category}</p>}
      {subcategory && <p className="text-sm text-slate-300 mb-2">{subcategory}</p>}
      {city && state && (
        <p className="text-slate-300 flex items-center space-x-1 mb-2">
          <BuildingOfficeIcon className="w-5 h-5 inline me-2 mb-0.5" />Based in <span className="text-slate-100">{city}, {state}</span>
        </p>
      )}
      {formattedDate && (
        <p className="text-slate-300 flex items-center space-x-1">
          <CakeIcon className="w-5 h-5 inline me-2 mb-0.5" />Established <span className="text-slate-100">{formattedDate}</span>
        </p>
      )}
      {MemoizedMap}
      {financialRecords.length > 0 && <ImpactChart filingsWithData={financialRecords} />}
      <AboutText orgSlug={orgSlug}/>
    </div>
  );
}
