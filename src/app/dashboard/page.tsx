"use client";

import { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import Home from './Home';
import Donations from './Donations';
import Causes from './Causes';
import Fundraisers from './Fundraisers';
import Account from './Account';
import Settings from './Settings';
import { useAuth } from "@/context/AuthContext"; // Assuming you have an AuthContext


export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("Home");
  const { user } = useAuth(); // Assuming `useAuth` provides user data from session
  const [userId, setUserId] = useState(null);

  //use for now
  console.log(userId)

  useEffect(() => {
    // Assuming `user` contains `userId` from session/context
    if (user) {
      setUserId(user.id);
    } else {
      // Handle case where user is not authenticated (redirect or show message)
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
