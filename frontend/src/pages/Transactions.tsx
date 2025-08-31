import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Upload, RefreshCw } from 'lucide-react';
import TransactionCard from '../components/Transactions/TransactionCard';
import TransactionForm from '../components/Transactions/TransactionForm';
import ReceiptUpload from '../components/Transactions/ReceiptUpload';
import { useAuth } from '../context/AuthContext';
import { Transaction, ReceiptUploadResponse } from '../types';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';

const Transactions: React.FC = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiptUploadOpen, setIsReceiptUploadOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [receiptData, setReceiptData] = useState<ReceiptUploadResponse | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  // Update filtered transactions whenever transactions or filters change
  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  // Update categories list when transactions change
  const categories = Array.from(new Set(transactions.map(t => t.category))).sort();

  const loadTransactions = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = async (data: any) => {
    try {
      const newTransaction = await addTransaction(token || '', {
        ...data,
        date: new Date(data.date).toISOString()
      });
      // Add to the beginning of the transactions array and update filtered list
      setTransactions(prev => {
        const updated = [newTransaction, ...prev];
        return updated;
      });
      closeForm();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const handleEditTransaction = async (data: any) => {
    if (!editingTransaction) return;
    
    try {
      const updatedTransaction = await updateTransaction(token || '', editingTransaction._id, {
        ...data,
        date: new Date(data.date).toISOString()
      });
      
      // Update the transaction in the state
      setTransactions(prev => {
        const updated = prev.map(t => 
          t._id === updatedTransaction._id ? updatedTransaction : t
        );
        return updated;
      });
      
      closeForm();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      alert('Failed to update transaction. Please try again.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const transactionToDelete = transactions.find(t => t._id === id);
    const transactionDescription = transactionToDelete?.description || 'this transaction';
    
    if (window.confirm(`Are you sure you want to delete "${transactionDescription}"?`)) {
      // Store original state for rollback
      const originalTransactions = [...transactions];
      
      try {
        // Optimistically remove from UI first
        setTransactions(prev => prev.filter(t => t._id !== id));
        
        // Then call the API
        await deleteTransaction(token || '', id);
        
        console.log('Transaction deleted successfully');
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        
        // Restore the original state if API call failed
        setTransactions(originalTransactions);
        
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleReceiptProcessed = (data: ReceiptUploadResponse) => {
    setReceiptData(data);
    setEditingTransaction(undefined);
    setIsFormOpen(true);
    setIsReceiptUploadOpen(false);
  };

  const openAddForm = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
    setReceiptData(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="mt-1 text-sm text-white/70">
            Manage all your financial transactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => loadTransactions(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl text-white bg-slate-800/50 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setIsReceiptUploadOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl text-white bg-slate-800/50 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Receipt
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 border border-blue-500/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl shadow-xl p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10 block w-full rounded-xl border border-white/20 shadow-sm bg-slate-800/50 text-white placeholder-white/50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="block w-full rounded-xl border border-white/20 shadow-sm bg-slate-800/50 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full rounded-xl border border-white/20 shadow-sm bg-slate-800/50 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setCategoryFilter('all');
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl text-white bg-slate-700/50 hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl shadow-xl">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            All Transactions ({filteredTransactions.length})
          </h3>
        </div>
        <div className="p-6">
          {error ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-sm font-medium text-white">Error Loading Transactions</h3>
              <p className="mt-2 text-sm text-white/70">{error}</p>
              <button
                onClick={() => loadTransactions()}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-sm text-white/70">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  transaction={transaction}
                  onEdit={openEditForm}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-white/40" />
              <h3 className="mt-4 text-sm font-medium text-white">No transactions found</h3>
              <p className="mt-2 text-sm text-white/70">
                {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by adding your first transaction'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        transaction={editingTransaction}
        receiptData={receiptData}
      />

      <ReceiptUpload
        isOpen={isReceiptUploadOpen}
        onClose={() => setIsReceiptUploadOpen(false)}
        onReceiptProcessed={handleReceiptProcessed}
      />
    </div>
  );
};

export default Transactions;
