// components/ActivityFeed.tsx

import React from 'react';

type Activity = {
  id: number;
  type: 'donation' | 'fundraiser' | 'follow';
  date: string;
  description: string;
};

type ActivityFeedProps = {
  activities: Activity[];
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      {activities.length > 0 ? (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className={`rounded-full p-2 ${getActivityIconStyle(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </span>
              </div>
              <div>
                <p className="text-gray-600">{activity.description}</p>
                <p className="text-sm text-gray-400">{activity.date}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No recent activity to display.</p>
      )}
    </div>
  );
};

// Utility function to return an icon based on activity type
const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'donation':
      return '💸'; // Placeholder icons, replace with SVGs if available
    case 'fundraiser':
      return '🎉';
    case 'follow':
      return '❤️';
  }
};

// Utility function for activity icon styling
const getActivityIconStyle = (type: Activity['type']) => {
  switch (type) {
    case 'donation':
      return 'bg-green-200 text-green-600';
    case 'fundraiser':
      return 'bg-blue-200 text-blue-600';
    case 'follow':
      return 'bg-red-200 text-red-600';
  }
};

export default ActivityFeed;
