import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/formatters';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onEdit, onDelete }) => {
  return (
    <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {transaction.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                {transaction.category}
              </span>
              <span className="text-xs text-white/60">
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-lg font-semibold ${
            transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              title="Edit transaction"
            >
              <Edit className="h-4 w-4 text-white/70 hover:text-white" />
            </button>
            <button
              onClick={() => onDelete(transaction._id)}
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors duration-200"
              title="Delete transaction"
            >
              <Trash2 className="h-4 w-4 text-white/70 hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;