import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../components/ui/select';
import { Wallet, Plus, TrendingDown, PieChart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Accommodation', amount: 2500, description: 'Hotel Stay', date: '2024-01-15' },
    { id: 2, category: 'Food', amount: 800, description: 'Dinner at Restaurant', date: '2024-01-15' },
    { id: 3, category: 'Transport', amount: 1200, description: 'Cab Fare', date: '2024-01-16' },
  ]);

  const [newExpense, setNewExpense] = useState({
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Accommodation', 'Food', 'Transport', 'Activities', 'Shopping', 'Miscellaneous'];

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      category: 'Food',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    toast.success('Expense added!');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('Expense deleted');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = categories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.total > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="w-8 h-8 text-rose-600" />
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Expenses</p>
                <p className="text-2xl font-bold text-rose-600">₹{totalExpenses.toLocaleString('en-IN')}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-rose-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Transactions</p>
                <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
              </div>
              <PieChart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg per Day</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{Math.round(totalExpenses / (expenses.length || 1)).toLocaleString('en-IN')}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={newExpense.category} onValueChange={(val) => setNewExpense({...newExpense, category: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                placeholder="What did you spend on?"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={addExpense} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryTotals.map(cat => {
                const percentage = (cat.total / totalExpenses) * 100;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cat.category}</span>
                      <span className="text-slate-600">₹{cat.total.toLocaleString('en-IN')} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-600 to-orange-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No expenses yet. Add your first expense above!</p>
            ) : (
              expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-slate-600">
                      {expense.category} • {new Date(expense.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-rose-600">₹{expense.amount.toLocaleString('en-IN')}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
