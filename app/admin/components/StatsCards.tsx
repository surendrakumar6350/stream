import React from 'react';
import { Play, Activity, Users } from 'lucide-react';

interface StatsCardsProps {
  totalStreams: number;
  activeStreams: number;
  totalParticipants: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  totalStreams, 
  activeStreams, 
  totalParticipants 
}) => {
  const stats = [
    {
      title: 'Total Streams',
      value: totalStreams,
      icon: Play,
      color: 'purple',
      bgColor: 'bg-purple-600/20',
      iconColor: 'text-purple-400'
    },
    {
      title: 'Active Streams',
      value: activeStreams,
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-600/20',
      iconColor: 'text-green-400'
    },
    {
      title: 'Total Participants',
      value: totalParticipants,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-600/20',
      iconColor: 'text-blue-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div key={stat.title} className="bg-gray-800 rounded-xl p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <IconComponent className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;