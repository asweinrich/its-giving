// components/CauseCard.tsx

import React from 'react';
import Image from 'next/image';

type CauseCardProps = {
  title: string;
  imageUrl?: string;
};

const CauseCard: React.FC<CauseCardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="border rounded-lg py-2 px-4 shadow-md bg-white flex items-center space-x-4">
      {imageUrl && (
        <Image width="25" height="25" src={imageUrl} alt={title} className="h-5 object-cover" />
      )}
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        
      </div>
    </div>
  );
};

export default CauseCard;
