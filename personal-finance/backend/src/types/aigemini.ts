export interface Transaction {
  description: string;
  amount: number;
  date: string;
  category?: string;
  merchant?: string;
  items?: Array<{
    name: string;
    price: number;
  }>;
}

export interface AnalysisResponse {
  suggestedCategory?: string;
  trends?: string[];
  anomalies?: string[];
  suggestedFilters?: string[];
  parsedReceipt?: {
    merchant: string;
    date: string;
    items: Array<{
      name: string;
      price: number;
    }>;
    total: number;
  };
}