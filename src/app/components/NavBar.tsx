// NavBar.tsx
import React from 'react';

export default function NavBar() {
  return (
    <div className="w-full relative">
      <div className="bg-slate-900 p-3 overflow-hidden shadow-sm border-b border-black absolute top-0 w-full">
        <div className="max-w-6xl mx-auto flex justify-between">
          <h1 className="text-white text-2xl font-bold leading-none pt-1.5">It&#39;s Giving</h1>
          <div className="space-x-4">
            <button className="py-2 px-3 bg-slate-700 rounded-lg text-sm text-light ">Log In</button>
            <a href="/register"><button className="py-2 px-3 bg-slate-600 rounded-lg text-sm">Sign Up</button></a>
          </div>
        </div>
      </div>
    </div>
  );
}
