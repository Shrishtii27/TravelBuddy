import React from 'react';
import { DollarSign, TrendingUp, Award } from 'lucide-react';

export default function ExpenseSummaryCards({ expenses }) {
  // Calculate total expense
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate most spent category
  const getMostSpentCategory = () => {
    if (expenses.length === 0) return { category: 'N/A', amount: 0 };
    
    const categoryTotals = {};
    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    let maxCategory = 'N/A';
    let maxAmount = 0;
    
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategory = category;
      }
    });

    return { category: maxCategory, amount: maxAmount };
  };

  // Calculate highest single expense
  const getHighestSingleExpense = () => {
    if (expenses.length === 0) return 0;
    return Math.max(...expenses.map(e => e.amount));
  };

  const mostSpentCategory = getMostSpentCategory();
  const highestSingleExpense = getHighestSingleExpense();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Expense */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-rose-100 text-sm font-medium">Total Expense</p>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalExpense)}</p>
            <p className="text-rose-100 text-xs mt-1">{expenses.length} transactions</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Most Spent Category */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Most Spent Category</p>
            <p className="text-xl font-bold mt-2 line-clamp-1">{mostSpentCategory.category}</p>
            <p className="text-blue-100 text-sm mt-1">{formatCurrency(mostSpentCategory.amount)}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Highest Single Expense */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Highest Single Expense</p>
            <p className="text-3xl font-bold mt-2">{formatCurrency(highestSingleExpense)}</p>
            <p className="text-purple-100 text-xs mt-1">Single transaction</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
