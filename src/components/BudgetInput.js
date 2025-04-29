import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import './BudgetInput.css';

export default function BudgetInput({ onSubmit, loading }) {
  const [budget, setBudget] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!budget || loading) return;
    onSubmit(budget);
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <input
        type="number"
        className="budget-input"
        placeholder="Enter your budget ($)"
        value={budget}
        onChange={e => setBudget(e.target.value)}
      />
      <button
        type="submit"
        className="btn-generate"
        disabled={loading}
      >
        {loading
          ? <FaSpinner className="btn-spinner" />
          : 'Generate'
        }
      </button>
    </form>
  );
}
