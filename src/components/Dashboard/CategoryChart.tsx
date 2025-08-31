import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const data: CategoryData[] = [
  { name: 'Food', value: 35, color: '#f97316' },
  { name: 'Transport', value: 15, color: '#3b82f6' },
  { name: 'Entertainment', value: 20, color: '#8b5cf6' },
  { name: 'Shopping', value: 20, color: '#ec4899' },
  { name: 'Bills', value: 10, color: '#eab308' },
];

const CategoryChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Spending by Category
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;