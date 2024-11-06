// NavBar.tsx
import React from 'react';

export default function NavBar() {
  return (
    <div className="bg-primary p-3 overflow-hidden shadow-sm border-b border-black">
      <div className="max-w-6xl mx-auto flex justify-between">
        <h1 className="text-white text-2xl font-semibold leading-none pt-2">It&#39;s Giving</h1>
        <div className="space-x-4">
          <button className="border-2 border-primary-dark py-2 px-3 rounded-lg text-primary-dark font-semibold">Log In</button>
          <a href="/register"><button className="bg-primary-dark py-2 px-3 rounded-lg">Sign Up</button></a>
        </div>
      </div>
    </div>
  );
}
