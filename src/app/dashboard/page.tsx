"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Donations from "./Donations";
import Causes from "./Causes";
import Fundraisers from "./Fundraisers";
import Account from "./Account";
import Settings from "./Settings";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an AuthContext

interface User {
  userId: string; // Ensure this matches your backend structure
  email: string;
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("Home");
  const { user }: { user: User | null } = useAuth(); // Explicitly type `user`
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Ensure `user.userId` exists before setting it
      if (user.userId) {
        setUserId(user.userId);
        console.log("userId: ", userId)
      } else {
        console.warn("userId is missing in the user object:", user);
      }
    } else {
      console.warn("User is not authenticated. Redirect or handle appropriately.");
      // Optionally redirect to a login page or show a message
    }
  }, [user]);



  const renderContent = () => {
    switch (activeSection) {
      case "Home":
        return <Home />; // Render the Home component with summary stats
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
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {renderContent()}
      </main>
    </div>
  );
}
