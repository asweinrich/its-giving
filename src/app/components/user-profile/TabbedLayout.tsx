'use client'

// components/TabbedLayout.tsx

import React, { useState } from 'react';
import CauseCard from './CauseCard';
import ActivityFeed from './ActivityFeed';
import UserFundraisers from './UserFundraisers';

type TabbedLayoutProps = {
  causes: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  activities: {
    id: number;
    type: 'donation' | 'fundraiser' | 'follow';
    date: string;
    description: string;
  }[];
  fundraisers: {
    id: number;
    title: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
  }[];
};

const TabbedLayout: React.FC<TabbedLayoutProps> = ({ causes, activities, fundraisers }) => {
  const [activeTab, setActiveTab] = useState('causes');

  const renderContent = () => {
    switch (activeTab) {
      case 'causes':
        return (
          <div className="flex space-x-4">
            {causes.map((cause, index) => (
              <CauseCard key={index} {...cause} />
            ))}
          </div>
        );
      case 'activities':
        return <ActivityFeed activities={activities} />;
      case 'fundraisers':
        return (
          <div className="space-y-4">
            {fundraisers.map((fundraiser) => (
              <div key={fundraiser.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="text-lg font-semibold text-gray-800">{fundraiser.title}</h3>
                <p className="text-gray-600 mb-2">{fundraiser.description}</p>
                <p className="text-sm text-gray-500">
                  Raised ${fundraiser.currentAmount} of ${fundraiser.goalAmount}
                </p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('causes')}
          className={`py-1 px-3 ${
            activeTab === 'causes' ? 'border-b-2 border-primary-dark opacity-100 text-primary-dark' : 'opacity-60 text-primary-dark'
          } font-semibold focus:outline-none`}
        >
          Causes
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`py-1 px-3 ${
            activeTab === 'activities' ? 'border-b-2 border-primary-dark opacity-100 text-primary-dark' : 'opacity-60 text-primary-dark'
          } font-semibold focus:outline-none`}
        >
          Activity
        </button>
        <button
          onClick={() => setActiveTab('fundraisers')}
          className={`py-1 px-3 ${
            activeTab === 'fundraisers' ? 'border-b-2 border-primary-dark opacity-100 text-primary-dark' : 'opacity-60 text-primary-dark'
          } font-semibold focus:outline-none`}
        >
          Fundraisers
        </button>
      </div>

      {/* Tab Content */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default TabbedLayout;
