export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  user: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface AnalysisData {
  trends: string;
  anomalies: string;
  suggestions: string;
  categoryBreakdown: Record<string, number>;
}

export interface ReceiptUploadResponse {
  extractedText: string;
  suggestedCategory: string;
  merchant: string;
  amount: number;
}