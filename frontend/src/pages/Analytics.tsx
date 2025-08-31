import { useState, useEffect } from 'react';
import { TrendingUp, Brain, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAnalysis, getTransactions } from '../services/transactionService';
import { AnalysisData, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

const Analytics: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [analysisData, transactionsData] = await Promise.all([
        getAnalysis(),
        getTransactions()
      ]);
      setAnalysis(analysisData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
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

  if (!analysis || transactions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-white/70">
            AI-powered insights and spending analysis
          </p>
        </div>
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-white/40" />
          <h3 className="mt-4 text-lg font-medium text-white">No Data Available</h3>
          <p className="mt-2 text-sm text-white/70">
            Add some transactions to see your analytics and insights.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-white">Error Loading Analytics</h3>
          <p className="mt-1 text-sm text-white/70">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-white/70">
            AI-powered insights into your financial patterns
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl text-white bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* AI Insights Cards */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">AI Trends</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {analysis.trends}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Anomalies</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {analysis.anomalies}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Suggestions</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {analysis.suggestions}
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Savings Trend */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            Savings Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#ffffff' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#60a5fa" 
                  strokeWidth={3}
                  dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#60a5fa', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spending */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">
            Category Spending
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  labelStyle={{ color: '#ffffff' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Bar dataKey="amount" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6">
          Monthly Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                labelStyle={{ color: '#ffffff' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-white/70">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
            <span className="text-sm text-white/70">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;