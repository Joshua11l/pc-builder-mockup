import React, { useState } from 'react';

export default function BudgetInput({ onSubmit }) {
  const [budget, setBudget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!budget) return;
    onSubmit(budget);
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <input
        type="number"
        className="budget-input"
        placeholder="Enter your budget ($)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
      <button type="submit">Generate</button>
    </form>
  );
}
