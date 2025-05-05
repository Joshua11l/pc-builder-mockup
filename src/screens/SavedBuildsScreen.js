// src/screens/SavedBuildsScreen.jsx
import React, { useState, useEffect } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import './SavedBuildsScreen.css'

export default function SavedBuildsScreen() {
  const [savedBuilds, setSavedBuilds] = useState([])

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('savedBuilds') || '[]')
    setSavedBuilds(list)
  }, [])

  function removeBuild(index) {
    const updated = savedBuilds.filter((_, i) => i !== index)
    localStorage.setItem('savedBuilds', JSON.stringify(updated))
    setSavedBuilds(updated)
  }

  return (
    <div className="saved-container">
      <h2 className="build-title">Saved Builds</h2>
      {savedBuilds.length === 0 ? (
        <p className="empty-state">No saved builds yet.</p>
      ) : (
        savedBuilds.map((b, i) => (
          <div key={b.timestamp} className="build-card">
            <div className="build-info">
              <div className="build-score">Score: {b.optimal}%</div>
              <div className="build-time">{new Date(b.timestamp).toLocaleString()}</div>
              <ul>
                {b.items.map(p => (
                  <li key={p.id}>
                    {p.category}: {p.name} (${p.price})
                  </li>
                ))}
              </ul>
            </div>
            <FaTrashAlt className="trash-icon" onClick={() => removeBuild(i)} />
          </div>
        ))
      )}
    </div>
  )
}
