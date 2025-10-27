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
 * SavedBuildsScreen Component (FR9, FR10, FR11, FR12)
 * Manages and displays user's saved PC builds with grid layout, build management,
 * performance metrics, vendor links, and export functionality
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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 px-6 sm:px-10 py-12 shadow-glow">
          <div className="absolute -right-10 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-60" />
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/10 text-xs uppercase tracking-[0.35em] text-text-sub">
            Build library
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">Your Saved Builds</h2>
          <p className="mt-3 text-text-sub max-w-2xl">
            Revisit generated rigs, export polished build sheets, or delete outdated configurations with a single tap.
          </p>
        </div>

        {/* Empty State or Build Grid */}
        {savedBuilds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 sm:px-12 py-16 text-center">
            <h3 className="text-2xl font-semibold text-white">No builds saved… yet.</h3>
            <p className="mt-3 text-text-sub">
              Head to the build generator to craft your first configuration. It will appear here once you tap “save”.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/80">
              <span className="text-sm uppercase tracking-wide">Tip</span>
              <span className="text-sm text-text-sub">
                Saved builds keep vendor pricing snapshots so you can compare changes later.
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBuilds.map((build, i) => {
              const total = build.items.reduce((sum, it) => sum + it.price, 0)
              return (
                <div
                  key={build.timestamp}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/80 px-6 py-6 shadow-glow transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="absolute -top-16 right-6 h-32 w-32 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 blur-3xl opacity-60" />
                  <div className="relative flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs uppercase tracking-wide text-text-sub">Performance score</span>
                      <div className="mt-1 text-3xl font-semibold text-white">{build.optimal}%</div>
                    </div>
                    <span className="text-xs text-text-sub">
                      {new Date(build.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-sub">
                      <span>Total spend</span>
                      <span className="text-white font-semibold">${total}</span>
                    </div>
                    {build.budget != null && (
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-sub">
                        <span>Original budget</span>
                        <span className="text-white/80">${build.budget}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {build.items.map(item => (
                      <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all duration-200 hover:border-secondary/40 hover:bg-white/10"
                      >
                        <img
                          src={THUMB_IMAGES[item.category] || THUMB_IMAGES.OTHER}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <div className="flex-1 text-left">
                          <div className="text-xs uppercase tracking-wide text-secondary">{item.category}</div>
                          <div className="text-sm text-white font-medium truncate">{item.name}</div>
                          <div className="text-xs text-text-sub">${item.price}</div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-colors duration-200"
                      title="Export build"
                      onClick={() => handleExport(build)}
                    >
                      <FaDownload size={16} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-colors duration-200"
                      title="Edit build"
                      onClick={() => {
                        /* placeholder for edit action */
                      }}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-red-300 hover:border-red-300/40 hover:bg-red-500/10 transition-colors duration-200"
                      title="Delete build"
                      onClick={() => removeBuild(i)}
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
