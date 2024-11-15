"use client";
import { SparklesIcon, BanknotesIcon, RectangleStackIcon, RectangleGroupIcon, UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function Sidebar({ setActiveSection }) {
  return (
    <aside className="w-64 bg-slate-700 p-6 hidden md:flex flex-col">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <nav className="space-y-4">
        <a onClick={() => setActiveSection("Home")} className="flex items-center text-slate-200 hover:text-white cursor-pointer">
          <SparklesIcon className="w-5 h-5 mr-2" />
          Home
        </a>
        <a onClick={() => setActiveSection("Donations")} className="flex items-center text-slate-200 hover:text-white cursor-pointer">
          <BanknotesIcon className="w-5 h-5 mr-2" />
          Donations
        </a>
        <a onClick={() => setActiveSection("Causes")} className="flex items-center text-slate-200 hover:text-white cursor-pointer">
          <RectangleStackIcon className="w-5 h-5 mr-2" />
          Causes
        </a>
        <a onClick={() => setActiveSection("Fundraisers")} className="flex items-center text-slate-200 hover:text-white cursor-pointer">
          <RectangleGroupIcon className="w-5 h-5 mr-2" />
          Fundraisers
        </a>
        <a onClick={() => setActiveSection("Account")} className="flex items-center text-slate-200 hover:text-white cursor-pointer">
          <UserCircleIcon className="w-5 h-5 mr-2" />
          Account
        </a>
        <a onClick={() => setActiveSection("Settings")} className="flex items-center text-slate-200 hover:text-white cursor-pointer">
          <Cog6ToothIcon className="w-5 h-5 mr-2" />
          Settings
        </a>
      </nav>
      <button className="mt-auto py-2 px-4 bg-blue-600 text-white rounded-lg">
        Contact Support
      </button>
    </aside>
  );
}
