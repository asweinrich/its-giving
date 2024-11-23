import ImpactChart from './ImpactChart';
import ImpactMap from './ImpactMap';
import { useMemo } from "react";

interface FinancialRecord {
  year: number;
  revenue: number;
  expenses: number;
}

interface ImpactTabProps {
  financialRecords: FinancialRecord[];
}

export default function ImpactTab({ financialRecords }: ImpactTabProps) {
  // Memoize the map component to avoid unnecessary re-renders
  const MemoizedMap = useMemo(() => <ImpactMap />, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Impact</h2>

      <div className="">
        {MemoizedMap}
        <ImpactChart filingsWithData={financialRecords} />
      </div>

    </div>
  );
}
