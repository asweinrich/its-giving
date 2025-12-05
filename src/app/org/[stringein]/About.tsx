import { CakeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import ImpactChart from './ImpactChart';
import ImpactMap from './ImpactMap';
import AboutText from './AboutText';
import { useMemo } from "react";




interface AboutTabProps {
  category: string;
  subcategory: string;
  city: string;
  state: string;
  address: string;
  rulingDate: string; // Assuming rulingDate is a string (e.g., "2018-08-01")
  financialRecords: FinancialRecord[];
  npid: string;
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
  npid
}: AboutTabProps) {

  const formatRulingDate = (rulingDate: string) => {
    const date = new Date(rulingDate); // Parse the ruling_date
    return date.toLocaleString("en-US", { month: "long", year: "numeric" }); // Format as "Month YYYY"
  };

  const formattedDate = formatRulingDate(rulingDate);

  const MemoizedMap = useMemo(() => <ImpactMap address={address} />, [address]);

  return (
    <div>
      <p>{category}</p>
      <p className="text-sm text-slate-300 mb-2">{subcategory}</p>
      <p className="text-slate-300 flex items-center space-x-1 mb-2">
        <BuildingOfficeIcon className="w-5 h-5 inline me-2 mb-0.5" />Based in <span className="text-slate-100">{city}, {state}</span>
      </p>
      <p className="text-slate-300 flex items-center space-x-1">
        <CakeIcon className="w-5 h-5 inline me-2 mb-0.5" />Established <span className="text-slate-100">{formattedDate}</span>
      </p>
      {MemoizedMap}
      <ImpactChart filingsWithData={financialRecords} />
      <AboutText npid={npid}/>
    </div>
  );
}
