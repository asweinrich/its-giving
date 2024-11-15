'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, user, setAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false); // For collapsible menu
  const [showUserDropdown, setShowUserDropdown] = useState(false); // For user widget dropdown
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply dark mode class to the root element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/users/log-out", { method: "GET" });
      setAuthenticated(false); // Update context
      router.push("/log-in"); // Redirect to login page after signing out
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-slate-900 p-3 shadow-sm border-b border-black">
        <div className="px-3 mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="/">
            <h1 className="text-white text-2xl font-bold leading-none pt-1.5">It&#39;s Giving</h1>
          </a>

          <div className="flex items-center space-x-4">

            {/* User Widget */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 bg-slate-800 p-2 rounded-lg text-white"
                >
                  <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                  <span>{user?.email || "User"}</span>
                </button>

                {showUserDropdown && (
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

            {/* Collapsible Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center p-2 rounded-lg bg-slate-800 text-white"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 text-white rounded-lg shadow-lg">
                  <a href="/explore" className="block px-4 py-2 hover:bg-slate-600">
                    Explore
                  </a>
                  <a href="/about" className="block px-4 py-2 hover:bg-slate-600">
                    About
                  </a>
                  <div className="px-4 py-2 border-t border-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <div
                        className={`relative w-10 h-5 flex items-center bg-gray-400 rounded-full p-1 cursor-pointer ${
                          darkMode ? 'bg-green-500' : ''
                        }`}
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                            darkMode ? 'translate-x-5' : ''
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
