"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Donations from "./Donations";
import Causes from "./Causes";
import Fundraisers from "./Fundraisers";
import Account from "./Account";
import Settings from "./Settings";
import { useAuth } from "@/context/AuthContext";

interface User {
  userId: string;
  email: string;
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("Home");
  const { user }: { user: User | null } = useAuth();

  const isAdmin = user?.email?.toLowerCase() === "asweinrich@gmail.com";

  useEffect(() => {
    if (user?.userId) {
      setUserId(user.userId);
      console.log("userId: ", user.userId);
    } else if (user) {
      console.warn("userId is missing in the user object:", user);
    } else {
      console.warn("User is not authenticated. Redirect or handle appropriately.");
    }
    // NOTE: don't depend on userId here; it causes extra re-renders/log noise
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case "Home":
        return <Home />;
      case "Donations":
        return <Donations />;
      case "Causes":
        return <Causes />;
      case "Fundraisers":
        return <Fundraisers />;
      case "Account":
        return <Account />;
      case "Settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-800 text-slate-100">
      <Sidebar setActiveSection={setActiveSection} />

      <main className="flex-1 p-6 space-y-6">
        {isAdmin && (
          <div className="flex justify-end">
            <Link
              href="/dashboard/admin/add-org"
              className="inline-flex items-center rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-500"
            >
              Admin: Add Org
            </Link>
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
}