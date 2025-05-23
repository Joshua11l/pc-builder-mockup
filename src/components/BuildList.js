import React from 'react';
import BuildItem from './BuildItem';
import './BuildList.css';

export default function BuildList({ items }) {
  return (
    <div className="build-list">
      {items.map(item => (
        <BuildItem key={item.id} item={item} />
      ))}
    </div>
  );
}
