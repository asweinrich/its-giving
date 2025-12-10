"use client";

import { useState } from "react";

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

// GeoJSON type for polygon data
interface GeoJSON {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][]; // Can be Polygon or MultiPolygon
  [key: string]: unknown;
}

// Impact Area type definition
interface ImpactArea {
  type: "named" | "bbox" | "polygon";
  level?: string;
  name?: string;
  bbox?: number[];
  geojson?: GeoJSON;
}

// API request payload type
interface CreateOrgPayload {
  name: string;
  type: OrgType | null;
  description: string | null;
  websiteUrl: string | null;
  instagram: string | null;
  tiktok: string | null;
  socials: Record<string, string> | null;
  impactScope: ImpactScope | null;
  impactAreas: ImpactArea[] | null;
  tags: string[];
}

// API response type
interface CreateOrgResponse {
  id: number;
  name: string;
  slug?: string | null;
  type?: OrgType | null;
  description?: string | null;
  websiteUrl?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  impactScope?: ImpactScope | null;
  impactAreas?: ImpactArea[] | null;
  tags?: Array<{ id: number; name: string; slug: string }>;
  createdAt?: string;
  updatedAt?: string;
  error?: string;
}

export default function CreateOrgPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState<OrgType | "">("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [socials, setSocials] = useState<{ key: string; value: string }[]>([]);
  const [impactScope, setImpactScope] = useState<ImpactScope | "">("");
  const [impactAreas, setImpactAreas] = useState<ImpactArea[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreateOrgResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // helpers
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

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // build socials object (explicit instagram/tiktok + others)
    const socialsObj: Record<string, string> = {};
    socials.forEach((s) => {
      if (s.key && s.value) socialsObj[s.key] = s.value;
    });

    const payload: CreateOrgPayload = {
      name,
      type: type || null,
      description: description || null,
      websiteUrl: websiteUrl || null,
      instagram: instagram || null,
      tiktok: tiktok || null,
      socials: Object.keys(socialsObj).length ? socialsObj : null,
      impactScope: impactScope || null,
      impactAreas: impactAreas.length ? impactAreas : null,
      tags,
    };

    try {
      const res = await fetch("/api/org/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Server error");
      } else {
        setResult(data);
        // optionally reset form
        setName("");
        setType("");
        setDescription("");
        setWebsiteUrl("");
        setInstagram("");
        setTiktok("");
        setSocials([]);
        setImpactScope("");
        setImpactAreas([]);
        setTagsInput("");
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
                      onChange={(e) => updateImpactArea(idx, { type: e.target.value as ImpactArea["type"] })}
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

        <div>
          <label className="block font-medium">Tags (comma-separated)</label>
          <input
            className="w-full mt-1 p-2 rounded border bg-slate-800 text-white"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="education, youth, environment"
          />
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
              setType("");
              setDescription("");
              setWebsiteUrl("");
              setInstagram("");
              setTiktok("");
              setSocials([]);
              setImpactScope("");
              setImpactAreas([]);
              setTagsInput("");
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
          </div>
        )}
      </form>
    </div>
  );
}