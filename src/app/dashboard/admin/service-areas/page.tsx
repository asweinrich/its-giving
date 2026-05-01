"use client";

import { useEffect, useState } from "react";
import {
  SERVICE_AREA_OPTIONS,
  SERVICE_AREA_BY_TYPE,
  AREA_TYPE_LABELS,
  AreaOption,
  AreaType,
} from "@/app/data/serviceAreas";

interface Org {
  id: number;
  name: string;
  slug: string;
}

interface ServiceArea {
  id: number;
  type: AreaType;
  value: string;
  placeId: string | null;
}

export default function AdminServiceAreasPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<AreaType | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  // Load all orgs on mount
  useEffect(() => {
    fetch("/api/org/list")
      .then((r) => r.json())
      .then((data) => setOrgs(data.organizations ?? data))
      .catch(console.error);
  }, []);

  // Load service areas when org is selected
  useEffect(() => {
    if (!selectedOrg) return;
    setLoading(true);
    fetch(`/api/org/${selectedOrg.slug}/service-areas`)
      .then((r) => r.json())
      .then((data) => setServiceAreas(data))
      .finally(() => setLoading(false));
  }, [selectedOrg]);

  const showFeedback = (msg: string, ok: boolean) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAdd = async (option: AreaOption) => {
    if (!selectedOrg) return;
    const res = await fetch(`/api/org/${selectedOrg.slug}/service-areas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: option.type, value: option.value, placeId: option.placeId }),
    });
    if (res.ok) {
      const newArea = await res.json();
      setServiceAreas((prev) => [...prev, newArea]);
      showFeedback(`Added "${option.label}"`, true);
    } else {
      const err = await res.json();
      showFeedback(err.error ?? "Failed to add", false);
    }
  };

  const handleRemove = async (area: ServiceArea) => {
    if (!selectedOrg) return;
    const res = await fetch(`/api/org/${selectedOrg.slug}/service-areas/${area.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setServiceAreas((prev) => prev.filter((a) => a.id !== area.id));
      showFeedback(`Removed "${area.value}"`, true);
    } else {
      showFeedback("Failed to remove", false);
    }
  };

  // Already-added values for this org (for greying out options)
  const addedValues = new Set(serviceAreas.map((a) => a.value));

  // Filter the option list by search + active type tab
  const filteredOptions = SERVICE_AREA_OPTIONS.filter((opt) => {
    const matchesType = activeType === "ALL" || opt.type === activeType;
    const matchesSearch =
      search.trim() === "" ||
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.value.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const typeOrder: (AreaType | "ALL")[] = ["ALL", "NEIGHBORHOOD", "CITY", "COUNTY", "STATE", "COUNTRY"];

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 p-6">
      <h1 className="text-2xl font-bold mb-1">Service Areas</h1>
      <p className="text-slate-400 text-sm mb-6">
        Select an org, then add or remove service areas.
      </p>

      {/* Feedback toast */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 rounded px-4 py-2 text-sm font-medium shadow-lg ${
            feedback.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Org selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-1">Organization</label>
        <select
          className="w-full max-w-sm rounded bg-slate-700 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedOrg?.slug ?? ""}
          onChange={(e) => {
            const org = orgs.find((o) => o.slug === e.target.value) ?? null;
            setSelectedOrg(org);
            setServiceAreas([]);
            setSearch("");
          }}
        >
          <option value="">— Select an org —</option>
          {orgs.map((org) => (
            <option key={org.slug} value={org.slug}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {selectedOrg && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT — Add service areas */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-3">Add Service Area</h2>

            {/* Search */}
            <input
              type="text"
              placeholder="Search neighborhoods, cities, counties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded bg-slate-600 border border-slate-500 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            {/* Type filter tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {typeOrder.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    activeType === t
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  }`}
                >
                  {t === "ALL" ? "All" : AREA_TYPE_LABELS[t]}
                </button>
              ))}
            </div>

            {/* Options list */}
            <div className="overflow-y-auto max-h-96 space-y-1 pr-1">
              {filteredOptions.length === 0 && (
                <p className="text-slate-400 text-sm py-4 text-center">No results for "{search}"</p>
              )}
              {filteredOptions.map((opt) => {
                const alreadyAdded = addedValues.has(opt.value);
                return (
                  <div
                    key={opt.placeId}
                    className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
                      alreadyAdded
                        ? "bg-slate-600/40 text-slate-500 cursor-default"
                        : "bg-slate-600 hover:bg-slate-500 cursor-pointer"
                    }`}
                    onClick={() => !alreadyAdded && handleAdd(opt)}
                  >
                    <span>
                      <span className="text-slate-400 text-xs mr-2">
                        {AREA_TYPE_LABELS[opt.type]}
                      </span>
                      {opt.label}
                    </span>
                    {alreadyAdded ? (
                      <span className="text-xs text-slate-500">Added</span>
                    ) : (
                      <span className="text-green-400 text-lg leading-none">+</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Current service areas */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-3">
              Current Service Areas
              {serviceAreas.length > 0 && (
                <span className="ml-2 text-sm font-normal text-slate-400">
                  ({serviceAreas.length})
                </span>
              )}
            </h2>

            {loading && <p className="text-slate-400 text-sm">Loading...</p>}

            {!loading && serviceAreas.length === 0 && (
              <p className="text-slate-400 text-sm">No service areas added yet.</p>
            )}

            {/* Group by type */}
            {!loading &&
              (["NEIGHBORHOOD", "CITY", "COUNTY", "STATE", "COUNTRY"] as AreaType[]).map((t) => {
                const group = serviceAreas.filter((a) => a.type === t);
                if (group.length === 0) return null;
                return (
                  <div key={t} className="mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {AREA_TYPE_LABELS[t]}s
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.map((area) => (
                        <span
                          key={area.id}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-600 px-3 py-1 text-sm"
                        >
                          {area.value}
                          <button
                            onClick={() => handleRemove(area)}
                            className="ml-1 text-slate-400 hover:text-red-400 transition-colors text-base leading-none"
                            aria-label={`Remove ${area.value}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}