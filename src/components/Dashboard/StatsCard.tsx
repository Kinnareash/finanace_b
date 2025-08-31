import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
        {trend && (
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;