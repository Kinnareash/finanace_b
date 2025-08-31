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
  variant?: 'default' | 'balance';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color, variant = 'default' }) => {
  if (variant === 'balance') {
    return (
      <div className="bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl p-6 text-black relative overflow-hidden">
        <div className="absolute top-4 right-4 text-xs font-medium opacity-70">
          •••• 4206
        </div>
        <div className="absolute top-4 right-4 mt-6">
          <span className="text-lg font-bold">VISA</span>
        </div>
        
        <div className="mt-8">
          <p className="text-sm opacity-80 mb-1">Total Balance</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        
        <div className="flex justify-between mt-8">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-lg">⬆</span>
            </div>
            <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-lg">➤</span>
            </div>
            <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-lg">⬇</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs mt-2 opacity-80">
          <span>Top up</span>
          <span>Send</span>
          <span>Request</span>
        </div>
      </div>
    );
  }

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