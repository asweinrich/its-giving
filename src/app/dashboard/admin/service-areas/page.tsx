"use client";

import { useEffect, useState } from "react";
import { SERVICE_AREA_OPTIONS, AREA_TYPE_LABELS, AreaOption, AreaType } from "@/app/data/serviceAreas";

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

const TYPE_ORDER: AreaType[] = ["NEIGHBORHOOD", "CITY", "COUNTY", "STATE", "COUNTRY"];

export default function ServiceAreasAdminPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);

  // Load all orgs on mount
  useEffect(() => {
    fetch("/api/org/list")
      .then((r) => r.json())
      .then((data) => setOrgs(data));
  }, []);

  // Load service areas whenever selected org changes
  useEffect(() => {
    if (!selectedSlug) return;
    setLoading(true);
    fetch(`/api/org/${selectedSlug}/service-areas`)
      .then((r) => r.json())
      .then((data) => {
        setServiceAreas(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [selectedSlug]);

  const flash = (message: string, ok: boolean) => {
    setFeedback({ message, ok });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAdd = async (option: AreaOption) => {
    setSearch("");
    setShowDropdown(false);

    const res = await fetch(`/api/org/${selectedSlug}/service-areas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: option.type, value: option.value, placeId: option.placeId }),
    });

    if (res.status === 409) {
      flash(`"${option.label}" is already added`, false);
      return;
    }
    if (!res.ok) {
      flash("Something went wrong", false);
      return;
    }

    const created: ServiceArea = await res.json();
    setServiceAreas((prev) => [...prev, created]);
    flash(`Added "${option.label}"`, true);
  };

  const handleRemove = async (area: ServiceArea) => {
    const res = await fetch(`/api/org/${selectedSlug}/service-areas/${area.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      flash("Failed to remove", false);
      return;
    }

    setServiceAreas((prev) => prev.filter((a) => a.id !== area.id));
    flash(`Removed "${area.value}"`, true);
  };

  // Filter options — exclude already-added values
  const addedValues = new Set(serviceAreas.map((a) => a.value));
  const filtered = SERVICE_AREA_OPTIONS.filter(
    (o) =>
      !addedValues.has(o.value) &&
      (search === "" || o.label.toLowerCase().includes(search.toLowerCase()))
  );

  // Group current service areas by type for display
  const grouped = TYPE_ORDER.reduce<Record<AreaType, ServiceArea[]>>(
    (acc, type) => {
      acc[type] = serviceAreas.filter((a) => a.type === type);
      return acc;
    },
    {} as Record<AreaType, ServiceArea[]>
  );

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Service Areas</h1>
          <p className="text-slate-400 text-sm mt-1">Manage which geographic areas each org serves.</p>
        </div>

        {/* Org selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Organization
          </label>
          <select
            className="w-full rounded bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              setSearch("");
              setShowDropdown(false);
            }}
          >
            <option value="">— choose an org —</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.slug ?? ""}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSlug && (
          <>
            {/* Add area */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Add Service Area
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search neighborhoods, cities, counties, states…"
                  className="w-full rounded bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />
                {showDropdown && search.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded bg-slate-700 border border-slate-600 shadow-lg">
                    {filtered.length === 0 ? (
                      <li className="px-3 py-2 text-slate-400 text-sm">No results</li>
                    ) : (
                      filtered.slice(0, 50).map((option) => (
                        <li
                          key={`${option.type}-${option.value}`}
                          className="flex items-center justify-between px-3 py-2 hover:bg-slate-600 cursor-pointer text-sm"
                          onMouseDown={() => handleAdd(option)}
                        >
                          <span>{option.label}</span>
                          <span className="text-xs text-slate-400 ml-2">
                            {AREA_TYPE_LABELS[option.type]}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Feedback toast */}
            {feedback && (
              <div
                className={`rounded px-4 py-2 text-sm font-medium ${
                  feedback.ok ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Current service areas */}
            <div>
              <h2 className="text-sm font-medium text-slate-300 mb-3">
                Current Service Areas
                {serviceAreas.length > 0 && (
                  <span className="ml-2 text-slate-500">({serviceAreas.length})</span>
                )}
              </h2>

              {loading ? (
                <p className="text-slate-500 text-sm">Loading…</p>
              ) : serviceAreas.length === 0 ? (
                <p className="text-slate-500 text-sm">No service areas added yet.</p>
              ) : (
                <div className="space-y-4">
                  {TYPE_ORDER.map((type) =>
                    grouped[type].length === 0 ? null : (
                      <div key={type}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                          {AREA_TYPE_LABELS[type]}s
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {grouped[type].map((area) => (
                            <span
                              key={area.id}
                              className="inline-flex items-center gap-1 rounded-full bg-slate-700 border border-slate-600 px-3 py-1 text-sm"
                            >
                              {area.value}
                              <button
                                onClick={() => handleRemove(area)}
                                className="ml-1 text-slate-400 hover:text-red-400 font-bold leading-none"
                                title="Remove"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}