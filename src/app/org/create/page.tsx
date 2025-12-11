'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import type { Geometry } from "geojson";

type OrgType =
  | "NONPROFIT"
  | "FOUNDATION"
  | "GRASSROOTS"
  | "GOVERNMENTAL"
  | "FAITH_BASED"
  | "PTA";

type ImpactScope =
  | "HYPERLOCAL"
  | "LOCAL"
  | "REGIONAL"
  | "STATE"
  | "NATIONAL"
  | "INTERNATIONAL";

type ImpactArea = {
  type: string;
  level?: string;
  name?: string;
  bbox?: number[];
  geojson?: Geometry | null;
};

type TagRecord = {
  id?: number;
  name: string;
  slug?: string;
};

type CreateOrgResult = {
  id: number;
  name: string;
  slug?: string | null;
  type: OrgType | null;
  description: string | null;
  websiteUrl: string | null;
  instagram: string | null;
  tiktok: string | null;
  impactScope: ImpactScope | null;
  impactAreas: ImpactArea[] | null;
  tags: Array<{ id: number; name: string; slug: string }>;
  createdAt: string;
  updatedAt: string;
};

type CreateOrgPayload = {
  name: string;
  slug?: string | null;
  type: OrgType | null;
  description: string | null;
  websiteUrl: string | null;
  instagram: string | null;
  tiktok: string | null;
  socials: Record<string, string> | null;
  impactScope: ImpactScope | null;
  impactAreas: ImpactArea[] | null;
  tags: string[]; // now an array of tag names
};

/**
 * Normalize a string into a safe slug:
 * - lowercases
 * - strips invalid chars (keeps letters/numbers, hyphen, underscore, space)
 * - collapses whitespace to single hyphen
 * - collapses multiple hyphens and trims
 */
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-_ \u00C0-\u017F]/g, "") // keep basic latin letters (with diacritics) and numbers, hyphen/underscore/space
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** simple debounce */
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 200) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/**
 * TagInput component
 * - tags: array of selected tag names
 * - setTags: setter to update selected tags
 *
 * Behavior:
 * - fetches existing tags from /api/tag on mount (expects [{name, slug}, ...])
 * - filters suggestions client-side
 * - keyboard support (up/down/enter/esc/backspace to remove last when input empty)
 * - allows custom tags by pressing Enter when no suggestion selected
 *
 * Adjust the fetch endpoint if your API is different (e.g., /api/tags or /api/tag?search=)
 */
function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (v: string[]) => void;
}) {
  const [allTags, setAllTags] = useState<TagRecord[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // fetch all tags once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Adjust this endpoint to your tags endpoint as needed.
        // Expect JSON: [{ id, name, slug }, ...]
        const res = await fetch("/api/tag");
        if (!res.ok) return;
        const json = (await res.json()) as TagRecord[];
        if (mounted) setAllTags(json || []);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // suggestions derived from allTags filtered by query and excluding selected tags
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // show top N suggestions for inspiration (limit)
      return allTags
        .filter((t) => !tags.includes(t.name))
        .slice(0, 8);
    }
    return allTags
      .filter((t) => !tags.includes(t.name))
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.slug && t.slug.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [allTags, query, tags]);

  // keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
      setOpen(true);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        selectSuggestion(suggestions[highlightIndex].name);
      } else {
        // add custom tag (if non-empty and not duplicate)
        const cand = query.trim();
        if (cand && !tags.includes(cand)) {
          setTags([...tags, cand]);
          setQuery("");
          setOpen(false);
        }
      }
      setHighlightIndex(-1);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setHighlightIndex(-1);
      return;
    }
    if (e.key === "Backspace" && !query && tags.length) {
      // remove last tag when input empty
      setTags(tags.slice(0, tags.length - 1));
    }
  };

  const selectSuggestion = (name: string) => {
    if (!name || tags.includes(name)) return;
    setTags([...tags, name]);
    setQuery("");
    setOpen(false);
    setHighlightIndex(-1);
    // focus input again
    inputRef.current?.focus();
  };

  // keep suggestions open while typing; debounce not really necessary for client filtering,
  // but we use debounce to toggle open state to avoid flicker if you later call server.
  const debouncedSetQuery = useRef(
    debounce((val: string) => {
      setQuery(val);
      setOpen(true);
      setHighlightIndex(-1);
    }, 120)
  ).current;

  return (
    <div className="relative">
      <label className="block font-medium">Tags</label>

      <div
        className="w-full mt-1 p-2 rounded border bg-slate-800 text-white flex flex-wrap gap-2 items-center"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((t, i) => (
          <span
            key={t + i}
            className="inline-flex items-center gap-2 bg-slate-700 px-2 py-1 rounded-full text-sm"
          >
            <span>{t}</span>
            <button
              type="button"
              onClick={() => setTags(tags.filter((x) => x !== t))}
              className="ml-1 text-xs px-1 rounded bg-red-600"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className="flex-1 min-w-[160px] bg-transparent outline-none text-white p-1"
          placeholder="Type to add or choose from suggestions"
          onChange={(e) => debouncedSetQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            setOpen(true);
            setHighlightIndex(-1);
          }}
          onBlur={() => {
            // small timeout to allow click selection on suggestion before closing
            setTimeout(() => setOpen(false), 150);
          }}
        />
      </div>

      {open && (suggestions.length > 0 || query.trim()) && (
        <ul
          ref={listRef}
          className="absolute z-30 mt-1 w-full max-h-48 overflow-auto rounded border bg-white text-slate-900 shadow-lg"
        >
          {suggestions.length === 0 && query.trim() ? (
            <li className="px-3 py-2 text-sm text-slate-600">
              No suggestions — press Enter to create "<strong>{query}</strong>"
            </li>
          ) : (
            suggestions.map((s, idx) => (
              <li
                key={s.name + idx}
                onMouseDown={(e) => {
                  // prevent blur before click
                  e.preventDefault();
                }}
                onClick={() => selectSuggestion(s.name)}
                className={`px-3 py-2 cursor-pointer text-sm flex items-center justify-between ${
                  idx === highlightIndex ? "bg-slate-100" : ""
                }`}
              >
                <span>{s.name}</span>
                {s.slug && <span className="text-xs text-slate-500 ml-2">#{s.slug}</span>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default function CreateOrgPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState(""); // optional manual slug input
  const [type, setType] = useState<OrgType | "">("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [socials, setSocials] = useState<{ key: string; value: string }[]>([]);
  const [impactScope, setImpactScope] = useState<ImpactScope | "">("");
  const [impactAreas, setImpactAreas] = useState<ImpactArea[]>([]);
  // REPLACED: tagsInput string; now an array of tag names
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreateOrgResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // helpers for socials / impact areas (unchanged)
  const addSocial = () => {
    setSocials((s) => [...s, { key: "", value: "" }]);
  };
  const updateSocial = (idx: number, key: string, value: string) => {
    setSocials((s) => s.map((it, i) => (i === idx ? { key, value } : it)));
  };
  const removeSocial = (idx: number) => {
    setSocials((s) => s.filter((_, i) => i !== idx));
  };

  const addNamedImpactArea = () => {
    setImpactAreas((a) => [...a, { type: "named", level: "city", name: "" }]);
  };
  const updateImpactArea = (idx: number, patch: Partial<ImpactArea>) => {
    setImpactAreas((a) => a.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removeImpactArea = (idx: number) => {
    setImpactAreas((a) => a.filter((_, i) => i !== idx));
  };

  // preview slug
  const previewSlug = useMemo(() => {
    const source = slug.trim() || name;
    return source ? slugify(source) : "";
  }, [name, slug]);

  const isValidSlug = (s: string) => {
    return /^[a-z0-9\-_]+$/.test(s);
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const normalizedSlug = previewSlug || null;
    if (normalizedSlug && !isValidSlug(normalizedSlug)) {
      setError("Slug contains invalid characters after normalization. Please edit the name or custom slug.");
      return;
    }

    setSubmitting(true);

    // build socials object (explicit instagram/tiktok + others)
    const socialsObj: Record<string, string> = {};
    socials.forEach((s) => {
      if (s.key && s.value) socialsObj[s.key] = s.value;
    });

    const payload: CreateOrgPayload = {
      name: name.trim(),
      slug: normalizedSlug,
      type: (type as OrgType) || null,
      description: description || null,
      websiteUrl: websiteUrl || null,
      instagram: instagram || null,
      tiktok: tiktok || null,
      socials: Object.keys(socialsObj).length ? socialsObj : null,
      impactScope: (impactScope as ImpactScope) || null,
      impactAreas: impactAreas.length ? impactAreas : null,
      tags, // <-- send selected tag names array
    };

    try {
      const res = await fetch("/api/org/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? data?.error ?? "Server error");
      } else {
        setResult(data);
        // reset form on success
        setName("");
        setSlug("");
        setType("");
        setDescription("");
        setWebsiteUrl("");
        setInstagram("");
        setTiktok("");
        setSocials([]);
        setImpactScope("");
        setImpactAreas([]);
        setTags([]); // clear tags
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Organization</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block font-medium">Name *</label>
          <input
            className="w-full mt-1 p-2 rounded border bg-slate-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization name"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Slug (optional)</label>
          <input
            className="w-full mt-1 p-2 rounded border bg-slate-800 text-white"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="custom-handle (optional) — leave blank to auto-generate from name"
          />
          <div className="text-sm text-slate-400 mt-1">
            Preview: <span className="font-medium">{previewSlug || "—"}</span>
            {previewSlug && !isValidSlug(previewSlug) && (
              <span className="text-red-400 ml-2">Invalid characters in slug</span>
            )}
            <div className="text-xs text-slate-500 mt-1">
              Allowed: lowercase letters, numbers, hyphen (-), underscore (_).
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium">Type</label>
          <select
            className="w-full mt-1 p-2 rounded border bg-slate-800 text-white"
            value={type}
            onChange={(e) => setType(e.target.value as OrgType)}
          >
            <option value="">Select type</option>
            <option value="NONPROFIT">Nonprofit</option>
            <option value="FOUNDATION">Foundation</option>
            <option value="GRASSROOTS">Grassroots</option>
            <option value="GOVERNMENTAL">Governmental</option>
            <option value="FAITH_BASED">Faith-based</option>
            <option value="PTA">PTA</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description / Bio</label>
          <textarea
            className="w-full mt-1 p-2 rounded border bg-slate-800 text-white"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the organization..."
          />
        </div>

        <div>
          <label className="block font-medium">Website URL</label>
          <input
            className="w-full mt-1 p-2 rounded border bg-slate-800 text-white"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.org"
          />
        </div>

        <div>
          <label className="block font-medium">Instagram</label>
          <div className="flex items-center gap-2 mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-pink-500">
              <path
                fill="currentColor"
                d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10z"
              />
              <circle fill="currentColor" cx="12" cy="12" r="3.2" />
            </svg>
            <input
              className="flex-1 p-2 rounded border bg-slate-800 text-white"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@handle or full url"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">TikTok</label>
          <div className="flex items-center gap-2 mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-black">
              <path
                fill="currentColor"
                d="M12 2v6.5c0 2.5 2 4.5 4.5 4.5V15c0 3-2.5 5.5-5.5 5.5S5.5 18 5.5 15 8 9.5 11 9.5V7A5 5 0 0 1 12 2z"
              />
            </svg>
            <input
              className="flex-1 p-2 rounded border bg-slate-800 text-white"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="@handle or full url"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Other Socials</label>
          <div className="space-y-2 mt-2">
            {socials.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="w-1/3 p-2 rounded border bg-slate-800 text-white"
                  placeholder="network (facebook)"
                  value={s.key}
                  onChange={(e) => updateSocial(i, e.target.value, s.value)}
                />
                <input
                  className="flex-1 p-2 rounded border bg-slate-800 text-white"
                  placeholder="handle or url"
                  value={s.value}
                  onChange={(e) => updateSocial(i, s.key, e.target.value)}
                />
                <button
                  type="button"
                  className="px-3 rounded bg-red-600"
                  onClick={() => removeSocial(i)}
                >
                  remove
                </button>
              </div>
            ))}
            <button type="button" className="mt-2 px-3 py-1 rounded bg-slate-700" onClick={addSocial}>
              + Add social
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Impact Scope</label>
          <select
            className="w-full mt-1 p-2 rounded border bg-slate-800 text-white"
            value={impactScope}
            onChange={(e) => setImpactScope(e.target.value as ImpactScope)}
          >
            <option value="">Select scope</option>
            <option value="HYPERLOCAL">Hyperlocal (neighborhood)</option>
            <option value="LOCAL">Local (city/county)</option>
            <option value="REGIONAL">Regional</option>
            <option value="STATE">State</option>
            <option value="NATIONAL">National</option>
            <option value="INTERNATIONAL">International</option>
          </select>

          <div className="mt-3">
            <label className="block font-medium">Impact Areas (named / bbox / polygon)</label>
            <div className="space-y-2 mt-2">
              {impactAreas.map((area, idx) => (
                <div key={idx} className="border rounded p-2 bg-slate-900">
                  <div className="flex gap-2 items-center mb-2">
                    <select
                      value={area.type}
                      onChange={(e) => updateImpactArea(idx, { type: e.target.value })}
                      className="p-1 rounded bg-slate-800"
                    >
                      <option value="named">Named</option>
                      <option value="bbox">Bounding Box</option>
                      <option value="polygon">GeoJSON polygon</option>
                    </select>
                    <button
                      type="button"
                      className="ml-auto px-2 py-1 rounded bg-red-600"
                      onClick={() => removeImpactArea(idx)}
                    >
                      Remove
                    </button>
                  </div>

                  {area.type === "named" && (
                    <div className="space-y-2">
                      <input
                        className="w-full p-2 rounded border bg-slate-800 text-white"
                        placeholder="level (city, county, country)"
                        value={area.level}
                        onChange={(e) => updateImpactArea(idx, { level: e.target.value })}
                      />
                      <input
                        className="w-full p-2 rounded border bg-slate-800 text-white"
                        placeholder="name (eg: Portland)"
                        value={area.name}
                        onChange={(e) => updateImpactArea(idx, { name: e.target.value })}
                      />
                    </div>
                  )}

                  {area.type === "bbox" && (
                    <div className="space-y-2">
                      <input
                        className="w-full p-2 rounded border bg-slate-800 text-white"
                        placeholder="southLat, westLng, northLat, eastLng (comma separated)"
                        value={area.bbox ? area.bbox.join(",") : ""}
                        onChange={(e) =>
                          updateImpactArea(idx, {
                            bbox: e.target.value.split(",").map((v) => Number(v.trim())),
                          })
                        }
                      />
                    </div>
                  )}

                  {area.type === "polygon" && (
                    <div>
                      <textarea
                        className="w-full p-2 rounded border bg-slate-800 text-white"
                        placeholder="GeoJSON polygon (paste JSON)"
                        rows={4}
                        value={area.geojson ? JSON.stringify(area.geojson) : ""}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            updateImpactArea(idx, { geojson: parsed });
                          } catch {
                            updateImpactArea(idx, { geojson: null });
                          }
                        }}
                      />
                      <p className="text-sm text-slate-400 mt-1">Paste valid GeoJSON polygon.</p>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex gap-2 mt-2">
                <button type="button" className="px-3 py-1 rounded bg-slate-700" onClick={addNamedImpactArea}>
                  + Add named area
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-slate-700"
                  onClick={() => setImpactAreas((a) => [...a, { type: "bbox", bbox: [] }])}
                >
                  + Add bbox
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-slate-700"
                  onClick={() => setImpactAreas((a) => [...a, { type: "polygon" }])}
                >
                  + Add polygon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: TagInput */}
        <div>
          <TagInput tags={tags} setTags={setTags} />
          <div className="text-xs text-slate-500 mt-1">
            Choose from suggestions or press Enter to create a new tag.
          </div>
        </div>

        <div>
          <label className="block font-medium">Tags (deprecated display)</label>
          <div className="text-sm text-slate-400 mt-1">
            Selected: {tags.length ? tags.join(", ") : "None"}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Organization"}
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded bg-slate-700 text-white"
            onClick={() => {
              // quick reset
              setName("");
              setSlug("");
              setType("");
              setDescription("");
              setWebsiteUrl("");
              setInstagram("");
              setTiktok("");
              setSocials([]);
              setImpactScope("");
              setImpactAreas([]);
              setTags([]);
              setError(null);
              setResult(null);
            }}
          >
            Reset
          </button>
        </div>

        {error && <p className="text-red-400 mt-2">{error}</p>}
        {result && (
          <div className="mt-4 p-3 bg-slate-800 rounded">
            <h3 className="font-semibold">Created</h3>
            <pre className="text-sm max-h-48 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            {result.slug ? (
              <div className="mt-2">
                <a className="text-blue-400 hover:underline" href={`/org/${result.slug}`}>
                  View org — /org/{result.slug}
                </a>
              </div>
            ) : (
              <div className="mt-2 text-slate-400">No slug created for this org.</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}