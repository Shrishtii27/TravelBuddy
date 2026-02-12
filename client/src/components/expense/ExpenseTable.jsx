import React, { useState } from 'react';
import { Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CATEGORIES = [
  'All Categories',
  'Accommodation',
  'Food & Dining',
  'Transportation',
  'Activities & Entertainment',
  'Shopping',
  'Miscellaneous'
];

export default function ExpenseTable({ expenses, onEdit, onDelete, onExpensesUpdated }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchQuery === '' || 
      expense.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.spentBy?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      expense.category === selectedCategory;
    
    const matchesDate = selectedDate === '' || 
      new Date(expense.date).toISOString().split('T')[0] === selectedDate;

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDate]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Expense deleted successfully!');
        if (onDelete) {
          onDelete(id);
        }
      } else {
        toast.error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'Accommodation': 'bg-blue-100 text-blue-700 border-blue-200',
      'Food & Dining': 'bg-orange-100 text-orange-700 border-orange-200',
      'Transportation': 'bg-green-100 text-green-700 border-green-200',
      'Activities & Entertainment': 'bg-purple-100 text-purple-700 border-purple-200',
      'Shopping': 'bg-pink-100 text-pink-700 border-pink-200',
      'Miscellaneous': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Filters */}
      <div className="p-4 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or person..."
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Date Filter */}
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Filter by date"
          />
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'All Categories' || selectedDate) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-full">
                Search: {searchQuery}
              </span>
            )}
            {selectedCategory !== 'All Categories' && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Category: {selectedCategory}
              </span>
            )}
            {selectedDate && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                Date: {formatDate(selectedDate)}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedDate('');
              }}
              className="text-xs px-2 py-1 text-slate-600 hover:text-slate-900 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">For</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Who Spent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                  {expenses.length === 0 
                    ? 'No expenses yet. Add your first expense!'
                    : 'No expenses match your filters.'}
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {expense.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {expense.spentBy}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-right text-slate-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredExpenses.length)} of {filteredExpenses.length} expenses
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
