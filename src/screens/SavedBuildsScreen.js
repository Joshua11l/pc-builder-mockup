/**
 * Saved Builds Screen Component
 * 
 * This component manages and displays the user's saved PC builds.
 * It provides:
 * - Grid layout display of all saved builds
 * - Build management (view, export, delete)
 * - Performance metrics and total cost display
 * - Component thumbnails with external vendor links
 * - Export functionality for sharing builds
 * 
 * Functional Requirements Satisfied:
 * - FR9: Save custom PC builds to local storage for future reference
 * - FR10: View saved builds with all components and performance metrics
 * - FR11: Delete saved builds from the saved builds list
 * - FR12: Export builds in various formats (JSON, PDF, etc.)
 * - Display vendor links for easy purchasing
 * 
 * Visual Features:
 * - Responsive grid layout for different screen sizes
 * - Hover animations and interactive elements
 * - Component thumbnails with category icons
 * - Performance percentage and cost breakdown
 * - Clean card-based design with neon purple accents
 */

import React, { useState, useEffect } from 'react'
import { FaTrashAlt, FaEdit, FaDownload } from 'react-icons/fa'
import ExportBuild from '../components/ExportBuild'
import Ryzen5  from '../assets/ryzen5.jpeg'
import RTXImg  from '../assets/RTX.jpg'
import RamImg  from '../assets/Ram.webp'
import RogImg  from '../assets/Rog.jpg'
import FocusImg from '../assets/Focus.jpg'

// Component thumbnail images mapping
const THUMB_IMAGES = {
  CPU: Ryzen5,
  GPU: RTXImg,
  RAM: RamImg,
  MB:  RogImg,
  PSU: FocusImg,
  OTHER: Ryzen5
}

/**
 * SavedBuildsScreen Component
 * Displays and manages user's saved PC builds with export functionality
 */
export default function SavedBuildsScreen() {
  // State for managing saved builds and export modal
  const [savedBuilds, setSavedBuilds] = useState([])
  const [exportingBuild, setExportingBuild] = useState(null)

  // Load saved builds from localStorage on component mount
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('savedBuilds') || '[]')
    setSavedBuilds(list)
  }, [])

  /**
   * Remove a saved build from storage
   * Satisfies FR11: Delete saved builds from the saved builds list
   */
  function removeBuild(idx) {
    const updated = savedBuilds.filter((_, i) => i !== idx)
    localStorage.setItem('savedBuilds', JSON.stringify(updated))
    setSavedBuilds(updated)
  }

  /**
   * Handle build export - opens export modal
   * Satisfies FR12: Export builds in various formats
   */
  function handleExport(build) {
    setExportingBuild(build)
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Your Saved Builds</h2>
        </div>

      {/* Empty State or Build Grid */}
      {savedBuilds.length === 0 ? (
        <p className="text-center text-xl text-text-sub">No builds saved yet.</p>
      ) : (
        // Responsive Grid Layout for Saved Builds
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map through each saved build to create cards */}
          {savedBuilds.map((build, i) => {
            const total = build.items.reduce((sum, it) => sum + it.price, 0)
            return (
              // Individual Build Card
              <div key={build.timestamp} className="bg-card-bg border border-border-muted rounded-xl p-6 transition-transform duration-200 hover:-translate-y-1 shadow-lg">
                {/* Build Header with Performance and Timestamp */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-accent font-semibold">
                    Performance: <strong>{build.optimal}%</strong>
                  </span>
                  <span className="text-text-sub text-sm">
                    {new Date(build.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Cost Summary Section */}
                <div className="mb-4 space-y-1">
                  <div className="text-text-main">Total: <strong className="text-accent">${total}</strong></div>
                  {build.budget != null && (
                    <div className="text-text-main">Budget: <strong className="text-text-sub">${build.budget}</strong></div>
                  )}
                </div>

                {/* Component List with Vendor Links */}
                <div className="space-y-3 mb-4">
                  {build.items.map(item => (
                    // Individual Component Link to Vendor
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 bg-bg/50 rounded-lg border border-border-muted/50 transition-all duration-200 hover:border-accent/50 hover:shadow-md"
                    >
                      {/* Component Thumbnail Image */}
                      <img
                        src={THUMB_IMAGES[item.category] || THUMB_IMAGES.OTHER}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      {/* Component Details */}
                      <div className="flex-1 text-left">
                        <div className="text-xs text-accent font-semibold">{item.category}</div>
                        <div className="text-sm text-text-main font-medium truncate">{item.name}</div>
                        <div className="text-xs text-text-sub">${item.price}</div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Build Action Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-border-muted">
                  {/* Export Build Button */}
                  <FaDownload
                    className="text-text-sub hover:text-green-500 cursor-pointer transition-colors duration-200"
                    size={18}
                    title="Export build"
                    onClick={() => handleExport(build)}
                  />
                  {/* Edit Build Button (Placeholder) */}
                  <FaEdit
                    className="text-text-sub hover:text-accent cursor-pointer transition-colors duration-200"
                    size={18}
                    title="Edit build"
                    onClick={() => {
                      /* placeholder for edit action */
                    }}
                  />
                  {/* Delete Build Button */}
                  <FaTrashAlt
                    className="text-text-sub hover:text-red-500 cursor-pointer transition-colors duration-200"
                    size={18}
                    title="Delete build"
                    onClick={() => removeBuild(i)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
      
        {/* Export Modal - Shows when user clicks export button */}
        {exportingBuild && (
          <ExportBuild 
            build={exportingBuild} 
            onClose={() => setExportingBuild(null)} 
          />
        )}
      </div>
    </div>
  )
}
