export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateFull = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Food': 'bg-orange-100 text-orange-800',
    'Transport': 'bg-blue-100 text-blue-800',
    'Entertainment': 'bg-purple-100 text-purple-800',
    'Shopping': 'bg-pink-100 text-pink-800',
    'Bills': 'bg-yellow-100 text-yellow-800',
    'Salary': 'bg-green-100 text-green-800',
    'Investment': 'bg-indigo-100 text-indigo-800',
    'Other': 'bg-gray-100 text-gray-800'
  };
  
  return colors[category] || colors['Other'];
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Food': '🍽️',
    'Transport': '🚗',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Bills': '💡',
    'Salary': '💰',
    'Investment': '📈',
    'Other': '📋'
  };
  
  return icons[category] || icons['Other'];
};