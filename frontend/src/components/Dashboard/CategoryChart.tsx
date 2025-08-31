import * as React from 'react';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../../types';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'Food': '#f97316',
  'Transport': '#3b82f6',
  'Entertainment': '#8b5cf6',
  'Shopping': '#ec4899',
  'Bills': '#eab308',
  'Health': '#10b981',
  'Education': '#f59e0b',
  'Travel': '#06b6d4',
  'Other': '#6b7280'
};

const CategoryChart: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategoryData();
  }, []);

  const loadCategoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const transactions = await getTransactions();
      
      // Filter only expense transactions
      const expenses = transactions.filter((t: Transaction) => t.type === 'expense');
      
      if (expenses.length === 0) {
        setData([]);
        return;
      }
      
      // Calculate category totals
      const categoryTotals: { [key: string]: number } = {};
      expenses.forEach((transaction: Transaction) => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      });
      
      // Calculate total expenses
      const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
      
      // Convert to percentage data
      const categoryData: CategoryData[] = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        value: Math.round((amount / totalExpenses) * 100),
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other']
      }));
      
      setData(categoryData);
    } catch (error) {
      console.error('Failed to load category data:', error);
      setError('Failed to load category data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Spending by Category
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Spending by Category
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={loadCategoryData}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Spending by Category
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-white/70">No expense data available</p>
            <p className="text-xs text-white/50 mt-1">Add some expense transactions to see the breakdown</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">
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
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Percentage']} 
              labelStyle={{ color: '#ffffff', fontWeight: '500' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
                fontSize: '14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-white/80 truncate">
              {entry.name} ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;