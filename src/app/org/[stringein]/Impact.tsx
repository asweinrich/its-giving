import ImpactMap from './ImpactMap';
import { useMemo } from "react";

interface ImpactTabProps {
  address: string;
  // ... other props as needed
}


const ImpactTab = ({ address }: ImpactTabProps) => {

  console.log('address: ', address)
  // Memoize the map component to avoid unnecessary re-renders
  const MemoizedMap = useMemo((address) => <ImpactMap address={address}/>, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Impact</h2>

      <div className="">
        {MemoizedMap}
        
      </div>

    </div>
  );
}

export default ImpactTab;