import React from 'react';
import { FaLink } from 'react-icons/fa';
import './BuildItem.css';

export default function BuildItem({ item }) {
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/200/150`;

  return (
    <div className="build-item-card">
      <div className="part-header">
        <div className="part-brand">{item.brand}</div>
        <div className="part-category">{item.category}</div>
      </div>
      <img
        src={imageUrl}
        alt={item.name}
        className="part-image"
      />
      <h3 className="part-name">{item.name}</h3>
      <div className="part-footer">
        <span className="part-price">${item.price}</span>
        <a
          href={item.link}
          className="part-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLink />
        </a>
      </div>
    </div>
  );
}
