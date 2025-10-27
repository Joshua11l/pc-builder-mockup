import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

/**
 * Budget Input Component (FR5)
 * Provides a form for users to input their PC build budget with validation and loading states
 * @param {Function} onSubmit - Callback function called when form is submitted with budget value
 * @param {boolean} loading - Whether the form is in loading state (disables input)
 */
export default function BudgetInput({ onSubmit, loading }) {
  // Local state for budget input value
  const [budget, setBudget] = useState('');

  /**
   * Handle form submission
   * Validates input and calls parent callback with budget value
   */
  const handleSubmit = e => {
    e.preventDefault();
    // Prevent submission if no budget entered or currently loading
    if (!budget || loading) return;
    // Call parent component's submit handler with budget value
    onSubmit(budget);
  };

  return (
    <form
      className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-4"
      onSubmit={handleSubmit}
    >
      {/* Budget Input Field */}
      <input
        type="number"
        className="flex-1 w-full px-5 py-4 text-lg text-white bg-white/5 border border-white/10 rounded-2xl shadow-inner-glow focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/40"
        placeholder="Enter your budget ($)"
        value={budget}
        onChange={e => setBudget(e.target.value)}
        min="1"
        step="1"
      />
      
      {/* Submit Button with Loading State */}
      <button
        type="submit"
        className="inline-flex items-center justify-center min-w-[160px] bg-primary text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-glow transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        disabled={loading}
      >
        {loading
          ? <FaSpinner className="text-xl animate-spin" />
          : 'Generate'
        }
      </button>
    </form>
  );
}
