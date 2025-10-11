import React from 'react';
import { FaLink } from 'react-icons/fa';

export default function BuildItem({ item }) {
  const imgUrl = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/80/80`;

  return (
    <div className="relative bg-card-bg border border-border-muted rounded-xl p-4 transition-transform duration-200 hover:-translate-y-1 shadow-lg group">
      <img src={imgUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover mx-auto mb-3" />

      <div className="text-center space-y-1">
        <div className="text-text-main font-medium text-sm">{item.name}</div>
        <div className="text-accent font-semibold">${item.price}</div>
      </div>

      <a
        href={item.link}
        className="absolute top-2 right-2 text-text-sub hover:text-accent transition-colors duration-200 opacity-0 group-hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLink />
      </a>

      {item.description && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {item.description}
        </div>
      )}
    </div>
  );
}
