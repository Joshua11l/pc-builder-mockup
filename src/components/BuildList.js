import React from 'react';
import BuildItem from './BuildItem';

export default function BuildList({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {items.map(item => (
        <BuildItem key={item.id} item={item} />
      ))}
    </div>
  );
}
