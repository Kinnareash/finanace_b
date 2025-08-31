import { Transaction, AnalysisData, ReceiptUploadResponse } from '../types';

const API_BASE = 'http://localhost:5000/api';

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    _id: '1',
    user: '68b33fdd626e92ca674c7734',
    type: 'expense',
    category: 'Food',
    amount: 85.50,
    date: '2024-12-20T00:00:00.000Z',
    description: 'Grocery shopping at Whole Foods',
    createdAt: '2024-12-20T00:00:00.000Z',
    updatedAt: '2024-12-20T00:00:00.000Z'
  },
  {
    _id: '2',
    user: '68b33fdd626e92ca674c7734',
    type: 'income',
    category: 'Salary',
    amount: 3500.00,
    date: '2024-12-15T00:00:00.000Z',
    description: 'Monthly salary',
    createdAt: '2024-12-15T00:00:00.000Z',
    updatedAt: '2024-12-15T00:00:00.000Z'
  },
  {
    _id: '3',
    user: '68b33fdd626e92ca674c7734',
    type: 'expense',
    category: 'Transport',
    amount: 12.50,
    date: '2024-12-19T00:00:00.000Z',
    description: 'Uber ride to downtown',
    createdAt: '2024-12-19T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z'
  },
  {
    _id: '4',
    user: '68b33fdd626e92ca674c7734',
    type: 'expense',
    category: 'Entertainment',
    amount: 45.00,
    date: '2024-12-18T00:00:00.000Z',
    description: 'Movie tickets and popcorn',
    createdAt: '2024-12-18T00:00:00.000Z',
    updatedAt: '2024-12-18T00:00:00.000Z'
  },
  {
    _id: '5',
    user: '68b33fdd626e92ca674c7734',
    type: 'expense',
    category: 'Shopping',
    amount: 120.00,
    date: '2024-12-17T00:00:00.000Z',
    description: 'New winter jacket',
    createdAt: '2024-12-17T00:00:00.000Z',
    updatedAt: '2024-12-17T00:00:00.000Z'
  },
  {
    _id: '6',
    user: '68b33fdd626e92ca674c7734',
    type: 'expense',
    category: 'Bills',
    amount: 75.00,
    date: '2024-12-16T00:00:00.000Z',
    description: 'Internet bill',
    createdAt: '2024-12-16T00:00:00.000Z',
    updatedAt: '2024-12-16T00:00:00.000Z'
  }
];

let nextId = 7;

// Mock implementation with dummy data
export const getTransactions = async (token: string): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockTransactions];
};

export const addTransaction = async (token: string, transaction: Omit<Transaction, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newTransaction: Transaction = {
    _id: nextId.toString(),
    user: '68b33fdd626e92ca674c7734',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...transaction
  };
  
  mockTransactions.unshift(newTransaction);
  nextId++;
  
  return newTransaction;
};

export const updateTransaction = async (token: string, id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockTransactions.findIndex(t => t._id === id);
  if (index === -1) throw new Error('Transaction not found');
  
  mockTransactions[index] = {
    ...mockTransactions[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return mockTransactions[index];
};

export const deleteTransaction = async (token: string, id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockTransactions.findIndex(t => t._id === id);
  if (index === -1) throw new Error('Transaction not found');
  
  mockTransactions.splice(index, 1);
};

export const getAnalysis = async (token: string): Promise<AnalysisData> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    trends: 'Your food expenses increased by 23% compared to last month. Entertainment spending has decreased by 15%.',
    anomalies: 'Unusually high spending on shopping in December. This is 40% above your average monthly shopping budget.',
    suggestions: 'Consider setting a stricter budget for the Shopping category. Your savings rate could improve by reducing discretionary spending.',
    categoryBreakdown: {
      'Food': 35,
      'Transport': 15,
      'Entertainment': 20,
      'Shopping': 20,
      'Bills': 10
    }
  };
};

export const uploadReceipt = async (token: string, file: File): Promise<ReceiptUploadResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    extractedText: 'WHOLE FOODS MARKET\n123 Main St\nDate: 12/20/2024\nGroceries: $85.50\nTotal: $85.50',
    suggestedCategory: 'Food',
    merchant: 'Whole Foods Market',
    amount: 85.50
  };
};

// Real API implementation (commented out for demo)
/*
export const getTransactions = async (token: string): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE}/transactions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  
  return response.json();
};

export const addTransaction = async (token: string, transaction: Omit<Transaction, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add transaction');
  }
  
  return response.json();
};

export const updateTransaction = async (token: string, id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }
  
  const data = await response.json();
  return data.transaction;
};

export const deleteTransaction = async (token: string, id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }
};

export const getAnalysis = async (token: string): Promise<AnalysisData> => {
  const response = await fetch(`${API_BASE}/transactions/analysis`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch analysis');
  }
  
  return response.json();
};

export const uploadReceipt = async (token: string, file: File): Promise<ReceiptUploadResponse> => {
  const formData = new FormData();
  formData.append('receipt', file);
  
  const response = await fetch(`${API_BASE}/transactions/upload-receipt`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload receipt');
  }
  
  return response.json();
};
*/