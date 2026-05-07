"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LinkIcon,
  InformationCircleIcon,
  HeartIcon,
  HandRaisedIcon,
  BoltIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import AboutApp from "./About";
import VerificationBadge from "../../components/VerificationBadge";
import FitText from '../../components/FitText';


type AreaType = "NEIGHBORHOOD" | "CITY" | "COUNTY" | "STATE" | "COUNTRY";

interface ServiceArea {
  id: number;
  type: AreaType;
  value: string;
  placeId: string | null;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  emoji?: string | null;
  color?: string | null;
}

interface Organization {
  name: string;
  slug?: string;
  type?: string;
  description?: string;
  brandColor?: string;
  imageUrl?: string;
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
  founded?: string;
}

interface OrgData {
  organization: Organization;
  serviceAreas?: ServiceArea[];
  tags?: Tag[];
  detail?: { mission?: string | null; address?: string | null } | null;
}

const TYPE_LABELS: Record<string, string> = {
  NONPROFIT: "Nonprofit",
  FOUNDATION: "Foundation",
  GRASSROOTS: "Grassroots",
  GOVERNMENTAL: "Governmental",
  FAITH_BASED: "Faith-based",
  PTA: "PTA",
};

function normalizeSocialUrl(platform: "instagram" | "tiktok", value?: string | null) {
  if (!value) return null;
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  return platform === "instagram"
    ? `https://instagram.com/${encodeURIComponent(handle)}`
    : `https://www.tiktok.com/@${encodeURIComponent(handle)}`;
}

function socialHandle(raw?: string | null) {
  if (!raw) return "";
  const v = raw.trim();
  if (/^https?:\/\//i.test(v)) {
    try { return new URL(v).pathname.replace(/^\//, ""); } catch { return v; }
  }
  return v.startsWith("@") ? v : `@${v}`;
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.2" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M14 6v6.5a3.5 3.5 0 11-3.5-3.5V6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="17.5" r="2.2" strokeWidth="1.2" />
    </svg>
  );
}

// All possible apps — base ones always shown, extras greyed unless set up
const BASE_APPS = [
  { key: "about", label: "About", icon: InformationCircleIcon },
  { key: "fundraisers", label: "Fundraisers", icon: HeartIcon },
  { key: "support", label: "Support", icon: HandRaisedIcon },
  { key: "activity", label: "Activity", icon: BoltIcon },
];

const EXTRA_APPS = [
  { key: "resources", label: "Resources", icon: BookOpenIcon },
  { key: "events", label: "Events", icon: CalendarDaysIcon },
  { key: "locations", label: "Locations", icon: MapPinIcon },
  { key: "volunteer", label: "Volunteer", icon: UserGroupIcon },
  { key: "newsletter", label: "Newsletter", icon: EnvelopeIcon },
];

// For now nothing is "set up" except About — expand this as features get built
const ACTIVE_APPS = new Set(["about"]);

export default function OrgPage() {
  const { orgSlug } = useParams();
  const [orgData, setOrgData] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeApp, setActiveApp] = useState("about");

  const normalizedSlug = Array.isArray(orgSlug) ? orgSlug[0] : orgSlug;

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/org/${normalizedSlug}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data: OrgData = await response.json();
        setOrgData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch organization data.");
      } finally {
        setLoading(false);
      }
    };
    if (orgSlug) fetchOrgData();
  }, [orgSlug, normalizedSlug]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400 text-sm">Loading…</div>
    </div>
  );

  if (error || !orgData?.organization) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-red-400 text-sm">{error ?? "Organization not found."}</div>
    </div>
  );

  const org = orgData.organization;
  const serviceAreas = orgData.serviceAreas ?? [];
  const tags = orgData.tags ?? [];

  const brandColor = org.brandColor ?? "#22c55e";
  const typeLabel = TYPE_LABELS[org.type ?? ""] ?? org.type ?? "";
  const mission = org.mission ?? orgData.detail?.mission ?? org.description ?? "";
  const address = org.address ?? orgData.detail?.address ?? "";
  const fullAddress = [address, org.city, org.state, org.zipcode].filter(Boolean).join(", ");

  const websiteHref = org.websiteUrl?.trim() || null;
  const instagramHref = normalizeSocialUrl("instagram", org.instagram);
  const tiktokHref = normalizeSocialUrl("tiktok", org.tiktok);

  const orgInitials = org.name
    .split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase();

  // Founded year only
  const foundedYear = org.founded
    ? new Date(org.founded).getFullYear()
    : org.ruling_date
    ? new Date(org.ruling_date).getFullYear()
    : null;

  const allApps = [...BASE_APPS, ...EXTRA_APPS];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── BILLBOARD HEADER ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brandColor}ee 0%, ${brandColor}88 50%, #0f172a 100%)`,
          minHeight: "260px",
        }}
      >
        {/* Big color blob for depth */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: brandColor }}
        />

        <div className="relative p-5 flex flex-col min-h-[260px]">
          <div className="flex items-around">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg border-2 border-white/20"
              style={{ backgroundColor: `${brandColor}cc` }}
            >
              {orgInitials}
            </div>
            {/* Type + verified badge */}
            <div className="flex flex-col items-center gap-2 ms-auto">
              {typeLabel && (
                <span
                  className="flex py-1 text-sm font-semibold px-2 rounded-lg border border-white/20 text-white/80"
                  style={{ backgroundColor: `${brandColor}44` }}
                >
                  <VerificationBadge orgSlug={org.slug || normalizedSlug || ""} /> &nbsp;{typeLabel}
                </span>
              )}
              
              {foundedYear && (
                <span className="ms-auto me-2 text-xs text-white/70">est. {foundedYear}</span>
              )}
            </div>
          </div>


          {/* Org name — big billboard style */}
          <FitText
            text={org.name}
            fontFamily="Groopa, sans-serif"
            fontWeight="400"
            color="white"
            className="me-0 -ms-1 text-shadow-lg text-center mx-0"
          />

          
        </div>
        {mission && (
          <div className="px-6 pb-4 mb-4">
            <p className="text-slate-200 text-sm font-italic max-w-2xl">{mission}</p>
          </div>
        )}
      </div>

      {/* ── MISSION STRIP ── */}
      

      {/* ── TAGS ── */}
      {tags.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-slate-800">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium"
              style={{
                backgroundColor: tag.color ? `${tag.color}22` : "#1e293b",
                borderColor: tag.color ?? "#475569",
                color: tag.color ?? "#94a3b8",
              }}
            >
              {tag.emoji && <span>{tag.emoji}</span>}
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* ── GIVE + ACTION CALLS ── */}
      <div className="px-5 py-5 border-b border-slate-800">
        <button
          className="w-full py-3.5 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: brandColor }}
        >
          Give
        </button>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 hover:border-slate-500 transition-all">
            Volunteer
          </button>
          <button className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 hover:border-slate-500 transition-all">
            Share
          </button>
        </div>
      </div>

      {/* ── APPS ROW ── */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {allApps.map(({ key, label, icon: Icon }) => {
            const isActive = activeApp === key;
            const isEnabled = ACTIVE_APPS.has(key);
            return (
              <button
                key={key}
                onClick={() => isEnabled && setActiveApp(key)}
                disabled={!isEnabled}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 w-16 pt-3 pb-2.5 rounded-2xl border transition-all ${
                  isActive
                    ? "border-2 shadow-lg"
                    : isEnabled
                    ? "bg-slate-800 border-slate-700 hover:border-slate-500"
                    : "bg-slate-900 border-slate-800 opacity-40 cursor-not-allowed"
                }`}
                style={isActive ? {
                  backgroundColor: `${brandColor}22`,
                  borderColor: brandColor,
                } : {}}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: isActive ? brandColor : isEnabled ? "#94a3b8" : "#475569" }}
                />
                <span
                  className="text-[10px] font-medium leading-none"
                  style={{ color: isActive ? brandColor : isEnabled ? "#cbd5e1" : "#475569" }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── APP CONTENT ── */}
      <div className="px-5 py-5">

        {activeApp === "about" && (
          <AboutApp
            mission={mission}
            city={org.city}
            state={org.state}
            address={fullAddress}
            websiteHref={websiteHref}
            instagramHref={instagramHref}
            tiktokHref={tiktokHref}
            instagram={org.instagram}
            tiktok={org.tiktok}
            serviceAreas={serviceAreas}
            brandColor={brandColor}
          />
        )}

        {activeApp === "fundraisers" && (
          <div className="text-center py-12 text-slate-500">
            <HeartIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No fundraisers yet.</p>
          </div>
        )}

        {activeApp === "support" && (
          <div className="text-center py-12 text-slate-500">
            <HandRaisedIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Support options coming soon.</p>
          </div>
        )}

        {activeApp === "activity" && (
          <div className="text-center py-12 text-slate-500">
            <BoltIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No recent activity.</p>
          </div>
        )}

      </div>

      {/* ── FOOTER DISCLAIMER ── */}
      <div className="px-5 pb-6 pt-2 border-t border-slate-800 mt-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {org.regulatoryId && (
            <span>{org.regulatoryIdType ?? "ID"}: {org.regulatoryId}</span>
          )}
          {org.ntee_code && <span>NTEE: {org.ntee_code}</span>}
          {typeLabel && <span>{typeLabel}</span>}
        </div>
      </div>

    </div>
  );
}