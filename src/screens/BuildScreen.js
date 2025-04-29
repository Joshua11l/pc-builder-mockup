// src/screens/BuildScreen.jsx
import React, { useState } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { FaLink } from 'react-icons/fa'
import BudgetInput from '../components/BudgetInput'
import pcPlaceholder from '../assets/pc-placeholder.webp'
import './BuildScreen.css'

// pick how far out (percent of SVG box) you want parts to sit
const DIST = 45

// define each part's angle (deg) around the circle
const ANGLES = {
  CPU:   -90,
  GPU:   180,
  RAM:    0,
  MB:    135,
  PSU:    45,
  OTHER:  90
}

// build x/y percent coords from angle + radius
const POSITIONS = Object.fromEntries(
  Object.entries(ANGLES).map(([key, deg]) => {
    const rad = (deg * Math.PI) / 180
    const x = 50 + DIST * Math.cos(rad)
    const y = 50 + DIST * Math.sin(rad)
    return [key, { x: `${x}%`, y: `${y}%` }]
  })
)

const TOOLTIP_TEXT = {
  CPU:   'Central processing unit handles main calculations',
  GPU:   'Graphics processing unit renders images and video',
  RAM:   'Random access memory for temporary data storage',
  MB:    'Motherboard connects all components together',
  PSU:   'Power supply unit provides stable power',
  OTHER: 'Additional component'
}

export default function BuildScreen() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [optimal, setOptimal] = useState(0)
  const [suggestions, setSuggestions] = useState([])

  const handleGenerate = budget => {
    setIsLoading(true)
    setItems([])
    setOptimal(0)
    setSuggestions([])

    setTimeout(() => {
      const demo = [
        { id:'1', category:'CPU',  name:'Ryzen 5 5600X',     price:199, link:'#' },
        { id:'2', category:'GPU',  name:'RTX 3060',          price:329, link:'#' },
        { id:'3', category:'RAM',  name:'16GB DDR4 3200MHz', price:79,  link:'#' },
        { id:'4', category:'MB',   name:'ROG STRIX B550-F',  price:180, link:'#' },
        { id:'5', category:'PSU',  name:'Focus GX-650',      price:110, link:'#' }
      ]
      setItems(demo)
      setOptimal(74)
      setSuggestions([
        'Upgrade to a 750W PSU for future GPU upgrades.',
        'Add an NVMe SSD for much faster load times.'
      ])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="build-screen">
      <div className="build-hero">
        <h2 className="build-title">Create a Build</h2>
        <p className="build-subtitle">
          Enter your budget and see an interactive breakdown of your PC.
        </p>
        <BudgetInput onSubmit={handleGenerate} loading={isLoading} />
      </div>

      {!isLoading && items.length > 0 && (
        <>
          <div className="diagram">
            <svg className="diagram-lines">
              {items.map(item => {
                const { x, y } = POSITIONS[item.category] || POSITIONS.OTHER
                return (
                  <line
                    key={item.id}
                    x1="50%" y1="50%"
                    x2={x} y2={y}
                    stroke="var(--secondary)"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>

            <img
              src={pcPlaceholder}
              alt="PC Case"
              className="pc-case"
            />

            {items.map(item => {
              const { x, y } = POSITIONS[item.category] || POSITIONS.OTHER
              const desc = TOOLTIP_TEXT[item.category] || TOOLTIP_TEXT.OTHER
              const imgUrl = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/60/60`
              return (
                <Tippy key={item.id} content={desc} delay={100}>
                  <div
                    className="part-card"
                    style={{ top: y, left: x }}
                  >
                    <img src={imgUrl} alt={item.name} className="part-thumb" />
                    <div className="part-details">
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
                  </div>
                </Tippy>
              )
            })}
          </div>

          <div className="meter-wrapper">
            <div className="radial-meter" style={{ '--pct': optimal }}>
              <div className="meter-fill" />
              <div className="meter-text">{optimal}% Optimal</div>
            </div>
          </div>

          <div className="suggestions">
            <h3>Suggestions</h3>
            <ul>
              {suggestions.map((s,i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
