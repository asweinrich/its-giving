// Scroller.tsx
import React from 'react';

export default function Scroller() {
  return (
    <div className="bg-primary-light dark:bg-primary-dark text-white py-3 overflow-hidden shadow-lg border-b-2 border-black opacity-90">
      <div className="whitespace-nowrap animate-marquee space-x-60 text-shadow text-h4">
        <span className="px-4">Coming Soon!</span>
        <span className="px-4">Join the waitlist now!</span>
        <span className="px-4">Be the first to know!</span>
      </div>
    </div>
  );
}
