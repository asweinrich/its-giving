"use client";

import Link from "next/link";
import React from "react";

export interface Tag {
  id: number;
  name: string;
  slug?: string;
}

export interface Org {
  id: number;
  name: string;
  regulatoryId?: string | null;
  type?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  tags?: Tag[] | null;
}

/**
 * Simple, presentational card for an Organization.
 * Adjust fields/styles as needed.
 */
export default function OrganizationCard({ org }: { org: Org }) {
  const initials =
    org.name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "ORG";

  const orgLink = org.regulatoryId ? `/org/${encodeURIComponent(org.regulatoryId)}` : `/org/id/${org.id}`;

  return (
    <div className="min-w-[260px] max-w-xs bg-slate-800 rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-md bg-slate-700 flex items-center justify-center text-white text-lg font-medium">
          {initials}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold leading-tight">
            <Link href={orgLink} className="hover:underline">
              {org.name}
            </Link>
          </h3>
          {org.type && (
            <div className="text-sm text-slate-400">
              {org.type.replace("_", " ").toLowerCase()}
            </div>
          )}
        </div>
      </div>

      {org.description ? (
        <p className="text-sm text-slate-300 mt-3">
          {org.description.length > 140 ? org.description.slice(0, 137) + "…" : org.description}
        </p>
      ) : (
        <p className="text-sm text-slate-500 mt-3">No description</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {(org.tags || []).slice(0, 6).map((t) => (
          <span key={t.id} className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded">
            {t.name}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-3">
        {org.websiteUrl ? (
          <a
            href={org.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Website
          </a>
        ) : null}

        <div className="flex gap-2 ml-auto">
          {org.instagram ? (
            <a
              href={org.instagram.startsWith("http") ? org.instagram : `https://instagram.com/${org.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              title="Instagram"
              className="text-pink-400"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10z"/>
                <circle cx="12" cy="12" r="3.2" fill="currentColor"/>
              </svg>
            </a>
          ) : null}

          {org.tiktok ? (
            <a
              href={org.tiktok.startsWith("http") ? org.tiktok : `https://www.tiktok.com/@${org.tiktok.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              title="TikTok"
              className="text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2v6.5c0 2.5 2 4.5 4.5 4.5V15c0 3-2.5 5.5-5.5 5.5S5.5 18 5.5 15 8 9.5 11 9.5V7A5 5 0 0 1 12 2z" />
              </svg>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}