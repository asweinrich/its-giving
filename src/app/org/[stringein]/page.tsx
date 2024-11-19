"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For accessing [stringein] dynamically
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import nteeCodes from "../../data/ntee_codes.json"; // Import the NTEE codes JSON

export default function OrgPage() {
  const { stringein } = useParams(); // Extract EIN from URL
  const [orgData, setOrgData] = useState(null); // Store nonprofit data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    // Fetch nonprofit data from ProPublica API
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/org/propublica?ein=${stringein}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        setOrgData(data.organization);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch organization data.");
      } finally {
        setLoading(false);
      }
    };

    if (stringein) fetchOrgData(); // Trigger fetch when EIN is available
  }, [stringein]);

  if (loading) {
    return <div className="text-center text-white">Loading organization data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!orgData) {
    return <div className="text-center text-white">No data available for this EIN.</div>;
  }

  const { name, city, state, subsection, ntee_code, total_revenue } = orgData;

  const getNteeDetails = (code) => {
    if (!code) return { category: "Unknown", subcategory: "Unknown" };

    const generalCategoryKey = code[0]; // First letter of the NTEE code
    const generalCategory = nteeCodes[generalCategoryKey];
    if (!generalCategory) return { category: "Unknown", subcategory: "Unknown" };

    const subcategory = generalCategory.subcategories[code] || "Unknown";
    return {
      category: generalCategory.title,
      subcategory: subcategory
    };
  }; 
  const { category, subcategory } = getNteeDetails(ntee_code);

  return (
    <div className="min-h-screen bg-slate-900 text-white max-w-5xl mx-auto rounded-3xl mt-6 overflow-hidden">
      {/* Header Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-40 md:h-60 bg-gradient-to-tr from-green-500 to-green-800"></div>
        {/* Profile Details */}
        <div className="absolute -bottom-20 left-4 flex items-center space-x-4">
          <div className="w-24 h-24 bg-slate-700 rounded-lg border-4 border-slate-900"></div>
          <div className="mt-1">
            <h1 className="text-lg font-bold">
              {name}
              <CheckBadgeIcon className="w-5 h-5 inline ms-1 mb-0.5 text-yellow-400" />
            </h1>
            <p className="text-sm text-slate-500">
              @handlehere
            </p>
            <p className="text-slate-500 text-sm">{subsection}</p>
          </div>
        </div>
      </div>

      {/* Organization Details */}
      <div className="p-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="">
              {category}
            </p>
            <p className="text-sm text-slate-300 mb-2">
              {subcategory}
            </p>
            <p className="text-slate-200">
              {city}, {state}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Financials</h2>
            <p>
              <strong>Total Revenue:</strong> ${total_revenue ? total_revenue.toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
