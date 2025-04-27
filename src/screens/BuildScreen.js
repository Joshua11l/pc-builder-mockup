import React, { useState } from 'react';
import BudgetInput from '../components/BudgetInput';
import BuildList from '../components/BuildList';

export default function BuildScreen() {
  const [items, setItems] = useState([]);

  const handleGenerate = (budget) => {
    // demo data; replace with real logic later
    setItems([
      { id: '1', name: 'AMD Ryzen 5 5600X',      price: 199 },
      { id: '2', name: 'NVIDIA GeForce RTX 3060', price: 329 },
      { id: '3', name: '16GB DDR4 3200MHz RAM',   price: 79 }
    ]);
  };

  return (
    <div className="container">
      <h2 className="section-title">Create a Build</h2>
      <BudgetInput onSubmit={handleGenerate} />
      <BuildList items={items} />
    </div>
  );
}
