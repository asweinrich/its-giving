"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import Toast from "@/app/components/Toast";

const ORG_TYPES = [
  "NONPROFIT",
  "FOUNDATION",
  "GRASSROOTS",
  "GOVERNMENTAL",
  "FAITH_BASED",
  "PTA",
] as const;

const IMPACT_SCOPES = [
  "HYPERLOCAL",
  "LOCAL",
  "REGIONAL",
  "STATE",
  "NATIONAL",
  "INTERNATIONAL",
] as const;

const CATEGORIES = [
  "Animals & Wildlife",
  "Arts & Culture",
  "Children & Youth",
  "Community Development",
  "Disaster Relief",
  "Education",
  "Environment & Conservation",
  "Faith-Based",
  "Health & Medical",
  "Housing & Homelessness",
  "Human Rights & Advocacy",
  "International Aid",
  "Justice & Legal Services",
  "Mental Health",
  "Poverty & Food Security",
  "Public Policy & Civic Engagement",
  "Refugees & Immigration",
  "Research & Science",
  "Seniors",
  "Sports & Recreation",
  "Technology & Digital Equity",
  "Veterans",
  "Women & Gender Equity",
] as const;

type Tag = { id: number; name: string; slug: string };

function dateOnlyToNoonUTC(dateOnly: string): string {
  // dateOnly is "YYYY-MM-DD"
  // store as noon UTC to avoid timezone date shifting
  return `${dateOnly}T12:00:00.000Z`;
}

export default function AddOrgForm() {
  const router = useRouter();

  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");


  const [brandColor, setBrandColor] = useState("#38a169");
  const [logoUrl, setLogoUrl] = useState("");
  const [mission, setMission] = useState("");

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");

  const [category, setCategory] = useState<(typeof CATEGORIES)[number] | "">("");
  const [type, setType] = useState<(typeof ORG_TYPES)[number] | "">("");
  const [foundedDateOnly, setFoundedDateOnly] = useState(""); // YYYY-MM-DD
  const [impactScope, setImpactScope] = useState<(typeof IMPACT_SCOPES)[number] | "">("");

  const [countryCode, setCountryCode] = useState("US");
  const [ein, setEin] = useState("");
  const showEIN = type === "NONPROFIT" || type === "FOUNDATION";

  const [hqAddress, setHqAddress] = useState("");

  // tags UI
  const [tagQuery, setTagQuery] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const selectedTagSlugs = useMemo(() => new Set(selectedTags.map((t) => t.slug)), [selectedTags]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;

    async function check() {
      const s = slug.trim();
      if (!s) {
        setSlugStatus("idle");
        return;
      }

      setSlugStatus("checking");
      const resp = await fetch(`/api/org/check-slug?slug=${encodeURIComponent(s)}`);
      if (!resp.ok) {
        // if forbidden or server error, don't block creation — just go idle
        if (!cancelled) setSlugStatus("idle");
        return;
      }
      const data = await resp.json();
      if (cancelled) return;

      if (!data.slug) setSlugStatus("invalid");
      else setSlugStatus(data.available ? "available" : "taken");
    }

    const t = setTimeout(() => check().catch(() => setSlugStatus("idle")), 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [slug]);

  // auto-generate slug from name until user edits slug manually
  useEffect(() => {
    if (!slugEdited) setSlug(slugify(name));
  }, [name, slugEdited]);



  // fetch tag suggestions
  useEffect(() => {
    let cancelled = false;

    async function run() {
      const q = tagQuery.trim();
      if (!q) {
        setTagSuggestions([]);
        return;
      }
      const resp = await fetch(`/api/tag?q=${encodeURIComponent(q)}&limit=20`);
      if (!resp.ok) return;

      const tags = (await resp.json()) as Tag[];
      if (!cancelled) setTagSuggestions(tags);
    }

    run().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tagQuery]);

  function addSelectedTag(tag: Tag) {
    if (selectedTagSlugs.has(tag.slug)) return;
    setSelectedTags((prev) => [...prev, tag]);
  }

  async function createTagFromQuery() {
    const raw = tagQuery.trim();
    if (!raw) return;

    const resp = await fetch("/api/tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: raw }),
    });

    if (!resp.ok) {
      const msg = await resp.json().catch(() => ({}));
      throw new Error(msg?.message || "Failed to create tag");
    }

    const tag = (await resp.json()) as Tag;
    addSelectedTag(tag);
    setTagQuery("");
    setTagSuggestions([]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // basic validation
    if (!name.trim()) return setError("Name is required.");
    if (!slug.trim()) return setError("Slug is required.");
    if (slugStatus === "taken") return setError("That slug is already taken.");
    if (slugStatus === "invalid") return setError("Slug is invalid.");
    if (!brandColor.trim()) return setError("Color is required.");
    if (!mission.trim()) return setError("Mission is required.");
    if (!category) return setError("Category is required.");
    if (!type) return setError("Type is required.");
    if (!impactScope) return setError("Service scope is required.");
    if (!foundedDateOnly) return setError("Founded date is required.");

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        brandColor,
        imageUrl: logoUrl.trim() || null,
        mission: mission.trim(),
        websiteUrl: websiteUrl.trim() || null,
        instagram: instagram.trim() || null,
        tiktok: tiktok.trim() || null,
        category,
        type,
        founded: dateOnlyToNoonUTC(foundedDateOnly), // string -> server will new Date()
        impactScope,
        countryCode: (countryCode || "US").trim().toUpperCase(),
        ein: showEIN ? ein.trim() || null : null,
        hqAddress: hqAddress.trim() || null,
        tagNamesOrSlugs: selectedTags.map((t) => t.name), // send names, server will slugify + upsert
      };

      const resp = await fetch("/api/org/insert-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data?.message || "Failed to create organization");
      }

      setToast("Created!");

      // you can redirect to the org page later; for now go to explore or dashboard
      router.push(`/org/${encodeURIComponent(payload.slug)}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-slate-900 border border-black rounded-lg p-5 shadow-sm">
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-100 rounded p-3 text-sm">
          {error}
        </div>
      )}
      {toast && <Toast message={toast} variant="success" onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="Org name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug *</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value);
            }}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="org-slug"
          />
          <div className="flex items-center gap-2 text-xs mt-1">
            {slugStatus === "checking" && <span className="text-slate-300">Checking…</span>}
            {slugStatus === "available" && <span className="text-green-400">Slug available</span>}
            {slugStatus === "taken" && <span className="text-red-400">Slug already taken</span>}
            {slugStatus === "invalid" && <span className="text-red-400">Invalid slug</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Color *</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-10 w-14 rounded bg-slate-700"
              aria-label="Pick brand color"
            />
            <input
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="flex-1 p-2 rounded bg-slate-700 text-slate-100"
              placeholder="#38a169"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Logo URL</label>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="https://..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Mission *</label>
          <textarea
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100 min-h-[100px]"
            placeholder="What is the mission?"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Website</label>
          <input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
          >
            <option value="">Select a type</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Founded *</label>
          <input
            type="date"
            value={foundedDateOnly}
            onChange={(e) => setFoundedDateOnly(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
          />
          <p className="text-xs text-slate-300 mt-1">
            Stored safely (no timezone date shifting).
          </p>
        </div>

        <div>
          <label className="block text-sm mb-1">Service scope *</label>
          <select
            value={impactScope}
            onChange={(e) => setImpactScope(e.target.value as any)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
          >
            <option value="">Select scope</option>
            {IMPACT_SCOPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Country code</label>
          <input
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="US"
          />
        </div>

        {showEIN && (
          <div>
            <label className="block text-sm mb-1">EIN</label>
            <input
              value={ein}
              onChange={(e) => setEin(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-slate-100"
              placeholder="12-3456789"
            />
            <p className="text-xs text-slate-300 mt-1">
              Only shown for Nonprofit/Foundation.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Instagram</label>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="https://instagram.com/..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">TikTok</label>
          <input
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="https://tiktok.com/@..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">HQ Address (optional)</label>
          <input
            value={hqAddress}
            onChange={(e) => setHqAddress(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-slate-100"
            placeholder="123 Main St, City, State ZIP"
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Tags</label>

          <div className="flex gap-2">
            <input
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              className="flex-1 p-2 rounded bg-slate-700 text-slate-100"
              placeholder="Search or create tags..."
            />
            <button
              type="button"
              onClick={() => createTagFromQuery().catch((e) => setError(e.message))}
              className="px-3 py-2 rounded bg-slate-600 text-slate-100"
            >
              Add
            </button>
          </div>

          {!!tagSuggestions.length && (
            <div className="mt-2 bg-slate-700 rounded border border-slate-600 overflow-hidden">
              {tagSuggestions.slice(0, 8).map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    addSelectedTag(t);
                    setTagQuery("");
                    setTagSuggestions([]);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-600"
                >
                  {t.name} <span className="text-xs text-slate-300">({t.slug})</span>
                </button>
              ))}
              <div className="px-3 py-2 text-xs text-slate-300 border-t border-slate-600">
                Don’t see it? Click “Add” to create a new tag.
              </div>
            </div>
          )}

          {!!selectedTags.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTags.map((t) => (
                <span
                  key={t.slug}
                  className="inline-flex items-center gap-2 bg-slate-700 border border-slate-600 px-2 py-1 rounded text-sm"
                >
                  {t.name}
                  <button
                    type="button"
                    onClick={() => setSelectedTags((prev) => prev.filter((x) => x.slug !== t.slug))}
                    className="text-slate-300 hover:text-white"
                    aria-label={`Remove ${t.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded bg-slate-700 text-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-green-400"
        >
          {submitting ? "Creating..." : "Create Organization"}
        </button>
      </div>
    </form>
  );
}