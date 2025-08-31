import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Transaction, ReceiptUploadResponse } from '../../types';
import { useEffect } from 'react';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string(),
  description: z.string().min(1, 'Description is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  transaction?: Transaction;
  receiptData?: ReceiptUploadResponse | null;
  isLoading?: boolean;
}

const categories = {
  expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  receiptData,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    }
  });

  // Update form values when transaction prop changes
  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date.split('T')[0],
        description: transaction.description
      });
    } else if (receiptData) {
      // Pre-fill form with receipt data
      const receiptDate = receiptData.date ? 
        new Date(receiptData.date).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0];
        
      reset({
        type: 'expense', // Default to expense for receipts
        category: receiptData.suggestedCategory || '',
        amount: receiptData.amount || 0,
        date: receiptDate,
        description: receiptData.merchant || 'Receipt upload'
      });
    } else {
      reset({
        type: 'expense',
        category: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [transaction, receiptData, reset]);

  const watchedType = watch('type');

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      await onSubmit(data);
      // Don't reset or close here - let parent component handle it
    } catch (error) {
      console.error('Form submission error:', error);
      // Keep form open on error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-white/10 rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors duration-150"
            >
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    {...register('type')}
                    type="radio"
                    value="expense"
                    className="sr-only"
                  />
                  <div className={`px-4 py-2 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                    watchedType === 'expense' 
                      ? 'border-red-400 bg-red-500/20 text-red-400' 
                      : 'border-white/20 hover:border-white/30 text-white/70'
                  }`}>
                    Expense
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('type')}
                    type="radio"
                    value="income"
                    className="sr-only"
                  />
                  <div className={`px-4 py-2 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                    watchedType === 'income' 
                      ? 'border-green-400 bg-green-500/20 text-green-400' 
                      : 'border-white/20 hover:border-white/30 text-white/70'
                  }`}>
                    Income
                  </div>
                </label>
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white">
                Category
              </label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none sm:text-sm px-3 py-2 transition-all duration-200"
              >
                <option value="" className="bg-slate-800 text-white">Select a category</option>
                {categories[watchedType].map((category) => (
                  <option key={category} value={category} className="bg-slate-800 text-white">
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-white">
                Amount
              </label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none sm:text-sm px-3 py-2 transition-all duration-200"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-white">
                Date
              </label>
              <input
                {...register('date')}
                type="date"
                className="mt-1 block w-full rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none sm:text-sm px-3 py-2 transition-all duration-200"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white">
                Description
              </label>
              <input
                {...register('description')}
                type="text"
                className="mt-1 block w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none sm:text-sm px-3 py-2 transition-all duration-200"
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {isLoading ? 'Saving...' : (transaction ? 'Update' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;