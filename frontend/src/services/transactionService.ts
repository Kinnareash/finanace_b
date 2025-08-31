import { Transaction, AnalysisData, ReceiptUploadResponse } from '../types';
import { api } from './axios';

// Real API implementation using axios
export const getTransactions = async (_token?: string): Promise<Transaction[]> => {
  try {
    const response = await api.get('/transactions');
    return response.data as Transaction[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};

export const addTransaction = async (_token: string, transaction: Omit<Transaction, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  try {
    const response = await api.post('/transactions', transaction);
    return response.data as Transaction;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add transaction');
  }
};

export const updateTransaction = async (_token: string, id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  try {
    const response = await api.put(`/transactions/${id}`, updates);
    const data = response.data as { transaction: Transaction };
    return data.transaction;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update transaction');
  }
};

export const deleteTransaction = async (_token: string, id: string): Promise<void> => {
  try {
    await api.delete(`/transactions/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete transaction');
  }
};

export const uploadReceipt = async (_token: string, file: File): Promise<ReceiptUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);
    
    // Use the Gemini-powered analysis endpoint
    const response = await api.post('/ai/analyze-receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const data = response.data as {
      extractedText?: string;
      suggestedCategory?: string;
      merchant?: string;
      amount?: number;
      date?: string;
      confidence?: number;
      success?: boolean;
      message?: string;
    };
    
    return {
      extractedText: data.extractedText || '',
      confidence: data.confidence,
      success: data.success ?? true,
      message: data.message,
      date: data.date,
      // Default values for optional properties
      suggestedCategory: data.suggestedCategory || 'Food', // Enhanced with AI analysis
      merchant: data.merchant || 'Unknown', // Enhanced with AI analysis
      amount: data.amount || 0 // Enhanced with AI analysis
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to upload receipt';
    return {
      extractedText: '',
      success: false,
      message: errorMessage
    };
  }
};

export const getAnalysis = async (_token?: string): Promise<AnalysisData> => {
  try {
    // For now, generate analysis from transactions
    const transactions = await getTransactions();
    
    // Basic analysis calculation
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    // Category breakdown
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(transaction => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });
    
    const totalExpenseAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const categoryBreakdown: { [key: string]: number } = {};
    
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      categoryBreakdown[category] = Math.round((amount / totalExpenseAmount) * 100);
    });
    
    return {
      trends: `Total expenses: ₹${totalExpenses.toFixed(2)}. Total income: ₹${totalIncome.toFixed(2)}. ${totalIncome > totalExpenses ? 'You are saving money!' : 'You are spending more than earning.'}`,
      anomalies: expenses.length > 10 ? 'High number of transactions this period.' : 'Normal transaction activity.',
      suggestions: totalIncome > totalExpenses ? 'Great job! Consider investing your surplus.' : 'Try to reduce expenses in your highest spending categories.',
      categoryBreakdown
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch analysis');
  }
};

