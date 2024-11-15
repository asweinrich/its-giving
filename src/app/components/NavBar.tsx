'use client' 

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, user, setAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Re-fetch authentication state when authChange event is fired
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth state changed, updating NavBar...");
    };
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/users/log-out", { method: "GET" });
      setAuthenticated(false); // Update context
      router.push("/log-in"); // Redirect to login page after signing out
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  console.log('authenticated: ', isAuthenticated)

  return (
    <div className="w-full">
      <div className="bg-slate-900 p-3 shadow-sm border-b border-black">
        <div className="px-3 mx-auto flex justify-between">
          <h1 className="text-white text-2xl font-bold leading-none pt-1.5">It&#39;s Giving</h1>

          <div className="space-x-4 flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="flex items-center space-x-2 bg-slate-800 p-2 rounded-lg text-white"
                >
                  <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                  <span>{user?.email || "User"}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-700 text-white rounded-lg shadow-lg">
                    <a href="/dashboard" className="block px-4 py-2 hover:bg-slate-600">
                      Dashboard
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 hover:bg-slate-600"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/log-in">
                  <button className="py-2 px-3 bg-slate-700 rounded-lg text-sm text-light">Log In</button>
                </a>
                <a href="/register">
                  <button className="py-2 px-3 bg-slate-600 rounded-lg text-sm">Sign Up</button>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
