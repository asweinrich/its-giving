"use client";

import { useState } from "react";
import NavBar from '../../components/NavBar';
import { CheckCircleIcon, XCircleIcon, BanknotesIcon, UserCircleIcon, Cog6ToothIcon, RectangleGroupIcon, RectangleStackIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-slate-800 text-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-700 p-6 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-slate-200 hover:text-white">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Home
          </a>
          <a href="#" className="flex items-center text-slate-200 hover:text-white">
            <BanknotesIcon className="w-5 h-5 mr-2" />
            Donations
          </a>
          <a href="#" className="flex items-center text-slate-200 hover:text-white">
            <RectangleStackIcon className="w-5 h-5 mr-2" />
            Causes
          </a>
          <a href="#" className="flex items-center text-slate-200 hover:text-white">
            <RectangleGroupIcon className="w-5 h-5 mr-2" />
            Fundraisers
          </a>
          <a href="#" className="flex items-center text-slate-200 hover:text-white">
            <UserCircleIcon className="w-5 h-5 mr-2" />
            Account
          </a>
          <a href="#" className="flex items-center text-slate-200 hover:text-white">
            <Cog6ToothIcon className="w-5 h-5 mr-2" />
            Settings
          </a>
        </nav>
        <button className="mt-auto py-2 px-4 bg-blue-600 text-white rounded-lg">
          Contact Support
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome Back, [User’s Name]</h1>
          <button className="py-2 px-4 bg-blue-600 rounded-lg text-white">Make a Donation</button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Donations */}
          <div className="bg-slate-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Donations</h3>
            <p className="text-3xl font-bold">$1,234</p>
            <p className="text-sm text-slate-400">+10% this month</p>
          </div>
          
          {/* Causes Supported */}
          <div className="bg-slate-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Causes Supported</h3>
            <p className="text-3xl font-bold">15</p>
            <p className="text-sm text-slate-400">+2 this month</p>
          </div>
          
          {/* Available Balance */}
          <div className="bg-slate-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Available Balance</h3>
            <p className="text-3xl font-bold">$537</p>
            <p className="text-sm text-slate-400">Withdraw anytime</p>
          </div>
        </div>

        {/* Recent Donations */}
        <section className="bg-slate-700 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Recent Donations</h2>
          <ul className="space-y-4">
            <li className="flex justify-between">
              <div>
                <h4 className="text-lg">Children's Education Fund</h4>
                <p className="text-sm text-slate-400">Donated on Jan 15, 2023</p>
              </div>
              <p className="text-lg font-bold text-green-400">+$50</p>
            </li>
            <li className="flex justify-between">
              <div>
                <h4 className="text-lg">Wildlife Conservation</h4>
                <p className="text-sm text-slate-400">Donated on Jan 10, 2023</p>
              </div>
              <p className="text-lg font-bold text-green-400">+$100</p>
            </li>
          </ul>
        </section>

        {/* Top Causes */}
        <section className="bg-slate-700 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Top Causes</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-600 p-4 rounded-lg">
              <h4 className="font-semibold">Environmental Protection</h4>
              <p className="text-sm text-slate-400">89 supporters</p>
            </div>
            <div className="bg-slate-600 p-4 rounded-lg">
              <h4 className="font-semibold">Healthcare Access</h4>
              <p className="text-sm text-slate-400">102 supporters</p>
            </div>
            <div className="bg-slate-600 p-4 rounded-lg">
              <h4 className="font-semibold">Children’s Education</h4>
              <p className="text-sm text-slate-400">134 supporters</p>
            </div>
            <div className="bg-slate-600 p-4 rounded-lg">
              <h4 className="font-semibold">Animal Welfare</h4>
              <p className="text-sm text-slate-400">76 supporters</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
