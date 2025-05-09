// src/screens/SavedBuildsScreen.jsx
import React, { useState, useEffect } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import Ryzen5  from '../assets/ryzen5.jpeg'
import RTXImg  from '../assets/RTX.jpg'
import RamImg  from '../assets/Ram.webp'
import RogImg  from '../assets/Rog.jpg'
import FocusImg from '../assets/Focus.jpg'
import './SavedBuildsScreen.css'

const THUMB_IMAGES = {
  CPU: Ryzen5,
  GPU: RTXImg,
  RAM: RamImg,
  MB:  RogImg,
  PSU: FocusImg,
  OTHER: Ryzen5
}

export default function SavedBuildsScreen() {
  const [savedBuilds, setSavedBuilds] = useState([])

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('savedBuilds') || '[]')
    setSavedBuilds(list)
  }, [])

  function removeBuild(idx) {
    const updated = savedBuilds.filter((_, i) => i !== idx)
    localStorage.setItem('savedBuilds', JSON.stringify(updated))
    setSavedBuilds(updated)
  }

  return (
    <div className="saved-container">
      <h2 className="saved-title">Your Saved Builds</h2>

      {savedBuilds.length === 0 ? (
        <p className="empty-state">No builds saved yet.</p>
      ) : (
        <div className="saved-grid">
          {savedBuilds.map((build, i) => {
            const total = build.items.reduce((sum, it) => sum + it.price, 0)
            return (
              <div key={build.timestamp} className="build-card">
                <div className="card-header">
                  <span className="build-score">
                    Performance: <strong>{build.optimal}%</strong>
                  </span>
                  <span className="build-time">
                    {new Date(build.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="build-summary">
                  <span>Total: <strong>${total}</strong></span>
                  {build.budget != null && (
                    <span>Budget: <strong>${build.budget}</strong></span>
                  )}
                </div>

                <div className="item-cards">
                  {build.items.map(item => (
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="item-card"
                    >
                      <img
                        src={THUMB_IMAGES[item.category] || THUMB_IMAGES.OTHER}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-info">
                        <div className="item-category">{item.category}</div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">${item.price}</div>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="card-actions">
                  <FaTrashAlt
                    className="trash-icon"
                    title="Delete build"
                    onClick={() => removeBuild(i)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
)
}
