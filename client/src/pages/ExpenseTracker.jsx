import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import ExpenseSummaryCards from '../components/expense/ExpenseSummaryCards';
import ExpenseTable from '../components/expense/ExpenseTable';
import AddExpenseModal from '../components/expense/AddExpenseModal';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem('travys_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        fetchExpenses();
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error('Please login to view expenses');
    }
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('travys_token');
      
      if (!token) {
        toast.error('Please login to view expenses');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
      } else {
        toast.error('Failed to load expenses');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleExpenseAdded = (newExpense) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(expenses.map(e => 
        e._id === newExpense._id ? newExpense : e
      ));
    } else {
      // Add new expense
      setExpenses([newExpense, ...expenses]);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter(e => e._id !== expenseId));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
        <p className="text-slate-600">Loading your expenses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-rose-500" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Expense Tracker</h1>
              <p className="text-slate-600">Track and manage your travel expenses</p>
            </div>
          </div>
          <Button
            onClick={handleAddExpense}
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <ExpenseSummaryCards expenses={expenses} />

      {/* Expense Table or Empty State */}
      {expenses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Wallet className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No expenses yet
          </h3>
          <p className="text-slate-600 mb-6">
            You haven't added any expenses yet. Start tracking your spending!
          </p>
          <Button onClick={handleAddExpense}>
            <Plus className="h-5 w-5 mr-2" />
            Add a New Expense
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">All Expenses</h2>
            <p className="text-sm text-slate-600">
              {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
            </p>
          </div>
          <ExpenseTable
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onExpenseAdded={handleExpenseAdded}
        editExpense={editingExpense}
      />
    </div>
  );
}
