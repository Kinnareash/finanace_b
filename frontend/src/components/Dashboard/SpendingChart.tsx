import * as React from 'react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../../types';

interface SpendingData {
  month: string;
  income: number;
  expenses: number;
}

const SpendingChart: React.FC = () => {
  const [data, setData] = useState<SpendingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpendingData();
  }, []);

  const loadSpendingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const transactions = await getTransactions();
      
      // Group transactions by month
      const monthlyData: Record<string, { income: number; expenses: number }> = {};
      
      transactions.forEach((transaction: Transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expenses: 0 };
        }
        
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expenses += transaction.amount;
        }
      });

      // Convert to chart data and get last 5 months
      const chartData: SpendingData[] = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-5)
        .map(([month, data]) => ({
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
          income: data.income,
          expenses: data.expenses
        }));
      
      setData(chartData);
    } catch (error) {
      console.error('Failed to load spending data:', error);
      setError('Failed to load spending data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Income vs Expenses
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
          Income vs Expenses
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={loadSpendingData}
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
          Income vs Expenses
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-white/70">No transaction data available</p>
            <p className="text-xs text-white/50 mt-1">Add some transactions to see the spending overview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">
        Income vs Expenses
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value: number) => [`₹${value}`, '']}
              labelStyle={{ color: '#ffffff', fontWeight: '500' }}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#f3f4f6',
                backdropFilter: 'blur(8px)',
                fontSize: '14px'
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
          <span className="text-sm text-white/80 font-medium">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-white/80 font-medium">Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;