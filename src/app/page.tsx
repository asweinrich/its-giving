'use client'

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { MapPinIcon, BuildingOffice2Icon, CalendarDaysIcon, HeartIcon } from '@heroicons/react/24/outline';

type Tag = {
  id: number;
  name: string;
  slug: string;
  emoji?: string | null;
  color?: string | null;
};

type Org = {
  id: number;
  name: string;
  slug?: string | null;
  brandColor?: string | null;
  imageUrl?: string | null;
  detail?: { mission?: string | null } | null;
  tags?: Tag[] | null;
  createdAt?: string;
};

const MAP_FILTER_TABS = [
  { label: 'Orgs', icon: BuildingOffice2Icon },
  { label: 'Events', icon: CalendarDaysIcon },
  { label: 'Resources', icon: HeartIcon },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [spotlightVisible, setSpotlightVisible] = useState(true);
  const [activeMapFilter, setActiveMapFilter] = useState('Orgs');
  const rotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track scroll position
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrolled = scrollY > 80;

  // Fetch tags/causes
  useEffect(() => {
    fetch('/api/tag?limit=20')
      .then((r) => r.json())
      .then((data) => setTags(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Fetch orgs for spotlight
  useEffect(() => {
    fetch('/api/org/list')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setOrgs(shuffled);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-rotate spotlight
  useEffect(() => {
    if (orgs.length < 2) return;
    rotateRef.current = setInterval(() => {
      setSpotlightVisible(false);
      setTimeout(() => {
        setSpotlightIndex((i) => (i + 1) % orgs.length);
        setSpotlightVisible(true);
      }, 400);
    }, 6000);
    return () => { if (rotateRef.current) clearInterval(rotateRef.current); };
  }, [orgs]);

  const spotlightOrg = orgs[spotlightIndex] ?? null;

  const orgInitials = (name: string) =>
    name.split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Sticky glass bar (always rendered, slides in on scroll) ── */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="w-full bg-white/10 backdrop-blur-md border-b border-white/15 shadow-lg px-5 py-3">
          <span className="text-white font-bold text-base tracking-wide">It&apos;s Giving</span>
        </div>
      </div>

      {/* ── Hero / Masthead ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light via-primary-dark to-slate-900 px-6 pt-12 pb-10">
        {/* Background blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-10 w-56 h-56 bg-primary-dark/30 rounded-full blur-2xl pointer-events-none" />

        <div
          className="relative transition-all duration-300 ease-in-out"
          style={{
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? 'scale(0.92) translateY(-12px)' : 'scale(1) translateY(0)',
          }}
        >
          <h1 className="text-[4rem] sm:text-[5.5rem] font-bold leading-none text-white text-shadow-lg">
            It&apos;s<br />
            <span className="text-[5rem] sm:text-[7rem]">Giving</span>
          </h1>
          <p className="mt-4 text-white/80 text-base max-w-xs leading-relaxed">
            Discover organizations, causes, and resources making a difference near you.
          </p>
        </div>
      </div>

      {/* ── Browse by Cause ── */}
      <div className="px-4 pt-8 pb-4">
        <h2 className="text-lg font-semibold text-white mb-3">Browse by Cause</h2>

        {tags.length === 0 ? (
          <div className="text-slate-500 text-sm">Loading causes…</div>
        ) : (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/explore?tag=${tag.slug}`}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all active:scale-95"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}22` : '#1e293b',
                    borderColor: tag.color ?? '#475569',
                    color: tag.color ?? '#cbd5e1',
                  }}
                >
                  {tag.emoji && <span>{tag.emoji}</span>}
                  <span>{tag.name}</span>
                </Link>
              ))}
            </div>

            {/* Desktop: wrap grid */}
            <div className="hidden md:flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/explore?tag=${tag.slug}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}22` : '#1e293b',
                    borderColor: tag.color ?? '#475569',
                    color: tag.color ?? '#cbd5e1',
                  }}
                >
                  {tag.emoji && <span>{tag.emoji}</span>}
                  <span>{tag.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Near You (Static Map) ── */}
      <div className="px-4 pt-6 pb-4">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-primary-light" />
          Near You
        </h2>

        {/* Map placeholder */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 mb-3">
          {/* Fake map grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(#4ade8033 1px, transparent 1px), linear-gradient(90deg, #4ade8033 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Fake road lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-slate-600/60" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-slate-600/60" />
          </div>
          {/* Fake pins */}
          <div className="absolute top-1/3 left-1/3">
            <div className="w-4 h-4 bg-primary-light rounded-full shadow-lg shadow-primary-light/50 animate-pulse" />
          </div>
          <div className="absolute top-1/2 left-1/2">
            <div className="w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
          </div>
          <div className="absolute top-1/4 left-2/3">
            <div className="w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
          </div>
          <div className="absolute top-2/3 left-1/4">
            <div className="w-4 h-4 bg-primary-light rounded-full shadow-lg shadow-primary-light/50" />
          </div>
          {/* Coming soon overlay */}
          <div className="absolute inset-0 flex items-end p-3">
            <span className="text-xs text-slate-400 bg-slate-900/70 backdrop-blur-sm px-2 py-1 rounded-full">
              Interactive map coming soon
            </span>
          </div>
        </div>

        {/* Map filter toggles */}
        <div className="flex gap-2 mb-4">
          {MAP_FILTER_TABS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveMapFilter(label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeMapFilter === label
                  ? 'bg-primary-light text-slate-900 border-primary-light'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Swipeable org cards under map */}
        {orgs.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {orgs.slice(0, 6).map((org) => (
              <Link
                key={org.id}
                href={org.slug ? `/org/${org.slug}` : '#'}
                className="flex-shrink-0 w-48 bg-slate-800 border border-slate-700 rounded-xl p-3 hover:border-slate-500 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: org.brandColor ?? '#334155' }}
                  >
                    {orgInitials(org.name)}
                  </div>
                  <span className="text-sm font-medium text-white leading-tight line-clamp-2">{org.name}</span>
                </div>
                {org.tags?.[0] && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: org.tags[0].color ? `${org.tags[0].color}22` : '#1e293b',
                      borderColor: org.tags[0].color ?? '#475569',
                      color: org.tags[0].color ?? '#94a3b8',
                    }}
                  >
                    {org.tags[0].emoji} {org.tags[0].name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Spotlight ── */}
      {spotlightOrg && (
        <div className="px-4 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Spotlight</h2>
          <div
            className="rounded-2xl border p-5"
            style={{
              opacity: spotlightVisible ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out',
              backgroundColor: spotlightOrg.brandColor ? `${spotlightOrg.brandColor}18` : '#1e293b',
              borderColor: spotlightOrg.brandColor ?? '#334155',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: spotlightOrg.brandColor ?? '#334155' }}
              >
                {orgInitials(spotlightOrg.name)}
              </div>
              <div>
                <h3 className="font-semibold text-white">{spotlightOrg.name}</h3>
                {spotlightOrg.tags?.[0] && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: spotlightOrg.tags[0].color ? `${spotlightOrg.tags[0].color}22` : '#1e293b',
                      borderColor: spotlightOrg.tags[0].color ?? '#475569',
                      color: spotlightOrg.tags[0].color ?? '#94a3b8',
                    }}
                  >
                    {spotlightOrg.tags[0].emoji} {spotlightOrg.tags[0].name}
                  </span>
                )}
              </div>
            </div>

            {spotlightOrg.detail?.mission && (
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {spotlightOrg.detail.mission}
              </p>
            )}

            <div className="flex items-center justify-between">
              <Link
                href={spotlightOrg.slug ? `/org/${spotlightOrg.slug}` : '#'}
                className="text-sm font-medium text-primary-light hover:underline"
              >
                Learn more →
              </Link>
              {orgs.length > 1 && (
                <div className="flex gap-1">
                  {orgs.slice(0, Math.min(orgs.length, 5)).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ backgroundColor: i === spotlightIndex ? '#77C471' : '#475569' }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}