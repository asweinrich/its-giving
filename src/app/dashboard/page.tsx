"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Donations from "./Donations";
import Causes from "./Causes";
import Fundraisers from "./Fundraisers";
import Account from "./Account";
import Settings from "./Settings";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("Home");
  const { data: session } = useSession();

  const isAdmin = session?.user?.email?.toLowerCase() === "asweinrich@gmail.com";

  const renderContent = () => {
    switch (activeSection) {
      case "Home":        return <Home />;
      case "Donations":   return <Donations />;
      case "Causes":      return <Causes />;
      case "Fundraisers": return <Fundraisers />;
      case "Account":     return <Account />;
      case "Settings":    return <Settings />;
      default:            return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-800 text-slate-100">
      <Sidebar setActiveSection={setActiveSection} />

      <main className="flex-1 p-6 space-y-6">
        {isAdmin && (
          <div className="flex items-center justify-end gap-2 border-b border-slate-700 pb-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest mr-2">Admin</span>
            <Link
              href="/dashboard/admin/add-org"
              className="inline-flex items-center rounded bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-600 border border-slate-600"
            >
              + Add Org
            </Link>
            <Link
              href="/dashboard/admin/service-areas"
              className="inline-flex items-center rounded bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-600 border border-slate-600"
            >
              Service Areas
            </Link>
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
}