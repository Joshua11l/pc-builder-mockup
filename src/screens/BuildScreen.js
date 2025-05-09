// src/screens/BuildScreen.jsx
import React, { useState, useEffect } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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

import './HomeScreen.css'
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
  const [items, setItems]         = useState([])
  const [budget, setBudget]       = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [optimal, setOptimal]     = useState(0)
  const [animated, setAnimated]   = useState(0)
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    if (!items.length) return
    setAnimated(0)
    const duration   = 800
    const frameRate  = 15
    const total      = duration / frameRate
    let frame        = 0
    const inc        = optimal / total
    const iv = setInterval(() => {
      frame++
      setAnimated(Math.min(optimal, Math.round(inc * frame)))
      if (frame >= total) clearInterval(iv)
    }, frameRate)
    return () => clearInterval(iv)
  }, [optimal, items])

  function handleGenerate(budgetInput) {
    setIsLoading(true)
    setItems([])
    setOptimal(0)
    setSaved(false)
    setBudget(budgetInput)

    setTimeout(() => {
      const demo = [
        { id: '1', category: 'CPU', price: 199, name: 'Ryzen 5 5600X', link: 'https://amzn.to/ryzen5600x' },
        { id: '2', category: 'GPU', price: 329, name: 'RTX 3060', link: 'https://bestbuy.com/rtx3060' },
        { id: '3', category: 'RAM', price: 79,  name: '16GB DDR4 3200MHz', link: 'https://bestbuy.com/16gbddr4' },
        { id: '4', category: 'MB',  price: 180, name: 'ROG STRIX B550-F',   link: 'https://amzn.to/rogb550f' },
        { id: '5', category: 'PSU', price: 110, name: 'Focus GX-650',       link: 'https://amzn.to/focusgx650' }
      ]
      setItems(demo)
      setOptimal(74)
      setIsLoading(false)
    }, 1200)
  }

  function handleSave() {
    const builds = JSON.parse(localStorage.getItem('savedBuilds') || '[]')
    builds.push({ items, optimal, timestamp: Date.now() })
    localStorage.setItem('savedBuilds', JSON.stringify(builds))
    setSaved(true)
    toast.success('Build successfully saved!', { position: 'top-right', autoClose: 2500 })
  }

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0)

  return (
    <div className="build-screen">
      <ToastContainer />
      {items.length === 0 ? (
        <div className="build-hero">
          <h2 className="build-title">Create a Build</h2>
          <p className="build-subtitle">
            Enter your budget and see an interactive breakdown of your PC.
          </p>
          <BudgetInput  onSubmit={handleGenerate} loading={isLoading} />
        </div>
      ) : (
        <>
          <div className="build-hero">
            <div className="header-row">
              <h2 className="build-title">Build Successfully Created</h2>
              <div
                className="save-heart"
                title="Save this build"
                onClick={handleSave}
              >
                {saved
                  ? <AiFillHeart className="heart-icon filled" size={24} />
                  : <AiOutlineHeart className="heart-icon" size={24} />
                }
              </div>
            </div>
            <p className="build-subtitle created-subheader">
              Here’s your optimized setup based on your budget. Click any part to explore or purchase.
            </p>
            <div className="budget-summary">
              Total Price: ${totalPrice} / Budget: ${budget}
            </div>
          </div>

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

            <div className="overlay-meter">
              <CircularProgressbarWithChildren
                value={animated}
                maxValue={100}
                styles={buildStyles({
                  pathColor: '#a259ff',
                  trailColor: '#391f5b',
                  strokeLinecap: 'round',
                  rotation: 0.75
                })}
                strokeWidth={12}
                circleRatio={0.5}
              >
                <div className="meter-percentage">{animated}%</div>
                <div className="meter-label">Performance</div>
              </CircularProgressbarWithChildren>
            </div>

            {items.map(i => {
              const { x, y } = POSITIONS[i.category] || POSITIONS.OTHER
              return (
                <Tippy key={i.id} content={TOOLTIP[i.category]} delay={100}>
                  <a
                    href={i.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="part-card"
                    style={{ top: y, left: x }}
                  >
                    <img src={THUMB_IMAGES[i.category]} alt={i.name} className="part-thumb" />
                    <div className="part-details">
                      <div className="part-name">{i.name}</div>
                      <div className="part-price">${i.price}</div>
                    </div>
                  </a>
                </Tippy>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
