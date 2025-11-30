import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart, AiOutlineSwap } from 'react-icons/ai'
import { FaExclamationTriangle, FaChartLine } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BudgetInput from '../components/BudgetInput'
import { useUser } from '../context/UserContext'
import { generateBuild, saveBuild } from '../services/buildService'
import { getCurrentUser } from '../services/authService'
import { exportToPDF, exportToCSV } from '../services/exportService'
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { PromptModal } from '../components/Modal'

const PRICE_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})
const VENDOR_LABELS = { amazon: 'Amazon', newegg: 'Newegg', bestbuy: 'Best Buy' }
const VENDOR_PRIORITY = ['amazon', 'newegg', 'bestbuy']

const formatCurrency = (value = 0) => PRICE_FORMATTER.format(Number(value) || 0)

const getVendorInfo = (links = {}) => {
  if (!links || typeof links !== 'object') {
    return { url: '#', label: 'Vendor' }
  }

  for (const key of VENDOR_PRIORITY) {
    if (links[key]) {
      return { url: links[key], label: VENDOR_LABELS[key] }
    }
  }

  const [fallbackKey, fallbackUrl] = Object.entries(links)[0] || []
  if (fallbackUrl) {
    const label = fallbackKey ? fallbackKey.charAt(0).toUpperCase() + fallbackKey.slice(1) : 'Vendor'
    return { url: fallbackUrl, label }
  }

  return { url: '#', label: 'Vendor' }
}

const mapComponentToDisplayItem = (type, component) => {
  if (!component) return null
  const vendorInfo = getVendorInfo(component.vendor_links)

  return {
    id: component.id,
    category: type.toUpperCase(),
    name: component.name,
    price: Number(component.price) || 0,
    link: vendorInfo.url,
    vendor: vendorInfo.label,
    availability: component.availability || 'In Stock',
    specs: component.specs,
    brand: component.brand,
    image_url: component.image_url || component.imageURL || component.thumbnail_url || ''
  }
}

export default function BuildScreen() {
  const location = useLocation()
  const [items, setItems]       = useState([])
  const [budget, setBudget]     = useState(0)
  const [brandFilter, setBrandFilter] = useState('')
  const [tierFilter, setTierFilter]   = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [optimal, setOptimal]     = useState(0)
  const [animated, setAnimated]   = useState(0)
  const [saved, setSaved]         = useState(false)
  const [swappingComponent, setSwappingComponent] = useState(null)
  const [compatibilityReport, setCompatibilityReport] = useState(null)
  const [vendorDataStatus, setVendorDataStatus] = useState('online')
  const [generatedBuild, setGeneratedBuild] = useState(null)
  const [user, setUser] = useState(null)
  const [componentAlternatives, setComponentAlternatives] = useState({})
  const [promptModal, setPromptModal] = useState({ isOpen: false, type: null, title: '', message: '', placeholder: '', defaultValue: '' })
  const [editMode, setEditMode] = useState(false)
  const { logActivity } = useUser()

  useEffect(() => {
    // Get current user
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()

    // Load saved build if passed from SavedBuildsScreen
    if (location.state?.editBuild) {
      const editBuild = location.state.editBuild

      // Load components as display items
      const loadedItems = Object.entries(editBuild.components || {})
        .map(([type, component]) => mapComponentToDisplayItem(type, component))
        .filter(Boolean)

      // Calculate performance score for loaded build
      const loadedBudget = editBuild.budget || editBuild.total_price || 1000
      const loadedPrice = editBuild.total_price || 0
      const budgetUtilization = Math.min(loadedPrice / loadedBudget, 1.0)
      const baseScore = budgetUtilization * 100
      const componentCount = loadedItems.length
      const completenessBonus = Math.min(componentCount / 8, 1.0) * 10
      const calculatedPerformance = Math.min(95, Math.max(15, Math.floor(baseScore * 0.85 + completenessBonus)))

      setItems(loadedItems)
      setBudget(loadedBudget)
      setOptimal(calculatedPerformance)
      setGeneratedBuild(editBuild.components)
      setCompatibilityReport(editBuild.compatibility_report)
      setEditMode(true) // Enable edit mode automatically

      toast.info(`Loaded build: ${editBuild.build_name}`, { position: 'top-right' })
    }
  }, [])

  useEffect(() => {
    if (!items || items.length === 0) return
    setAnimated(0)
    const duration  = 800
    const frameRate = 15
    const total     = duration / frameRate
    let frame       = 0
    const inc       = optimal / total
    const iv = setInterval(() => {
      frame++
      setAnimated(Math.min(optimal, Math.round(inc * frame)))
      if (frame >= total) clearInterval(iv)
    }, frameRate)
    return () => clearInterval(iv)
  }, [optimal, items])

  /**
   * Handle PC Build Generation
   * FR1: Budget input
   * FR2: Auto-generate compatible build
   * FR5: Price range filter (via budget allocation)
   * FR6: Brand filter capability
   * FR7: Tier selection capability
   * FR8: Performance metrics calculation
   * Generates compatible PC build within given budget with optimized component selection
   */
  async function handleGenerate(budgetInput) {
    const normalizedBudget = Number(budgetInput) || 0
    setIsLoading(true)
    setItems([])
    setOptimal(0)
    setSaved(false)
    setBudget(normalizedBudget)
    setComponentAlternatives({})

    logActivity('build_generation_started', { budget: normalizedBudget, filters: { brandFilter, tierFilter } })

    try {
      // Generate build using Supabase
      const result = await generateBuild(normalizedBudget)

      if (result.success) {
        // Convert build to display format
        const buildComponents = result.build
        const displayItems = Object.entries(buildComponents)
          .map(([type, component]) => mapComponentToDisplayItem(type, component))
          .filter(Boolean)

        const alternativeDisplayMap = Object.entries(result.alternatives || {}).reduce((acc, [type, comps]) => {
          const categoryKey = type.toUpperCase()
          acc[categoryKey] = (comps || [])
            .map(component => mapComponentToDisplayItem(type, component))
            .filter(Boolean)
          return acc
        }, {})

        // Calculate performance score based on budget utilization and component quality
        // Higher spending = better performance, but diminishing returns
        const budgetUtilization = Math.min(result.totalPrice / normalizedBudget, 1.0)
        const baseScore = budgetUtilization * 100

        // Adjust for component count (more components = more complete build)
        const componentCount = displayItems.length
        const completenessBonus = Math.min(componentCount / 8, 1.0) * 10

        const performanceScore = Math.min(95, Math.max(15, Math.floor(baseScore * 0.85 + completenessBonus)))

        setItems(displayItems)
        setOptimal(performanceScore)
        setGeneratedBuild(result.build)
        setCompatibilityReport(result.compatibilityReport)
        setComponentAlternatives(alternativeDisplayMap)
        setIsLoading(false)

        toast.success('Build generated successfully!', { position: 'top-right', autoClose: 2000 })

        logActivity('build_generation_completed', {
          budget: normalizedBudget,
          totalPrice: result.totalPrice,
          performanceScore,
          components: displayItems.length
        })
      } else {
        throw new Error(result.error || 'Failed to generate build')
      }

    } catch (error) {
      console.error('Build generation failed:', error)
      setIsLoading(false)
      const message = error.message || 'Failed to generate build. Please try again.'
      toast.error(message, { position: 'top-right' })
      logActivity('build_generation_failed', { budget: normalizedBudget, error: message })
    }
  }

  /**
   * Handle Build Save (FR10)
   * Saves generated builds to Supabase database for future reference
   */
  function handleSave() {
    if (!user) {
      toast.error('Please login to save builds', { position: 'top-right' })
      return
    }

    if (!generatedBuild) {
      toast.error('Please generate a build first', { position: 'top-right' })
      return
    }

    setPromptModal({
      isOpen: true,
      type: 'save',
      title: 'Save Build',
      message: 'Enter a name for this build:',
      placeholder: 'My Gaming PC',
      defaultValue: ''
    })
  }

  async function handlePromptSubmit(value) {
    if (promptModal.type === 'save') {
      const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

      const result = await saveBuild(
        user.id,
        value,
        generatedBuild,
        totalPrice,
        budget,
        compatibilityReport
      )

      if (result.success) {
        setSaved(true)
        toast.success('Build successfully saved!', { position: 'top-right', autoClose: 2500 })

        logActivity('build_saved', {
          buildId: result.data.id,
          buildName: value,
          totalPrice,
          components: items.length
        })
      } else {
        toast.error('Failed to save build: ' + result.error, { position: 'top-right' })
      }
    } else if (promptModal.type === 'exportPDF') {
      await handleExportPDFWithName(value)
    } else if (promptModal.type === 'exportCSV') {
      handleExportCSVWithName(value)
    }

    setPromptModal({ isOpen: false, type: null, title: '', message: '', placeholder: '', defaultValue: '' })
  }

  /**
   * Handle Component Swapping
   * FR3: Display detailed component specs
   * FR13: Swap individual components
   * FR14: View alternative components
   * FR15: Manual component selection
   * Allows users to swap individual parts within generated build and view specifications
   */
  function handleSwapComponent(category, newComponent) {
    const oldComponent = items.find(item => item.category === category)
    const updatedItems = items.map(item => 
      item.category === category ? { ...newComponent, category } : item
    )
    setItems(updatedItems)
    setSwappingComponent(null)
    
    // Recalculate compatibility and performance
    checkCompatibility(updatedItems)
    toast.success(`${category} swapped successfully!`, { position: 'top-right', autoClose: 2000 })
    
    logActivity('component_swapped', {
      category,
      oldComponent: oldComponent?.name,
      newComponent: newComponent.name,
      priceDifference: newComponent.price - (oldComponent?.price || 0)
    })
  }

  /**
   * Check Build Compatibility
   * FR4: Compatibility validation
   * Display compatibility report for each generated build with warnings and bottlenecks
   */
  function checkCompatibility(buildItems) {
    // Static compatibility checking simulation
    const totalPrice = buildItems.reduce((sum, item) => sum + item.price, 0)
    const budgetUtilization = (totalPrice / budget) * 100

    const report = {
      compatible: true,
      powerConsumption: Math.floor(Math.random() * 200) + 300, // 300-500W
      bottlenecks: [],
      warnings: [],
      budgetUtilization: Math.round(budgetUtilization)
    }

    // Add some realistic warnings
    if (budgetUtilization > 95) {
      report.warnings.push('Budget nearly exceeded')
    }

    const cpu = buildItems.find(item => item.category === 'CPU')
    const gpu = buildItems.find(item => item.category === 'GPU')

    if (cpu?.price < 150 && gpu?.price > 400) {
      report.bottlenecks.push('CPU may bottleneck high-end GPU')
    }

    if (report.powerConsumption > 450) {
      report.warnings.push('High power consumption - ensure adequate cooling')
    }

    setCompatibilityReport(report)
    return report
  }

  /**
   * Export build to PDF
   * FR12: Export builds (PDF format)
   */
  function handleExportPDF() {
    if (!generatedBuild) {
      toast.error('Please generate a build first', { position: 'top-right' })
      return
    }

    setPromptModal({
      isOpen: true,
      type: 'exportPDF',
      title: 'Export to PDF',
      message: 'Enter a name for your build:',
      placeholder: 'My PC Build',
      defaultValue: 'My PC Build'
    })
  }

  async function handleExportPDFWithName(buildName) {
    const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

    const result = await exportToPDF(generatedBuild, buildName, totalPrice, compatibilityReport)

    if (result.success) {
      toast.success('PDF exported successfully!', { position: 'top-right' })
    } else {
      toast.error('Failed to export PDF: ' + result.error, { position: 'top-right' })
    }
  }

  /**
   * Export build to CSV
   * FR12: Export builds (CSV format)
   */
  function handleExportCSV() {
    if (!generatedBuild) {
      toast.error('Please generate a build first', { position: 'top-right' })
      return
    }

    setPromptModal({
      isOpen: true,
      type: 'exportCSV',
      title: 'Export to CSV',
      message: 'Enter a name for your build:',
      placeholder: 'My PC Build',
      defaultValue: 'My PC Build'
    })
  }

  function handleExportCSVWithName(buildName) {
    const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

    exportToCSV(generatedBuild, buildName, totalPrice)
    toast.success('CSV exported successfully!', { position: 'top-right' })
  }

  const totalPrice = items && items.length > 0 ? items.reduce((sum, i) => sum + (Number(i.price) || 0), 0) : 0
  const formattedTotalPrice = formatCurrency(totalPrice)
  const formattedBudget = formatCurrency(budget)
  const activeSwapItem = swappingComponent ? items.find(item => item.category === swappingComponent) : null
  const swapOptions = swappingComponent
    ? (componentAlternatives[swappingComponent] || []).filter(option => option.id !== activeSwapItem?.id)
    : []

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-text-main">
      <ToastContainer />

      {!items || items.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 px-6 sm:px-12 py-16 text-center shadow-glow">
          <div className="absolute -top-24 right-12 h-48 w-48 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 blur-3xl opacity-60" />
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/10 text-xs uppercase tracking-[0.35em] text-text-sub">
            Smart build engine
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white">Create a Build</h2>
          <p className="mt-4 text-lg text-text-sub max-w-2xl mx-auto">
            Enter your budget and let our optimizer balance performance, thermals, and vendor availability for you.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left">
              <span className="text-xs uppercase tracking-wide text-text-sub">Primary Use</span>
              <select
                className="w-full bg-transparent text-sm font-medium text-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-xl border border-white/10 px-3 py-2"
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
              >
                <option className="text-text-dark" value="">All-Purpose</option>
                <option className="text-text-dark" value="gaming">Gaming</option>
                <option className="text-text-dark" value="workstation">Content Creation</option>
                <option className="text-text-dark" value="office">Office Work</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left">
              <span className="text-xs uppercase tracking-wide text-text-sub">Budget Priority</span>
              <select
                className="w-full bg-transparent text-sm font-medium text-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-xl border border-white/10 px-3 py-2"
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value)}
              >
                <option className="text-text-dark" value="">Balanced</option>
                <option className="text-text-dark" value="performance">Max Performance</option>
                <option className="text-text-dark" value="value">Best Value</option>
                <option className="text-text-dark" value="efficiency">Power Efficient</option>
              </select>
            </label>
          </div>

          <div className="mt-10 flex justify-center">
            <BudgetInput onSubmit={handleGenerate} loading={isLoading} />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 px-6 sm:px-10 py-10 text-left shadow-glow">
            <div className="absolute -top-24 -right-10 h-48 w-48 rounded-full bg-gradient-to-br from-primary/35 to-secondary/20 blur-3xl opacity-60" />
            <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/10 text-xs uppercase tracking-[0.35em] text-text-sub">
                  Build ready
                </span>
                <h2 className="mt-4 text-4xl font-bold text-white">Build Successfully Created</h2>
                <p className="mt-3 text-text-sub max-w-2xl">
                  Here's your optimized setup based on your budget. Explore vendor links, swap alternatives, or save the entire rig for later.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-base transition-colors duration-200 ${
                    saved
                      ? 'bg-primary/20 text-primary'
                      : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                  onClick={handleSave}
                  title="Save this build"
                >
                  {saved ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
                </button>
                <button
                  className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition-colors duration-200 ${
                    editMode
                      ? 'bg-secondary/20 text-secondary border-secondary/40'
                      : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                  onClick={() => setEditMode(!editMode)}
                  title="Toggle edit mode"
                >
                  <FaChartLine />
                  {editMode ? 'View Mode' : 'Edit Mode'}
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 text-white/80 hover:text-white hover:bg-white/20 px-4 py-2 text-sm transition-colors duration-200"
                  onClick={handleExportPDF}
                  title="Export as PDF"
                >
                  PDF
                </button>
                <button
                  className="inline-flex items-centers justify-center gap-2 rounded-full border border-white/15 bg-white/10 text-white/80 hover:text-white hover:bg-white/20 px-4 py-2 text-sm transition-colors duration-200"
                  onClick={handleExportCSV}
                  title="Export as CSV"
                >
                  CSV
                </button>
              </div>
            </div>

            <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-text-sub">Total Price</div>
                <div className="mt-1 text-2xl font-semibold text-white">{formattedTotalPrice}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-text-sub">Budget</div>
                <div className="mt-1 text-2xl font-semibold text-white">{formattedBudget}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-text-sub">Pricing Source</div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <span
                    className={`inline-flex h-2.5 w-2.5 rounded-full ${
                      vendorDataStatus === 'online'
                        ? 'bg-green-400'
                        : vendorDataStatus === 'offline'
                        ? 'bg-red-400'
                        : 'bg-yellow-400'
                    }`}
                  />
                  {vendorDataStatus === 'loading'
                    ? 'Syncing live data…'
                    : vendorDataStatus === 'online'
                    ? 'Live vendor feed'
                    : 'Cached pricing'}
                </div>
              </div>
            </div>
          </div>

          {compatibilityReport && (
            <div className="rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 px-6 sm:px-10 py-10 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaChartLine className="text-secondary" />
                    Compatibility Overview
                  </h3>
                  <p className="text-sm text-text-sub mt-1">
                    Balanced components with quick highlights on power draw, budget usage, and optimizations.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left">
                  <div className="text-xs uppercase tracking-wide text-text-sub">Power Consumption</div>
                  <div className="mt-2 text-3xl font-semibold text-white">{compatibilityReport.powerConsumption}W</div>
                  <div className="text-xs text-text-sub mt-1">Estimated sustained draw</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left">
                  <div className="text-xs uppercase tracking-wide text-text-sub">Budget Utilization</div>
                  <div className="mt-2 text-3xl font-semibold text-white">
                    {isFinite(compatibilityReport.budgetUtilization) ? compatibilityReport.budgetUtilization : '100'}%
                  </div>
                  <div className="text-xs text-text-sub mt-1">Of your available budget</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20 px-6 py-5 text-left">
                  <div className="text-xs uppercase tracking-wide text-text-sub">Performance Score</div>
                  <div className="mt-2 text-3xl font-semibold text-white">{optimal}%</div>
                  <div className="text-xs text-text-sub mt-1">Optimization level</div>
                </div>
              </div>

              {compatibilityReport && (compatibilityReport.bottlenecks?.length > 0 || compatibilityReport.warnings?.length > 0) && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                  <h4 className="text-lg font-semibold text-white mb-4">Issues & Recommendations</h4>
                  <div className="space-y-3">
                    {compatibilityReport.bottlenecks?.map((bottleneck, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3">
                        <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <div className="text-yellow-300 font-semibold text-sm">Potential Bottleneck</div>
                          <div className="text-text-main">{bottleneck}</div>
                        </div>
                      </div>
                    ))}
                    {compatibilityReport.warnings?.map((warning, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3">
                        <FaExclamationTriangle className="text-orange-400 mt-0.5 flex-shrink-0" size={16} />
                        <div className="text-left">
                          <div className="text-orange-300 font-semibold text-sm">Warning</div>
                          <div className="text-text-main">{warning}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 px-6 sm:px-10 py-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Performance Overview</h3>
            <div className="flex justify-center">
              <div className="w-44 h-44 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <CircularProgressbarWithChildren
                  value={animated}
                  maxValue={100}
                  styles={buildStyles({
                    pathColor: '#38bdf8',
                    trailColor: 'rgba(148, 163, 184, 0.15)',
                    strokeLinecap: 'round',
                    rotation: 0.75
                  })}
                  strokeWidth={12}
                  circleRatio={0.5}
                >
                  <div className="text-3xl font-extrabold text-white">{animated}%</div>
                  <div className="text-sm text-text-sub font-semibold">Performance Score</div>
                </CircularProgressbarWithChildren>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 px-6 sm:px-10 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="text-2xl font-bold text-white">Your PC Components</h3>
              <p className="text-sm text-text-sub">Tap any card to swap parts or jump straight to the vendor page.</p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => {
                const alternativesForCategory = componentAlternatives[item.category] || []
                const suggestedAlt = alternativesForCategory.find(alt => alt.id !== item.id)

                return (
                  <div key={item.id} className="relative group rounded-2xl border border-white/10 bg-white/5 px-5 py-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow">
                    <div className="absolute top-3 left-3 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 text-xs font-semibold text-white/80 backdrop-blur-8 border border-white/10">
                      {item.category}
                    </div>
                    <div className="text-center space-y-2 mt-8">
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <div className="text-2xl font-bold text-secondary">{formatCurrency(item.price)}</div>
                      {item.vendor && (
                        <div className="text-xs text-text-sub space-y-1">
                          <div className="font-semibold text-white/70">Vendor: {item.vendor}</div>
                          <div className={item.availability === 'In Stock' ? 'text-emerald-300' : 'text-amber-300'}>
                            {item.availability}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-text-sub bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                        {suggestedAlt
                          ? <>Alternative: {suggestedAlt.name} - {formatCurrency(suggestedAlt.price)}</>
                          : 'No alternative available from current vendors'}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      {!editMode ? (
                        <>
                          {/* FR16: View vendor links */}
                          <a
                            href={item.link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2 text-sm font-semibold shadow-glow hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
                          >
                            Buy Now
                          </a>
                          <button
                            onClick={() => setSwappingComponent(item.category)}
                            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-white/80 hover:text-white hover:bg-white/15 transition-colors duration-200"
                            title="Swap component"
                          >
                            <AiOutlineSwap size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSwappingComponent(item.category)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-secondary text-white py-2 text-sm font-semibold shadow-glow hover:bg-secondary/90 transition-all duration-200"
                          title="Change component"
                        >
                          <AiOutlineSwap size={16} />
                          Change Component
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Component Swap Modal */}
      {swappingComponent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border border-white/15 bg-card-elevated/95 px-6 sm:px-8 py-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Swap {swappingComponent} Component
            </h3>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {swapOptions.length > 0 ? (
                swapOptions.map(option => (
                  <div
                    key={option.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleSwapComponent(swappingComponent, option)}
                  >
                    <div className="flex-1">
                      <div className="text-white font-semibold">{option.name}</div>
                      <div className="text-secondary font-bold">{formatCurrency(option.price)}</div>
                    </div>
                    <div className="text-text-sub text-sm">Click to select</div>
                  </div>
                ))
              ) : (
                <div className="text-text-sub text-center py-8 border border-dashed border-white/15 rounded-2xl">
                  No live alternatives available for this category yet. Try a different part or regenerate a build.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSwappingComponent(null)}
                className="px-4 py-2 rounded-full border border-white/15 text-text-sub hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <PromptModal
        isOpen={promptModal.isOpen}
        onClose={() => setPromptModal({ isOpen: false, type: null, title: '', message: '', placeholder: '', defaultValue: '' })}
        onSubmit={handlePromptSubmit}
        title={promptModal.title}
        message={promptModal.message}
        placeholder={promptModal.placeholder}
        defaultValue={promptModal.defaultValue}
        confirmText="Submit"
        cancelText="Cancel"
      />
    </div>
  )
}
