export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateFull = (date: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Food': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    'Transport': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'Entertainment': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'Shopping': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
    'Bills': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Salary': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'Investment': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    'Other': 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
  };
  
  return colors[category] || colors['Other'];
};

export const getCategoryIcon = (): string => {
  // Return empty string instead of emojis for clean UI
  return '';
};