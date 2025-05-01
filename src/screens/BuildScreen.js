// BuildScreen.jsx

import React, { useState, useEffect } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { FaLink } from 'react-icons/fa'
import BudgetInput from '../components/BudgetInput'
import pcPlaceholder from '../assets/pc-placeholder.webp'
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './BuildScreen.css'

// diagram positions
const DIST = 45
const ANGLES = { CPU: -90, GPU: 180, RAM: 0, MB: 135, PSU: 45, OTHER: 90 }
const POSITIONS = Object.fromEntries(
  Object.entries(ANGLES).map(([k, d]) => {
    const r = (d * Math.PI) / 180
    const x = 50 + DIST * Math.cos(r)
    const y = 50 + DIST * Math.sin(r)
    return [k, { x: `${x}%`, y: `${y}%` }]
  })
)

const TOOLTIP = {
  CPU: 'Central processing unit handles main calculations',
  GPU: 'Graphics processing unit renders images and video',
  RAM: 'Random access memory for temporary data storage',
  MB:  'Motherboard connects all components together',
  PSU: 'Power supply unit provides stable power',
  OTHER: 'Additional component'
}

export default function BuildScreen() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [optimal, setOptimal] = useState(0)
  const [animated, setAnimated] = useState(0)

  // once optimal is set, animate `animated` from 0→optimal
  useEffect(() => {
    if (!items.length) return
    setAnimated(0)
    const duration = 800
    const frameRate = 15
    const totalFrames = duration / frameRate
    let frame = 0
    const inc = optimal / totalFrames
    const iv = setInterval(() => {
      frame++
      const val = Math.min(optimal, Math.round(inc * frame))
      setAnimated(val)
      if (frame >= totalFrames) clearInterval(iv)
    }, frameRate)
    return () => clearInterval(iv)
  }, [optimal, items])

  function handleGenerate(budget) {
    setIsLoading(true)
    setItems([])
    setOptimal(0)

    setTimeout(() => {
      const demo = [
        { id: '1', category: 'CPU', name: 'Ryzen 5 5600X',     price: 199, link: '#' },
        { id: '2', category: 'GPU', name: 'RTX 3060',          price: 329, link: '#' },
        { id: '3', category: 'RAM', name: '16GB DDR4 3200MHz', price:  79, link: '#' },
        { id: '4', category: 'MB',  name: 'ROG STRIX B550-F',  price: 180, link: '#' },
        { id: '5', category: 'PSU', name: 'Focus GX-650',      price: 110, link: '#' }
      ]
      setItems(demo)
      setOptimal(74)
      setIsLoading(false)
    }, 1200)
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
          {/* PC diagram first */}
          <div className="diagram">
            <svg className="diagram-lines">
              {items.map(i => {
                const { x, y } = POSITIONS[i.category] || POSITIONS.OTHER
                return (
                  <line
                    key={i.id}
                    x1="50%" y1="50%"
                    x2={x} y2={y}
                    stroke="var(--secondary)"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>

            <img src={pcPlaceholder} alt="PC Case" className="pc-case" />

            {items.map(i => {
              const { x, y } = POSITIONS[i.category] || POSITIONS.OTHER
              const desc = TOOLTIP[i.category] || TOOLTIP.OTHER
              const thumb = `https://picsum.photos/seed/${encodeURIComponent(i.name)}/60/60`
              return (
                <Tippy key={i.id} content={desc} delay={100}>
                  <div className="part-card" style={{ top: y, left: x }}>
                    <img src={thumb} alt={i.name} className="part-thumb" />
                    <div className="part-details">
                      <div className="part-name">{i.name}</div>
                      <div className="part-price">${i.price}</div>
                    </div>
                    <a href={i.link} className="part-link" target="_blank" rel="noopener">
                      <FaLink />
                    </a>
                  </div>
                </Tippy>
              )
            })}
          </div>

          {/* meter below diagram */}
          <div className="meter-wrapper">
            <div className="half-circle-meter">
              <CircularProgressbarWithChildren
                value={animated}
                maxValue={100}
                styles={buildStyles({
                  pathColor: '#1e293b',
                  trailColor: '#f1f5f9',
                  strokeLinecap: 'butt',
                  rotation: 0.75
                })}
                strokeWidth={10}
                circleRatio={0.5}
              >
                <div className="meter-text">{animated}% Optimal</div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
