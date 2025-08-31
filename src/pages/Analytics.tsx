import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, AlertTriangle, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getAnalysis, getTransactions } from '../services/transactionService';
import { AnalysisData, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

const Analytics: React.FC = () => {
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!token) return;
    
    try {
      const [analysisData, transactionsData] = await Promise.all([
        getAnalysis(token),
        getTransactions(token)
      ]);
      setAnalysis(analysisData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate trend data from transactions
  const generateTrendData = () => {
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    
    transactions.forEach(transaction => {
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

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        income: data.income,
        expenses: data.expenses,
        savings: data.income - data.expenses
      }));
  };

  const trendData = generateTrendData();

  // Generate category breakdown chart data
  const categoryData = analysis?.categoryBreakdown 
    ? Object.entries(analysis.categoryBreakdown).map(([name, value]) => ({
        name,
        value,
        amount: transactions
          .filter(t => t.category === name && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      }))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          AI-powered insights and spending analysis
        </p>
      </div>

      {/* AI Insights Cards */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">AI Trends</h3>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {analysis.trends}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-orange-900">Anomalies</h3>
            </div>
            <p className="text-sm text-orange-800 leading-relaxed">
              {analysis.anomalies}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">Suggestions</h3>
            </div>
            <p className="text-sm text-green-800 leading-relaxed">
              {analysis.suggestions}
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Savings Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Savings Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spending */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Spending
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Monthly Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
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
    </div>
  );
};

export default Analytics;