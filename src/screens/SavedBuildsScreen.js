import React, { useState, useEffect } from 'react'
import { FaTrashAlt, FaEdit, FaDownload, FaMicrochip, FaMemory, FaHdd, FaPlug, FaBox, FaFan } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUserBuilds, deleteBuild } from '../services/buildService'
import { getCurrentUser } from '../services/authService'
import { exportToPDF, exportToCSV } from '../services/exportService'
import ExportBuild from '../components/ExportBuild'
import { ConfirmModal } from '../components/Modal'

// Component icons mapping
const COMPONENT_ICONS = {
  CPU: FaMicrochip,
  GPU: FaMicrochip,
  RAM: FaMemory,
  MOTHERBOARD: FaMicrochip,
  STORAGE: FaHdd,
  PSU: FaPlug,
  CASE: FaBox,
  COOLER: FaFan
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
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, buildId: null, buildName: '' })
  const navigate = useNavigate()

  // Load saved builds from Supabase on component mount
  useEffect(() => {
    loadBuilds()
  }, [])

  async function loadBuilds() {
    setLoading(true)

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      setLoading(false)
      toast.info('Please login to view saved builds', { position: 'top-right' })
      return
    }

    setUser(currentUser)

    const result = await getUserBuilds(currentUser.id)

    if (result.success) {
      setSavedBuilds(result.data)
    } else {
      toast.error('Failed to load builds: ' + result.error, { position: 'top-right' })
    }

    setLoading(false)
  }

  /**
   * Remove a saved build from storage
   * Satisfies FR11: Delete saved builds from the saved builds list
   */
  function removeBuild(buildId, buildName) {
    setDeleteModal({ isOpen: true, buildId, buildName })
  }

  async function confirmDeleteBuild() {
    const result = await deleteBuild(deleteModal.buildId, user.id)

    if (result.success) {
      toast.success('Build deleted successfully!', { position: 'top-right' })
      // Refresh list
      loadBuilds()
    } else {
      toast.error('Failed to delete build: ' + result.error, { position: 'top-right' })
    }

    setDeleteModal({ isOpen: false, buildId: null, buildName: '' })
  }

  /**
   * Handle build export - opens export modal
   * Satisfies FR12: Export builds in various formats
   */
  function handleExport(build) {
    setExportingBuild(build)
  }

  /**
   * Handle build edit - navigate to BuildScreen with saved build data
   */
  function handleEdit(build) {
    // Pass build data via navigation state
    navigate('/build', { state: { editBuild: build } })
  }

  /**
   * Export build to PDF
   */
  async function handleExportPDF(build) {
    const result = await exportToPDF(
      build.components,
      build.build_name,
      build.total_price,
      build.compatibility_report
    )

    if (result.success) {
      toast.success('PDF exported successfully!', { position: 'top-right' })
    } else {
      toast.error('Failed to export PDF: ' + result.error, { position: 'top-right' })
    }
  }

  /**
   * Export build to CSV
   */
  function handleExportCSV(build) {
    exportToCSV(
      build.components,
      build.build_name,
      build.total_price
    )
    toast.success('CSV exported successfully!', { position: 'top-right' })
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
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 sm:px-12 py-16 text-center">
            <h3 className="text-2xl font-semibold text-white">Loading builds...</h3>
          </div>
        ) : savedBuilds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 sm:px-12 py-16 text-center">
            <h3 className="text-2xl font-semibold text-white">No builds saved… yet.</h3>
            <p className="mt-3 text-text-sub">
              Head to the build generator to craft your first configuration. It will appear here once you tap "save".
            </p>
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/80">
              <span className="text-sm uppercase tracking-wide">Tip</span>
              <span className="text-sm text-text-sub">
                Saved builds keep vendor pricing snapshots so you can compare changes later.
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savedBuilds.map((build) => {
              const components = build.components || {}
              const componentsList = Object.entries(components).map(([type, component]) => ({
                id: component.id,
                category: type.toUpperCase(),
                name: component.name,
                price: parseFloat(component.price),
                link: component.vendor_links?.amazon || component.vendor_links?.newegg || '#'
              }))

              const Icon = COMPONENT_ICONS.CPU

              return (
                <div
                  key={build.id}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/80 shadow-glow transition-all duration-200 hover:border-white/20 hover:shadow-xl flex flex-col"
                >
                  <div className="absolute -top-16 right-6 h-32 w-32 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 blur-3xl opacity-60" />

                  {/* Header */}
                  <div className="relative px-6 py-5 border-b border-white/10">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs uppercase tracking-wide text-text-sub">Build Name</span>
                        <div className="mt-1 text-xl sm:text-2xl font-semibold text-white truncate">{build.build_name}</div>
                      </div>
                      <span className="text-xs text-text-sub whitespace-nowrap">
                        {new Date(build.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <span className="text-xs text-text-sub block">Total Price</span>
                        <span className="text-lg font-semibold text-white">${build.total_price.toFixed(2)}</span>
                      </div>
                      {build.budget != null && (
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          <span className="text-xs text-text-sub block">Budget</span>
                          <span className="text-lg font-semibold text-white/80">${build.budget.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Components List - Scrollable */}
                  <div className="relative px-6 py-4 flex-1 overflow-auto max-h-[400px]">
                    <div className="text-xs uppercase tracking-wide text-text-sub mb-3">Components ({componentsList.length})</div>
                    <div className="space-y-2">
                      {componentsList.map(item => {
                        const ComponentIcon = COMPONENT_ICONS[item.category] || FaMicrochip
                        return (
                          <a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition-all duration-200 hover:border-secondary/40 hover:bg-white/10"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex-shrink-0">
                              <ComponentIcon className="text-primary text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs uppercase tracking-wide text-secondary font-semibold">{item.category}</div>
                              <div className="text-sm text-white font-medium truncate group-hover:text-clip group-hover:whitespace-normal" title={item.name}>
                                {item.name}
                              </div>
                              <div className="text-xs text-text-sub font-semibold">${item.price.toFixed(2)}</div>
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="relative px-6 py-4 border-t border-white/10 flex justify-between items-center gap-2">
                    <div className="text-xs text-text-sub">
                      {componentsList.length} parts
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-secondary hover:border-secondary/40 hover:bg-secondary/10 transition-colors duration-200"
                        title="Edit build"
                        onClick={() => handleEdit(build)}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-colors duration-200"
                        title="Export PDF"
                        onClick={() => handleExportPDF(build)}
                      >
                        <FaDownload size={14} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-red-300 hover:border-red-300/40 hover:bg-red-500/10 transition-colors duration-200"
                        title="Delete build"
                        onClick={() => removeBuild(build.id, build.build_name)}
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
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

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, buildId: null, buildName: '' })}
          onConfirm={confirmDeleteBuild}
          title="Delete Build"
          message={`Are you sure you want to delete "${deleteModal.buildName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDanger={true}
        />
      </div>
    </div>
  )
}
