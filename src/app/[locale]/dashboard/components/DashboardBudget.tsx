'use client';

import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiPrinter } from 'react-icons/fi';

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  estimatedCost: number;
  finalCost: number;
  paid: number;
  expenses: BudgetExpense[];
}

interface BudgetExpense {
  id: string;
  name: string;
  estimatedCost: number;
  finalCost: number;
  paid: number;
}

const defaultCategories: BudgetCategory[] = [
  { id: '1', name: 'Venue', icon: '🏛️', estimatedCost: 50000, finalCost: 0, paid: 0, expenses: [] },
  { id: '2', name: 'Catering', icon: '🍽️', estimatedCost: 30000, finalCost: 0, paid: 0, expenses: [] },
  { id: '3', name: 'Photography', icon: '📸', estimatedCost: 15000, finalCost: 0, paid: 0, expenses: [] },
  { id: '4', name: 'Flowers', icon: '💐', estimatedCost: 8000, finalCost: 0, paid: 0, expenses: [] },
  { id: '5', name: 'Cake', icon: '🎂', estimatedCost: 3000, finalCost: 0, paid: 0, expenses: [] },
  { id: '6', name: 'Dress and Attire', icon: '👗', estimatedCost: 12000, finalCost: 0, paid: 0, expenses: [] },
  { id: '7', name: 'Band', icon: '🎵', estimatedCost: 8000, finalCost: 0, paid: 0, expenses: [] },
  { id: '8', name: 'DJ', icon: '🎧', estimatedCost: 5000, finalCost: 0, paid: 0, expenses: [] },
  { id: '9', name: 'Videography', icon: '🎥', estimatedCost: 10000, finalCost: 0, paid: 0, expenses: [] },
  { id: '10', name: 'Invitations', icon: '💌', estimatedCost: 2000, finalCost: 0, paid: 0, expenses: [] },
  { id: '11', name: 'Favors and Gifts', icon: '🎁', estimatedCost: 3000, finalCost: 0, paid: 0, expenses: [] },
  { id: '12', name: 'Transportation', icon: '🚗', estimatedCost: 4000, finalCost: 0, paid: 0, expenses: [] },
];

interface DashboardBudgetProps {
  profile: any;
}

export default function DashboardBudget({ profile }: DashboardBudgetProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
  const [totalBudget, setTotalBudget] = useState(150000);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [activeTab, setActiveTab] = useState<'budget' | 'payments'>('budget');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    estimatedCost: '',
  });

  const totalEstimated = categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
  const totalFinal = categories.reduce((sum, cat) => sum + cat.finalCost, 0);
  const totalPaid = categories.reduce((sum, cat) => sum + cat.paid, 0);
  const remaining = totalBudget - totalEstimated;

  const handleCategoryClick = (category: BudgetCategory) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
  };

  const handleAddExpense = () => {
    setIsAddingExpense(true);
  };

  const handleSaveExpense = () => {
    if (!newExpense.name.trim() || !selectedCategory) return;

    const expense: BudgetExpense = {
      id: Date.now().toString(),
      name: newExpense.name,
      estimatedCost: Number(newExpense.estimatedCost) || 0,
      finalCost: 0,
      paid: 0,
    };
    
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === selectedCategory.id) {
          const updatedExpenses = [...cat.expenses, expense];
          const newEstimatedCost = updatedExpenses.reduce((sum, exp) => sum + exp.estimatedCost, 0);
          return { 
            ...cat, 
            expenses: updatedExpenses,
            estimatedCost: newEstimatedCost
          };
        }
        return cat;
      })
    );

    // Reset form
    setNewExpense({ name: '', estimatedCost: '' });
    setIsAddingExpense(false);
  };

  const handleCancelExpense = () => {
    setNewExpense({ name: '', estimatedCost: '' });
    setIsAddingExpense(false);
  };

  const handleUpdateExpense = (categoryId: string, expenseId: string, field: keyof BudgetExpense, value: string | number) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          const updatedExpenses = cat.expenses.map(exp =>
            exp.id === expenseId ? { ...exp, [field]: typeof value === 'string' ? value : Number(value) } : exp
          );
          const newEstimatedCost = updatedExpenses.reduce((sum, exp) => sum + exp.estimatedCost, 0);
          const newFinalCost = updatedExpenses.reduce((sum, exp) => sum + exp.finalCost, 0);
          const newPaid = updatedExpenses.reduce((sum, exp) => sum + exp.paid, 0);
          return { 
            ...cat, 
            expenses: updatedExpenses,
            estimatedCost: newEstimatedCost,
            finalCost: newFinalCost,
            paid: newPaid
          };
        }
        return cat;
      })
    );
  };

  const handleDeleteExpense = (categoryId: string, expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          const updatedExpenses = cat.expenses.filter(exp => exp.id !== expenseId);
          const newEstimatedCost = updatedExpenses.reduce((sum, exp) => sum + exp.estimatedCost, 0);
          const newFinalCost = updatedExpenses.reduce((sum, exp) => sum + exp.finalCost, 0);
          const newPaid = updatedExpenses.reduce((sum, exp) => sum + exp.paid, 0);
          return { 
            ...cat, 
            expenses: updatedExpenses,
            estimatedCost: newEstimatedCost,
            finalCost: newFinalCost,
            paid: newPaid
          };
        }
        return cat;
      })
    );
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
  };

  const handleSaveBudget = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // TODO: Save to Supabase database
      // For now, just simulate saving with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Chart data for expenses visualization
  const chartColors = [
    '#8B5CF6', '#F97316', '#EC4899', '#F59E0B', '#10B981',
    '#3B82F6', '#EF4444', '#06B6D4', '#8B5CF6', '#F97316',
    '#EC4899', '#F59E0B'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#11190C]">Budget</h1>
          <p className="text-gray-600 mt-1">Track and manage your wedding expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#11190C] border border-gray-200 rounded-lg transition-colors flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            Download
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#11190C] border border-gray-200 rounded-lg transition-colors flex items-center gap-2">
            <FiPrinter className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'budget'
              ? 'border-[#11190C] text-[#11190C]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Budget
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'border-[#11190C] text-[#11190C]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Payments
        </button>
      </div>

      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Categories */}
          <div className="lg:col-span-1 space-y-4">
            {/* Add New Category Button */}
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-2xl hover:border-[#D9FF0A] hover:bg-[#D9FF0A]/5 transition-all text-[#D9FF0A] font-medium">
              <FiPlus className="w-5 h-5" />
              New category
            </button>

            {/* Category List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all ${
                    selectedCategory?.id === category.id ? 'bg-[#D9FF0A]/10 border-l-4 border-l-[#D9FF0A]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-[#11190C]">{category.name}</div>
                      <div className="text-sm text-gray-500">
                        {category.expenses.length} expense{category.expenses.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#11190C]">
                      {category.estimatedCost.toLocaleString()} MAD
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Overview */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-[#11190C]">Total Budget</h2>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl text-gray-600 font-bold">MAD</span>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                  className="flex-1 text-5xl font-bold text-[#11190C] border-b-2 border-gray-200 focus:border-[#D9FF0A] outline-none bg-transparent px-2"
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              <p className="text-sm text-gray-500 mb-6">You can edit this at any time.</p>

              {/* Budget Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Total Budget</div>
                  <div className="text-xl font-bold text-[#11190C]">
                    {totalBudget.toLocaleString()} MAD
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Allocated</div>
                  <div className="text-xl font-bold text-blue-600">
                    {totalEstimated.toLocaleString()} MAD
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Remaining</div>
                  <div className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remaining.toLocaleString()} MAD
                  </div>
                </div>
              </div>

              {/* Warning if over budget */}
              {remaining < 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-red-900">Over Budget!</div>
                    <div className="text-sm text-red-700">You've allocated {Math.abs(remaining).toLocaleString()} MAD more than your budget.</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleSaveBudget}
                  disabled={isSaving}
                  className="px-6 py-3 bg-[#D9FF0A] text-[#11190C] rounded-xl font-semibold hover:bg-[#BEE600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save budget'
                  )}
                </button>

                {saveSuccess && (
                  <div className="flex items-center gap-2 text-green-600 font-medium animate-fade-in">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Saved successfully!
                  </div>
                )}
              </div>
            </div>

            {/* Expenses Chart */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#11190C] mb-6">Expenses</h2>

              {/* Donut Chart */}
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    {categories.map((cat, index) => {
                      const percentage = (cat.estimatedCost / totalEstimated) * 100;
                      const circumference = 2 * Math.PI * 70;
                      const offset = categories
                        .slice(0, index)
                        .reduce((sum, c) => sum + (c.estimatedCost / totalEstimated) * circumference, 0);

                      return (
                        <circle
                          key={cat.id}
                          cx="100"
                          cy="100"
                          r="70"
                          fill="none"
                          stroke={chartColors[index]}
                          strokeWidth="40"
                          strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#11190C]">
                        {totalEstimated.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">MAD</div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {categories.slice(0, 8).map((cat, index) => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: chartColors[index] }}
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Category Details */}
            {selectedCategory && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCategory.icon}</span>
                    <h2 className="text-2xl font-bold text-[#11190C]">{selectedCategory.name}</h2>
                  </div>
                  <button
                    onClick={() => handleRemoveCategory(selectedCategory.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Estimated cost:</div>
                    <div className="text-2xl font-bold text-[#11190C]">
                      {selectedCategory.estimatedCost.toLocaleString()} MAD
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Final cost:</div>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCategory.finalCost.toLocaleString()} MAD
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${selectedCategory.estimatedCost > 0 
                          ? Math.min((selectedCategory.finalCost / selectedCategory.estimatedCost) * 100, 100)
                          : 0}%`
                      }}
                    />
                  </div>
                </div>

                {/* Expenses Table */}
                {selectedCategory.expenses.length > 0 || isAddingExpense ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase">Expense</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 uppercase">Estimated</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 uppercase">Final</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 uppercase">Paid</th>
                          <th className="w-20"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCategory.expenses.map((expense) => (
                          <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={expense.name}
                                onChange={(e) => handleUpdateExpense(selectedCategory.id, expense.id, 'name', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-[#D9FF0A]"
                              />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <input
                                type="number"
                                value={expense.estimatedCost}
                                onChange={(e) => handleUpdateExpense(selectedCategory.id, expense.id, 'estimatedCost', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-[#D9FF0A] text-right"
                              />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <input
                                type="number"
                                value={expense.finalCost}
                                onChange={(e) => handleUpdateExpense(selectedCategory.id, expense.id, 'finalCost', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-[#D9FF0A] text-right"
                              />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <input
                                type="number"
                                value={expense.paid}
                                onChange={(e) => handleUpdateExpense(selectedCategory.id, expense.id, 'paid', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-[#D9FF0A] text-right"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => handleDeleteExpense(selectedCategory.id, expense.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Add New Expense Row */}
                        {isAddingExpense && (
                          <tr className="border-b-2 border-[#D9FF0A] bg-[#D9FF0A]/5">
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={newExpense.name}
                                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                                placeholder="Expense name..."
                                className="w-full px-3 py-2 border-2 border-[#D9FF0A] rounded focus:outline-none focus:border-[#BEE600]"
                                autoFocus
                              />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <input
                                type="number"
                                value={newExpense.estimatedCost}
                                onChange={(e) => setNewExpense({ ...newExpense, estimatedCost: e.target.value })}
                                placeholder="0"
                                className="w-full px-3 py-2 border-2 border-[#D9FF0A] rounded focus:outline-none focus:border-[#BEE600] text-right"
                              />
                            </td>
                            <td className="py-3 px-4 text-center text-gray-400">-</td>
                            <td className="py-3 px-4 text-center text-gray-400">-</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={handleSaveExpense}
                                  disabled={!newExpense.name.trim()}
                                  className="text-green-600 hover:text-green-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                  title="Save"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={handleCancelExpense}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Cancel"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold bg-gray-50">
                          <td className="py-3 px-4">Total:</td>
                          <td className="py-3 px-4 text-right">{selectedCategory.estimatedCost.toLocaleString()} MAD</td>
                          <td className="py-3 px-4 text-right text-green-600">{selectedCategory.finalCost.toLocaleString()} MAD</td>
                          <td className="py-3 px-4 text-right text-blue-600">{selectedCategory.paid.toLocaleString()} MAD</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No expenses added yet
                  </div>
                )}

                {!isAddingExpense && (
                  <button
                    onClick={handleAddExpense}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#D9FF0A] hover:bg-[#D9FF0A]/5 transition-all text-[#D9FF0A] font-medium"
                  >
                    <FiPlus className="w-5 h-5" />
                    Add new expense
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#11190C] mb-4">Payment Tracking</h2>
          <p className="text-gray-600">Track your payments and remaining balances here.</p>
          {/* Add payment tracking functionality */}
        </div>
      )}
    </div>
  );
}

