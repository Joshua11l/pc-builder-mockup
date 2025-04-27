import React from 'react';

export default function BuildItem({ item }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
      <p style={{ fontWeight: 600 }}>${item.price}</p>
    </div>
  );
}
