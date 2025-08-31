import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '../../utils/formatters';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getCategoryIcon(transaction.category)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                {transaction.category}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-lg font-semibold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
              title="Edit transaction"
            >
              <Edit className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={() => onDelete(transaction._id)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
              title="Delete transaction"
            >
              <Trash2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;