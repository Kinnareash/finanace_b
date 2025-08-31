import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpendingData {
  month: string;
  income: number;
  expenses: number;
}

const data: SpendingData[] = [
  { month: 'Aug', income: 3500, expenses: 2800 },
  { month: 'Sep', income: 3500, expenses: 3100 },
  { month: 'Oct', income: 3500, expenses: 2900 },
  { month: 'Nov', income: 3500, expenses: 3200 },
  { month: 'Dec', income: 3500, expenses: 2600 },
];

const SpendingChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Income vs Expenses
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value}`, '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;