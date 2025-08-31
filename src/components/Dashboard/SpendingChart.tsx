import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SpendingData {
  day: string;
  amount: number;
}

const data: SpendingData[] = [
  { day: 'MON', amount: 2000 },
  { day: 'TUE', amount: 3200 },
  { day: 'WED', amount: 2800 },
  { day: 'THU', amount: 4200 },
  { day: 'FRI', amount: 3800 },
  { day: 'SAT', amount: 3500 },
  { day: 'SUN', amount: 2900 },
];

const SpendingChart: React.FC = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Statistic</h3>
        <div className="flex items-center space-x-1">
          <span className="text-2xl">•••</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-3xl font-bold mb-1">$10,450</div>
        <div className="text-sm text-gray-400 flex items-center">
          <span className="text-green-400 mr-1">↗</span>
          Increase of 5% from last month
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <button className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300">Day</button>
        <button className="px-3 py-1 text-xs rounded-full bg-lime-400 text-black font-medium">Week</button>
        <button className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300">Month</button>
        <button className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300">Year</button>
      </div>

      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis hide />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#a3e635" 
              strokeWidth={3}
              dot={{ fill: '#a3e635', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#a3e635', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-lime-400 text-black p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-1">Tips for increasing income</h4>
            <p className="text-sm opacity-80">Discover new ways to boost your earnings</p>
          </div>
          <button className="px-4 py-2 bg-black text-lime-400 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-150">
            Learn
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;