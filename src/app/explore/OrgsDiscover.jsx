"use client";

import { useEffect, useState } from "react";
import OrganizationCard from "../components/OrganizationCard";

export default function OrgsDiscover() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchOrgs() {
      try {
        setLoading(true);
        const res = await fetch("/api/org/list");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch");
        if (mounted) setOrgs(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchOrgs();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="text-slate-300">Loading organizations…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!orgs.length) return <div className="text-slate-400">No organizations yet.</div>;

  return (
    <div className="flex gap-4 overflow-x-auto py-2">
      {orgs.map((org) => (
        <OrganizationCard key={org.id} org={org} />
      ))}
    </div>
  );
}