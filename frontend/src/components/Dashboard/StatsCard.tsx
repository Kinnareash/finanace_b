import * as React from 'react';
import {LucideIcon } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 overflow-hidden shadow-xl rounded-2xl hover:border-blue-500/30 transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-xl ${color} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-white/70 truncate">
                {title}
              </dt>
              <dd className="text-lg font-bold text-white break-words">
                {value}
              </dd>
            </dl>
          </div>
        </div>
        {trend && (
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className={`font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-white/70 ml-1">from last month</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
