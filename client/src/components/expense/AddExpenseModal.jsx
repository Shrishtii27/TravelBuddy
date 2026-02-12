import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CATEGORIES = [
  'Accommodation',
  'Food & Dining',
  'Transportation',
  'Activities & Entertainment',
  'Shopping',
  'Miscellaneous'
];

export default function AddExpenseModal({ isOpen, onClose, onExpenseAdded, editExpense = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    spentBy: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editExpense) {
      setFormData({
        title: editExpense.title || '',
        spentBy: editExpense.spentBy || '',
        category: editExpense.category || '',
        amount: editExpense.amount?.toString() || '',
        date: editExpense.date ? new Date(editExpense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        spentBy: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editExpense, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.spentBy.trim()) {
      toast.error('Please specify who spent');
      return;
    }

    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Amount must be a positive number');
      return;
    }

    if (!formData.date) {
      toast.error('Date is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('travys_token');
      const url = editExpense 
        ? `${API_URL}/api/expenses/${editExpense._id}`
        : `${API_URL}/api/expenses`;
      
      const method = editExpense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          spentBy: formData.spentBy.trim(),
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: formData.date
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(editExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
        
        if (onExpenseAdded) {
          onExpenseAdded(data.expense);
        }
        
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to save expense');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {editExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title (For) */}
          <div>
            <Label htmlFor="title">For (What was spent for) *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Hotel booking, Restaurant dinner"
              className="mt-1"
              required
            />
          </div>

          {/* Spent By */}
          <div>
            <Label htmlFor="spentBy">Who Spent *</Label>
            <select
              id="spentBy"
              name="spentBy"
              value={formData.spentBy}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            >
              <option value="">Select person</option>
              <option value="Me">Me</option>
              <option value="Partner">Partner</option>
              <option value="Friend">Friend</option>
              <option value="Family">Family</option>
              <option value="Group">Group</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              className="mt-1"
              required
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editExpense ? 'Update' : 'Add'} Expense
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
