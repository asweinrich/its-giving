"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For accessing [orgSlug] dynamically
import { LinkIcon } from "@heroicons/react/24/outline";
import nteeCodes from "../../data/ntee_codes.json"; // Import the NTEE codes JSON
import AboutTab from "./About";
import ImpactTab from "./Impact";
import VerificationBadge from "../../components/VerificationBadge";

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
  verified?: boolean; // optional verification flag
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

/**
 * Mapping of backend type values to user-visible labels.
 * Extend these if your backend stores different enum keys.
 */
const TYPE_LABELS: Record<string, string> = {
  NONPROFIT: "Nonprofit",
  FOUNDATION: "Foundation",
  GRASSROOTS: "Grassroots Effort",
  GOVERNMENTAL: "Governmental",
  FAITH_BASED: "Faith-based",
  PTA: "PTA",
  BUSINESS: "Business",
  OTHER: "Organization",
};

/**
 * Color palette per type. You can change these hex values to alter the verification icon color.
 * (Note: VerificationBadge has its own palette for standalone use; keep in sync if you want identical colors.)
 */
const TYPE_COLORS: Record<string, string> = {
  NONPROFIT: "#0ea5a4", // teal
  FOUNDATION: "#7c3aed", // purple
  GRASSROOTS: "#f59e0b", // amber
  GOVERNMENTAL: "#ef4444", // red
  FAITH_BASED: "#fb7185", // pink
  PTA: "#06b6d4", // cyan
  BUSINESS: "#3b82f6", // blue
  OTHER: "#94a3b8", // slate
};

/** Derive a human label for given type key */
function getTypeLabel(type?: string | null) {
  if (!type) return TYPE_LABELS.OTHER;
  return TYPE_LABELS[type] ?? type;
}

/** Derive color for given type key */
function getTypeColor(type?: string | null) {
  if (!type) return TYPE_COLORS.OTHER;
  return TYPE_COLORS[type] ?? TYPE_COLORS.OTHER;
}

/**
 * Small inline Instagram icon resembling Heroicons outline style.
 */
function InstagramIcon({ className = "w-4 h-4 inline me-2" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.2" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Small inline TikTok-like icon (simplified) matching heroicons outline feel.
 * Note: not the official logo, just a simple glyph for UI affordance.
 */
function TikTokIcon({ className = "w-4 h-4 inline me-2 mb-0.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M14 6v6.5a3.5 3.5 0 11-3.5-3.5V6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="17.5" r="2.2" strokeWidth="1.2" />
    </svg>
  );
}

/** Normalize social input to a usable absolute URL for Instagram and TikTok.
 * - If the value already looks like a URL (starts with http), return as-is.
 * - If it starts with '@', remove it and build a profile URL.
 * - Otherwise treat as handle and build a profile URL.
 */
function normalizeSocialUrl(platform: "instagram" | "tiktok", value?: string | null) {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  // remove leading @ if present
  const handle = v.replace(/^@/, "");
  if (platform === "instagram") {
    return `https://instagram.com/${encodeURIComponent(handle)}`;
  }
  // platform === "tiktok"
  return `https://www.tiktok.com/@${encodeURIComponent(handle)}`;
}

/** Pick a friendly display for social link: prefer showing handle when possible */
function socialDisplayText(raw?: string | null) {
  if (!raw) return "";
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) {
    try {
      const url = new URL(v);
      // show path portion when possible (e.g., instagram.com/handle)
      return url.pathname.replace(/^\//, "") || url.host;
    } catch {
      return v;
    }
  }
  return v.startsWith("@") ? v : `@${v}`;
}

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
    type,
    description,
    mission,
    websiteUrl,
    instagram,
    tiktok,
    city,
    state,
    ntee_code,
    ruling_date,
    zipcode,
    address,
    verified,
  } = orgData.organization;
  const fullAddress = [address, city, state, zipcode].filter(Boolean).join(", ");

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
      .filter((filing) => filing.tax_prd_yr && filing.totrevenue !== undefined) // Ensure required fields exist
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

  // derive label + color for type display
  const typeLabel = getTypeLabel(type);
  const typeColor = getTypeColor(type);

  const websiteHref = websiteUrl && websiteUrl.trim() ? websiteUrl.trim() : null;
  const instagramHref = normalizeSocialUrl("instagram", instagram);
  const tiktokHref = normalizeSocialUrl("tiktok", tiktok);

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
        <div className="flex-col items-center">
          <h1 className="text-xl md:text-2xl font-semibold inline leading-tight px-2 flex items-center">
            {name}
          </h1>
          <span className="flex items-center px-1.5 mt-1 mb-2">
            <VerificationBadge orgSlug={slug || normalizedSlug || ""} />
            <span className="ml-1 font-light opacity-70">
              {typeLabel}
            </span>
          </span>
        </div>

        

        {displayMission && (
          <p className="mb-3 mt-1 px-2 font-light md:text-lg max-w-4xl">{displayMission}</p>
        )}

        {/* Links: website, instagram, tiktok (display only if present; in this order) */}
        <div className="mb-3 mt-2 px-2 flex flex-col gap-0.5">
          {websiteHref && (
            <p className="text-slate-300">
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-80 inline-flex items-center"
              >
                <LinkIcon className="w-4 h-4 inline me-2 mb-0.5" />
                <span className="truncate max-w-xl">{websiteHref}</span>
              </a>
            </p>
          )}

          {instagramHref && (
            <p className="text-slate-400">
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-80 flex items-center"
              >
                <InstagramIcon />
                <span className="truncate max-w-xl">{socialDisplayText(instagram)}</span>
              </a>
            </p>
          )}

          {tiktokHref && (
            <p className="text-slate-400">
              <a
                href={tiktokHref}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-80 inline-flex items-center"
              >
                <TikTokIcon />
                <span className="truncate max-w-xl">{socialDisplayText(tiktok)}</span>
              </a>
            </p>
          )}
        </div>

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
          {activeTab === "impact" && <ImpactTab address={fullAddress} />}
        </div>
      </div>
    </div>
  );
}