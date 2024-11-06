// components/UserFundraisers.tsx

import React from 'react';
import Image from 'next/Image';

type CauseCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
};

const UserFundraisers: React.FC<CauseCardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white flex items-center space-x-4">
      {imageUrl && (
        <Image width="400" height="400" src={imageUrl} alt={title} className="h-12 w-12 rounded-full object-cover" />
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default UserFundraisers;
