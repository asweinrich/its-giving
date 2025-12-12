'use client';

import React, { useEffect, useState } from 'react';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';
import { CheckBadgeIcon as CheckBadgeOutline } from '@heroicons/react/24/outline';

type OrgApiResponse = {
  organization?: {
    slug?: string;
    type?: string | null;
    verified?: boolean | null;
  } | null;
};

/**
 * VerificationBadge
 * Props:
 * - orgSlug: string (required) — slug/identifier for the org to fetch
 * - size?: number (optional) — badge icon size in px (defaults to 22)
 *
 * Behavior:
 * - Fetches /api/org/[slug] to determine org.type and org.verified
 * - Renders:
 *    - outline check badge icon (colored by type) for unverified orgs (opacity 0.7)
 *    - filled check badge icon (colored by type) for verified orgs (opacity 1.0)
 *
 * Both icons use the color assigned to the org type.
 */
export default function VerificationBadge({
  orgSlug,
  size = 20,
}: {
  orgSlug: string;
  size?: number;
}) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [type, setType] = useState<string | null>(null);

  // Color palette per type (keep in sync with other usages)
  const TYPE_COLORS: Record<string, string> = {
    NONPROFIT: '#0EA5FF', // sky-500
    FOUNDATION: '#7DD3FC', // sky-300
    GRASSROOTS: '#34D399', // green-400
    GOVERNMENTAL: '#9CA3AF', // light grey (gray-400)
    FAITH_BASED: '#F87171', // red-400
    PTA: '#FCD34D', // amber-300
    BUSINESS: '#3B82F6', // fallback / keep existing for business
    OTHER: '#94A3B8', // fallback slate
  };

  const getColorForType = (t?: string | null) => {
    if (!t) return TYPE_COLORS.OTHER;
    return TYPE_COLORS[t] ?? TYPE_COLORS.OTHER;
  };

  useEffect(() => {
    let mounted = true;
    if (!orgSlug) return;

    const fetchOrg = async () => {
      try {
        const res = await fetch(`/api/org/${encodeURIComponent(orgSlug)}`);
        if (!res.ok) {
          if (mounted) {
            setVerified(null);
            setType(null);
          }
          return;
        }
        const json = (await res.json()) as OrgApiResponse;
        if (!mounted) return;
        setVerified(Boolean(json?.organization?.verified));
        setType(json?.organization?.type ?? null);
      } catch (err) {
        console.error('VerificationBadge fetch error', err);
        if (mounted) {
          setVerified(null);
          setType(null);
        }
      } 
    };

    fetchOrg();

    return () => {
      mounted = false;
    };
  }, [orgSlug]);

  if (!orgSlug) return null;

  const color = getColorForType(type);


  // size adjustments for icon rendering
  const iconSize = Math.round(size);
  const iconInner = Math.round(iconSize);

  return (
    <span
      aria-hidden={false}
      title={verified ? 'Verified organization' : 'Unverified organization'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Verified: show filled (solid) check badge with subtle colored background.
          Unverified: show outline check badge (no background), both icons colored by type. */}
      {verified ? (
        <span
          style={{
            width: iconSize,
            height: iconSize,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckBadgeSolid
            style={{ width: iconInner, height: iconInner, color }}
            aria-hidden
          />
        </span>
      ) : (
        <span
          style={{
            width: iconSize,
            height: iconSize,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckBadgeOutline
            style={{ width: iconInner, height: iconInner, color }}
            aria-hidden
          />
        </span>
      )}
    </span>
  );
}