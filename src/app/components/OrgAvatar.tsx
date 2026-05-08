'use client';

import { useState } from 'react';

interface OrgAvatarProps {
  name: string;
  imageUrl?: string | null;
  brandColor?: string | null;
  className?: string;
  textClassName?: string;
}

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
}

export default function OrgAvatar({
  name,
  imageUrl,
  brandColor,
  className = 'w-16 h-16 rounded-2xl',
  textClassName = 'text-xl font-bold',
}: OrgAvatarProps) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return (
      <div 
        style={{ backgroundColor: `${brandColor}` }}
        className={`${className} overflow-hidden border-4 border-white/20 shadow-lg flex-shrink-0`}
      >
        <img
          src={imageUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain bg-white rounded px-2"
          onError={() => setImgError(true)}

        />
      </div>
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center text-white shadow-lg border-2 border-white/20 flex-shrink-0`}
      style={{ backgroundColor: brandColor ?? '#334155' }}
    >
      <span className={textClassName}>{getInitials(name)}</span>
    </div>
  );
}