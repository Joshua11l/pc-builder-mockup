import React from 'react';
import { FaLink } from 'react-icons/fa';
import './BuildItem.css';

export default function BuildItem({ item }) {
  const imgUrl = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/80/80`;

  return (
    <div className="build-item-card">
      <img src={imgUrl} alt={item.name} className="part-thumb" />

      <div className="part-info">
        <div className="part-name">{item.name}</div>
        <div className="part-price">${item.price}</div>
      </div>

      <a
        href={item.link}
        className="part-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLink />
      </a>

      {item.description && (
        <span className="tooltip">{item.description}</span>
      )}
    </div>
  );
}
