"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For accessing [orgSlug] dynamically
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { LinkIcon } from "@heroicons/react/24/outline";
import nteeCodes from "../../data/ntee_codes.json"; // Import the NTEE codes JSON
import AboutTab from "./About";
import ImpactTab from "./Impact";

interface Organization {
  name: string;
  slug?: string;
  type?: string;
  description?: string;
  websiteUrl?: string;
  instagram?: string;
  tiktok?: string;
  mission?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  address?: string;
  ntee_code?: string;
  ruling_date?: string;
  regulatoryId?: string;
  regulatoryIdType?: string;
}

interface OrgData {
  organization: Organization;
  filings_with_data?: Filing[];
}

type NteeCodes = {
  [key: string]: {
    title: string;
    subcategories: {
      [key: string]: string;
    };
  };
};

const nteeCodesTyped: NteeCodes = nteeCodes; // Ensure TypeScript validation

// EIN pattern for validating EIN format (XX-XXXXXXX)
const EIN_PATTERN = /^\d{2}-\d{7}$/;

type Filing = {
  tax_prd_yr: number;
  totrevenue?: number;
  totfuncexpns?: number;
  totnetassetsend?: number;
  totexcessyr?: number;
};

export default function OrgPage() {
  const { orgSlug } = useParams(); // Extract slug from URL
  const [orgData, setOrgData] = useState<OrgData | null>(null); // Store org data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about"); // Track active tab

  // Normalize slug parameter (can be array or string)
  const normalizedSlug = Array.isArray(orgSlug) ? orgSlug[0] : orgSlug;

  useEffect(() => {
    // Fetch organization data from API
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        // Support both slug-based and legacy EIN-based lookups
        const slug = normalizedSlug;
        
        // Try slug-based lookup first
        let response = await fetch(`/api/org/${slug}`);
        
        // If not found and slug looks like an EIN, try ProPublica API as fallback
        if (!response.ok && slug && EIN_PATTERN.test(slug)) {
          response = await fetch(`/api/org/propublica?ein=${slug}`);
        }
        
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data: OrgData = await response.json(); // Explicitly type the response
        setOrgData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch organization data.");
      } finally {
        setLoading(false);
      }
    };

    if (orgSlug) fetchOrgData(); // Trigger fetch when slug is available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgSlug]); // normalizedSlug is derived from orgSlug, so only orgSlug is needed

  if (loading) {
    return <div className="text-center text-white">Loading organization data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!orgData?.organization) {
    return <div className="text-center text-white">No data available for this organization.</div>;
  }

  const { 
    name, 
    slug, 
    description, 
    mission, 
    websiteUrl, 
    city, 
    state, 
    ntee_code, 
    ruling_date, 
    zipcode, 
    address 
  } = orgData.organization;
  const fullAddress = [address, city, state, zipcode].filter(Boolean).join(', ');

  const getNteeDetails = (code: string | undefined) => {
    if (!code || code.length === 0) return { category: null, subcategory: null };

    const generalCategoryKey = code[0]; // First letter of the NTEE code
    const generalCategory = nteeCodesTyped[generalCategoryKey] || { title: "Unknown", subcategories: {} };
    const subcategory = generalCategory.subcategories[code] || "Unknown";

    return {
      category: generalCategory.title,
      subcategory: subcategory,
    };
  };
  const { category, subcategory } = getNteeDetails(ntee_code);
  
  // Use mission from organization data if available, otherwise fall back to description
  const displayMission = mission || description;

  const processFinancialData = (filingsWithData: Filing[]) => {
    if (!Array.isArray(filingsWithData) || filingsWithData.length === 0) {
      return [];
    }

    return filingsWithData
      .filter(
        (filing) =>
          filing.tax_prd_yr && filing.totrevenue !== undefined // Ensure required fields exist
      )
      .map((filing) => ({
        year: filing.tax_prd_yr,
        revenue: (filing.totrevenue || 0) / 100, // Adjust revenue
        expenses: (filing.totfuncexpns || 0) / 100, // Adjust expenses
        netAssets: (filing.totnetassetsend || 0) / 100, // Adjust net assets
        profit: (filing.totexcessyr || 0) / 100, // Adjust profit
      }))
      .sort((a, b) => a.year - b.year); // Sort in ascending order of year
  };
  const filingsWithData = orgData?.filings_with_data || [];
  const financialRecords = processFinancialData(filingsWithData);

  return (
    <div className="min-h-screen bg-slate-900 text-white max-w-5xl mx-auto rounded-2xl mt-6 overflow-hidden">
      {/* Header Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-40 md:h-60 bg-gradient-to-tr from-green-500 to-green-800"></div>
        {/* Profile Details */}
        <div className="absolute -bottom-14 left-3 md:left-5 flex items-start space-x-4">
          <div className="w-24 h-24 bg-slate-700 rounded-lg border-4 border-slate-900"></div>
        </div>
      </div>


      {/* Tabs Section */}
      <div className="mt-16 px-2 md:px-4">
        <h1 className="text-xl font-bold inline leading-tight px-2">
          {name}
          <CheckBadgeIcon className="w-5 h-5 inline ms-1 text-slate-400" />
        </h1>
        {slug && (
          <p className="px-2 text-slate-500 mb-2 pt-2">
            @{slug}
          </p>
        )}
        {displayMission && (
          <p className="mb-2 px-2 font-light md:text-lg max-w-4xl">
            {displayMission}
          </p>
        )}
        {websiteUrl && (
          <p className="mb-6 pt-1 px-2 text-slate-400">
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-80">
              <LinkIcon className="w-4 h-4 inline me-2 mb-0.5" />
              {websiteUrl}
            </a>
          </p>
        )}
        <div className="flex justify-start border-b border-slate-700 overflow-x-scroll scrollbar-hide">
          <button
            className={`py-2 px-4 ${
              activeTab === "about" ? "border-b-2 border-green-500 text-green-500" : "border-b-2 border-slate-700 text-slate-400"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "impact" ? "border-b-2 border-green-500 text-green-500" : "border-b-2 border-slate-700 text-slate-400"
            }`}
            onClick={() => setActiveTab("impact")}
          >
            Impact
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "activity" ? "border-b-2 border-green-500 text-green-500" : "border-b-2 border-slate-700 text-slate-400"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "fundraisers" ? "border-b-2 border-green-500 text-green-500" : "border-b-2 border-slate-700 text-slate-400"
            }`}
            onClick={() => setActiveTab("fundraisers")}
          >
            Fundraisers
          </button>
          

        </div>

        {/* Tab Content */}
        <div className="mt-4 px-2">
          {activeTab === "about" && (
            <AboutTab
              category={category}
              subcategory={subcategory}
              city={city}
              state={state}
              address={fullAddress}
              rulingDate={ruling_date}
              financialRecords={financialRecords}
              orgSlug={slug || normalizedSlug || ""}
            />
          )}
          {activeTab === "impact" && (
            <ImpactTab address={fullAddress} />
          )}
        </div>
      </div>

      
    </div>
  );
}
