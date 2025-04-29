import React, { useState } from 'react';
import { FaSpinner, FaLink } from 'react-icons/fa';
import BudgetInput from '../components/BudgetInput';
import './BuildScreen.css';

// Absolute positions around the center for each category
const POSITIONS = {
  CPU:  { x: '50%',  y: '5%'  },
  GPU:  { x: '5%',   y: '50%' },
  RAM:  { x: '95%',  y: '50%' },
  MB:   { x: '20%',  y: '85%' },
  PSU:  { x: '80%',  y: '85%' },
  OTHER:{ x: '50%',  y: '95%' }
};

export default function BuildScreen() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [optimal, setOptimal] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  const handleGenerate = (budget) => {
    setIsLoading(true);
    setItems([]);
    setOptimal(0);
    setSuggestions([]);

    // Simulate API call
    setTimeout(() => {
      const demo = [
        { id:'1', category:'CPU',  name:'Ryzen 5 5600X',      price:199, link:'#' },
        { id:'2', category:'GPU',  name:'RTX 3060',           price:329, link:'#' },
        { id:'3', category:'RAM',  name:'16GB DDR4 3200MHz',  price:79,  link:'#' },
        { id:'4', category:'MB',   name:'ROG STRIX B550-F',   price:180, link:'#' },
        { id:'5', category:'PSU',  name:'Focus GX-650',       price:110, link:'#' }
      ];
      setItems(demo);
      setOptimal(74); // dummy optimal score
      setSuggestions([
        'Upgrade to a 750W PSU for future GPU upgrades.',
        'Add an NVMe SSD for much faster load times.'
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="build-screen">
      <h2 className="build-title">Create a Build</h2>
      <p className="build-subtitle">
        Enter your budget and see an interactive breakdown of your PC.
      </p>

      <BudgetInput onSubmit={handleGenerate} />

      {isLoading && (
        <div className="loader"><FaSpinner className="spinner" /></div>
      )}

      {!isLoading && items.length > 0 && (
        <>
          <div className="diagram">
            {/* SVG lines */}
            <svg className="diagram-lines">
              {items.map(item => {
                const pos = POSITIONS[item.category] || POSITIONS.OTHER;
                return (
                  <line
                    key={item.id}
                    x1="50%" y1="50%"
                    x2={pos.x} y2={pos.y}
                    stroke="var(--secondary)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* Center PC case */}
            <img
              src="https://via.placeholder.com/250?text=PC+Case"
              alt="PC Case"
              className="pc-case"
            />

            {/* Part thumbnails */}
            {items.map(item => {
              const pos = POSITIONS[item.category] || POSITIONS.OTHER;
              const imgUrl = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/80/80`;
              return (
                <div
                  key={item.id}
                  className="part"
                  style={{ top: pos.y, left: pos.x }}
                >
                  <img src={imgUrl} alt={item.name} />
                  <div className="part-name">{item.name}</div>
                  <div className="part-price">${item.price}</div>
                  <a href={item.link} className="part-link" target="_blank" rel="noopener noreferrer">
                    <FaLink />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Animated radial meter */}
          <div className="meter-wrapper">
            <div className="radial-meter" style={{ '--pct': optimal }}>
              <div className="meter-fill" />
              <div className="meter-text">{optimal}% Optimal</div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="suggestions">
            <h3>Suggestions</h3>
            <ul>
              {suggestions.map((s,i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
