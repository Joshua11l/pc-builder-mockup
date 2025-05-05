// src/screens/BuildScreen.jsx
import React, { useState, useEffect } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import BudgetInput from '../components/BudgetInput'
import pcPlaceholder from '../assets/pc-placeholder.avif'
import Ryzen5 from '../assets/ryzen5.jpeg'
import RamImg from '../assets/Ram.webp'
import RogImg from '../assets/Rog.jpg'
import RTXImg from '../assets/RTX.jpg'
import FocusImg from '../assets/Focus.jpg'
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './BuildScreen.css'

const DIST = 45
const ANGLES = { CPU: -90, GPU: 180, RAM: 0, MB: 135, PSU: 45, OTHER: 90 }
const POSITIONS = Object.fromEntries(
  Object.entries(ANGLES).map(([k, d]) => {
    const r = (d * Math.PI) / 180
    return [k, { x: `${50 + DIST * Math.cos(r)}%`, y: `${50 + DIST * Math.sin(r)}%` }]
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

const THUMB_IMAGES = {
  CPU: Ryzen5,
  GPU: RTXImg,
  RAM: RamImg,
  MB: RogImg,
  PSU: FocusImg
}

export default function BuildScreen() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [optimal, setOptimal] = useState(0)
  const [animated, setAnimated] = useState(0)

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
      setAnimated(Math.min(optimal, Math.round(inc * frame)))
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
        { id: '1', category: 'CPU', name: 'Ryzen 5 5600X',     price: 199, link: 'https://www.amazon.com/AMD-Ryzen-5600X-12-Thread-Processor/dp/B08166SLDF' },
        { id: '2', category: 'GPU', name: 'RTX 3060',          price: 329, link: 'https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3060-12gb-gddr6-pci-express-4-0-graphics-card-black/6468931.p?skuId=6468931' },
        { id: '3', category: 'RAM', name: '16GB DDR4 3200MHz', price:  79, link: 'https://www.bestbuy.com/site/corsair-vengeance-rgb-pro-16gb-2x8gb-ddr4-3200mhz-c16-udimm-desktop-memory-black/6256216.p?skuId=6256216' },
        { id: '4', category: 'MB',  name: 'ROG STRIX B550-F',  price: 180, link: 'https://www.amazon.com/ROG-B550-F-II-Motherboard-Addressable/dp/B09GP7P1XS' },
        { id: '5', category: 'PSU', name: 'Focus GX-650',      price: 110, link: 'https://www.amazon.com/Seasonic-SSR-650FX-Modular-Warranty-Compact/dp/B073H33X7R' }
      ]
      setItems(demo)
      setOptimal(74)
      setIsLoading(false)
    }, 1200)
  }

  return (
    <div className="build-screen">
      {items.length === 0 ? (
        <div className="build-hero">
          <h2 className="build-title">Create a Build</h2>
          <p className="build-subtitle">
            Enter your budget and see an interactive breakdown of your PC.
          </p>
          <BudgetInput onSubmit={handleGenerate} loading={isLoading} />
        </div>
      ) : (
        <div className="build-hero">
          <h2 className="build-title">Build Successfully Created</h2>
          <p className="build-subtitle created-subheader">
            Here’s your optimized setup based on the budget you entered. Click any part to explore or purchase.
          </p>
          <div className="meter-wrapper enhanced-meter">
            <div className="half-circle-meter">
              <CircularProgressbarWithChildren
                value={animated}
                maxValue={100}
                styles={buildStyles({
                  pathColor: '#0ea5e9',
                  trailColor: '#e2e8f0',
                  strokeLinecap: 'round',
                  rotation: 0.75
                })}
                strokeWidth={12}
                circleRatio={0.5}
              >
                <div className="meter-percentage">{animated}%</div>
                <div className="meter-label">Performance Score</div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
      )}

      {!isLoading && items.length > 0 && (
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
            const thumb = THUMB_IMAGES[i.category] || THUMB_IMAGES.OTHER
            return (
              <Tippy key={i.id} content={desc} delay={100}>
                <a
                  href={i.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="part-card"
                  style={{ top: y, left: x }}
                >
                  <img src={thumb} alt={i.name} className="part-thumb" />
                  <div className="part-details">
                    <div className="part-name">{i.name}</div>
                    <div className="part-price">${i.price}</div>
                  </div>
                </a>
              </Tippy>
            )
          })}
        </div>
      )}
    </div>
  )
}
