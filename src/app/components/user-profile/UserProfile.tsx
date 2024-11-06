// components/UserProfile.tsx

import React from 'react';
import Image from 'next/image'

type UserProfileProps = {
  imageUrl: string;
  username: string;
  name: string;
  bio: string;
  socialLinks: {
    tiktok?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
};

const UserProfile: React.FC<UserProfileProps> = ({ imageUrl, username, name, bio, socialLinks }) => {
  return (
    <div className="max-w-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0 flex items-center">
          <Image
            className="h-24 w-24 object-cover md:h-24 md:w-24 rounded-full align-center"
            height="400"
            width="400"
            src={imageUrl}
            alt={`${name}'s profile picture`}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-lg text-green-700 font-semibold">
            {name}
          </div>
          <p className="mt-1.5 text-gray-600 leading-none">@{username}</p>
          <p className="mt-2 text-gray-600 leading-tight">{bio}</p>

          <div className="mt-4 flex space-x-4">
            {socialLinks.tiktok && (
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                <Image width="20" height="20" src="/tiktok.svg" alt="TikTok" className="h-5 pb-0.5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Image width="20" height="20" src="/instagram.svg" alt="Instagram" className="h-5" />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                <Image width="20" height="20" src="/youtube.svg" alt="LinkedIn" className="h-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Image width="20" height="20" src="/linkedin.svg" alt="LinkedIn" className="h-5" />
              </a>
            )}
            {socialLinks.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                <Image width="20" height="20" src="/globe.svg" alt="Website" className="h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
