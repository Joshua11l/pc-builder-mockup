import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import React, { useState, useEffect } from 'react'
import { AiOutlineHeart, AiFillHeart, AiOutlineSwap } from 'react-icons/ai'
import { FaExclamationTriangle, FaChartLine } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BudgetInput from '../components/BudgetInput'
import VendorDataService from '../services/VendorDataService'
import { useUser } from '../context/UserContext'
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

const TOOLTIP = {
  CPU: 'Central processing unit handles main calculations',
  GPU: 'Graphics processing unit renders images and video',
  RAM: 'Random access memory for temporary data storage',
  MB:  'Motherboard connects all components together',
  PSU: 'Power supply unit provides stable power',
  OTHER: 'Additional component'
}
const THUMB_IMAGES = { CPU: Ryzen5, GPU: RTXImg, RAM: RamImg, MB: RogImg, PSU: FocusImg }
const ALT_SUGGESTIONS = {
  CPU: 'Intel i5-11400F',
  GPU: 'AMD RX 6600',
  RAM: 'Corsair Vengeance 16GB',
  MB: 'MSI B550-A Pro',
  PSU: 'Corsair CX650M'
}

const COMPONENT_ALTERNATIVES = {
  CPU: [
    { id: 'cpu1', name: 'Ryzen 5 5600X', price: 199, link: 'https://www.amazon.com/AMD-Ryzen-5600X-12-Thread-Processor/dp/B08166SLDF' },
    { id: 'cpu2', name: 'Intel i5-11400F', price: 189, link: 'https://www.amazon.com/Intel-i5-11400F-Desktop-Processor-Cache/dp/B08X6PPTTH' },
    { id: 'cpu3', name: 'Ryzen 7 5700X', price: 259, link: 'https://www.amazon.com/AMD-Ryzen-5700X-16-Thread-Processor/dp/B09VCHR1VH' }
  ],
  GPU: [
    { id: 'gpu1', name: 'RTX 3060', price: 329, link: 'https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3060-12gb-gddr6-pci-express-4-0-graphics-card-black/6468931.p?skuId=6468931' },
    { id: 'gpu2', name: 'AMD RX 6600', price: 299, link: 'https://www.amazon.com/MSI-Radeon-RX-6600-8G/dp/B098Q4M5J3' },
    { id: 'gpu3', name: 'RTX 3060 Ti', price: 449, link: 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3060-ti-8gb-gddr6-pci-express-4-0-graphics-card-dark-platinum-and-black/6439402.p?skuId=6439402' }
  ],
  RAM: [
    { id: 'ram1', name: '16GB DDR4 3200MHz', price: 79, link: 'https://www.bestbuy.com/site/corsair-vengeance-rgb-pro-16gb-2x8gb-ddr4-3200mhz-c16-udimm-desktop-memory-black/6256216.p?skuId=6256216' },
    { id: 'ram2', name: '32GB DDR4 3600MHz', price: 139, link: 'https://www.amazon.com/Corsair-Vengeance-PC4-28800-Desktop-Memory/dp/B07RM39V5F' },
    { id: 'ram3', name: '16GB DDR4 3600MHz', price: 89, link: 'https://www.amazon.com/G-Skill-Ripjaws-PC4-28800-CL16-19-19-39-F4-3600C16D-16GVKC/dp/B07X8DVDZZ' }
  ],
  MB: [
    { id: 'mb1', name: 'ROG STRIX B550-F', price: 180, link: 'https://www.amazon.com/ROG-B550-F-II-Motherboard-Addressable/dp/B09GP7P1XS' },
    { id: 'mb2', name: 'MSI B550-A Pro', price: 139, link: 'https://www.amazon.com/MSI-MAG-B550-TOMAHAWK-Motherboard/dp/B089CZSQB4' },
    { id: 'mb3', name: 'ASUS TUF B550M', price: 159, link: 'https://www.amazon.com/ASUS-TUF-B550M-PLUS-Motherboard/dp/B088W7RKVZ' }
  ],
  PSU: [
    { id: 'psu1', name: 'Focus GX-650', price: 110, link: 'https://www.amazon.com/Seasonic-SSR-650FX-Modular-Warranty-Compact/dp/B073H33X7R' },
    { id: 'psu2', name: 'Corsair CX650M', price: 95, link: 'https://www.amazon.com/CORSAIR-CX650M-Modular-Bronze-Supply/dp/B01B72W0A2' },
    { id: 'psu3', name: 'EVGA 750W Gold', price: 129, link: 'https://www.amazon.com/EVGA-Modular-Warranty-Supply-220-G3-0750-X1/dp/B005BE058W' }
  ]
}

export default function BuildScreen() {
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
  const [vendorDataStatus, setVendorDataStatus] = useState('loading')
  const { logActivity } = useUser()

  useEffect(() => {
    // Load vendor data on mount
    const loadVendorData = async () => {
      try {
        setVendorDataStatus('loading')
        await VendorDataService.getVendorData()
        setVendorDataStatus('online')
      } catch (error) {
        console.error('Failed to load vendor data:', error)
        setVendorDataStatus('offline')
      }
    }
    loadVendorData()
  }, [])

  useEffect(() => {
    if (!items.length) return
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
   * Handle PC Build Generation (FR5, FR6)
   * Generates compatible PC build within given budget with optimized component selection
   */
  async function handleGenerate(budgetInput) {
    setIsLoading(true)
    setItems([])
    setOptimal(0)
    setSaved(false)
    setBudget(budgetInput)

    logActivity('build_generation_started', { budget: budgetInput, filters: { brandFilter, tierFilter } })

    try {
      // Get fresh vendor data
      const vendorData = await VendorDataService.getVendorData()
      
      // Simulate build generation with real vendor pricing
      setTimeout(() => {
        const demo = [
          { 
            id: '1', 
            category: 'CPU', 
            name: vendorData.components.CPU[0].name,
            price: vendorData.components.CPU[0].currentPrice,
            link: vendorData.components.CPU[0].link,
            vendor: vendorData.components.CPU[0].vendor,
            availability: vendorData.components.CPU[0].availability
          },
          { 
            id: '2', 
            category: 'GPU', 
            name: vendorData.components.GPU[0].name,
            price: vendorData.components.GPU[0].currentPrice,
            link: vendorData.components.GPU[0].link,
            vendor: vendorData.components.GPU[0].vendor,
            availability: vendorData.components.GPU[0].availability
          },
          { 
            id: '3', 
            category: 'RAM', 
            name: vendorData.components.RAM[0].name,
            price: vendorData.components.RAM[0].currentPrice,
            link: vendorData.components.RAM[0].link,
            vendor: vendorData.components.RAM[0].vendor,
            availability: vendorData.components.RAM[0].availability
          },
          { 
            id: '4', 
            category: 'MB', 
            name: vendorData.components.MB[0].name,
            price: vendorData.components.MB[0].currentPrice,
            link: vendorData.components.MB[0].link,
            vendor: vendorData.components.MB[0].vendor,
            availability: vendorData.components.MB[0].availability
          },
          { 
            id: '5', 
            category: 'PSU', 
            name: vendorData.components.PSU[0].name,
            price: vendorData.components.PSU[0].currentPrice,
            link: vendorData.components.PSU[0].link,
            vendor: vendorData.components.PSU[0].vendor,
            availability: vendorData.components.PSU[0].availability
          }
        ]
        
        const totalPrice = demo.reduce((sum, item) => sum + item.price, 0)
        const performanceScore = Math.min(90, Math.floor((budgetInput / totalPrice) * 70) + 20)
        
        setItems(demo)
        setOptimal(performanceScore)
        checkCompatibility(demo)
        setIsLoading(false)
        
        logActivity('build_generation_completed', { 
          budget: budgetInput, 
          totalPrice, 
          performanceScore,
          components: demo.length,
          vendorDataStatus: vendorData.apiStatus
        })
      }, 1200)
      
    } catch (error) {
      console.error('Build generation failed:', error)
      setIsLoading(false)
      toast.error('Failed to generate build. Please try again.', { position: 'top-right' })
      logActivity('build_generation_failed', { budget: budgetInput, error: error.message })
    }
  }

  /**
   * Handle Build Save (FR10)
   * Saves generated builds to local storage for future reference
   */
  function handleSave() {
    const builds = JSON.parse(localStorage.getItem('savedBuilds') || '[]')
    const newBuild = { items, optimal, budget, timestamp: Date.now() }
    builds.push(newBuild)
    localStorage.setItem('savedBuilds', JSON.stringify(builds))
    setSaved(true)
    toast.success('Build successfully saved!', { position: 'top-right', autoClose: 2500 })
    
    logActivity('build_saved', { 
      buildId: newBuild.timestamp, 
      totalPrice: items.reduce((sum, item) => sum + item.price, 0),
      components: items.length 
    })
  }

  /**
   * Handle Component Swapping (FR7, FR8)
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
   * Check Build Compatibility (FR14)
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

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0)

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-text-main">
      <ToastContainer />

      {items.length === 0 ? (
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
              <span className="text-xs uppercase tracking-wide text-text-sub">Preferred brand</span>
              <select
                className="w-full bg-transparent text-sm font-medium text-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-xl border border-white/10 px-3 py-2"
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
              >
                <option className="text-text-dark" value="">All Brands</option>
                <option className="text-text-dark" value="AMD">AMD</option>
                <option className="text-text-dark" value="Intel">Intel</option>
                <option className="text-text-dark" value="NVIDIA">NVIDIA</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left">
              <span className="text-xs uppercase tracking-wide text-text-sub">Performance tier</span>
              <select
                className="w-full bg-transparent text-sm font-medium text-white/90 focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-xl border border-white/10 px-3 py-2"
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value)}
              >
                <option className="text-text-dark" value="">Balanced</option>
                <option className="text-text-dark" value="entry">Entry Level</option>
                <option className="text-text-dark" value="mid">Mid Range</option>
                <option className="text-text-dark" value="enthusiast">Enthusiast</option>
              </select>
            </label>
          </div>

          <div className="mt-10 flex justify-center">
            <BudgetInput onSubmit={handleGenerate} loading={isLoading} />
          </div>
        </div>
      ) : (
        <>
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
              <button
                className={`self-start inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-base transition-colors duration-200 ${
                  saved
                    ? 'bg-primary/20 text-primary'
                    : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20'
                }`}
                onClick={handleSave}
                title="Save this build"
              >
                {saved ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
              </button>
            </div>

            <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-text-sub">Total Price</div>
                <div className="mt-1 text-2xl font-semibold text-white">${totalPrice}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-text-sub">Budget</div>
                <div className="mt-1 text-2xl font-semibold text-white">${budget}</div>
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

              {(compatibilityReport.bottlenecks.length > 0 || compatibilityReport.warnings.length > 0) && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                  <h4 className="text-lg font-semibold text-white mb-4">Issues & Recommendations</h4>
                  <div className="space-y-3">
                    {compatibilityReport.bottlenecks.map((bottleneck, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3">
                        <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <div className="text-yellow-300 font-semibold text-sm">Potential Bottleneck</div>
                          <div className="text-text-main">{bottleneck}</div>
                        </div>
                      </div>
                    ))}
                    {compatibilityReport.warnings.map((warning, idx) => (
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
              {items.map(i => (
                <Tippy key={i.id} content={TOOLTIP[i.category]} delay={100}>
                  <div className="relative group rounded-2xl border border-white/10 bg-white/5 px-5 py-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow">
                    <div className="absolute -top-3 left-5 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 text-xs font-semibold text-white/80 backdrop-blur-8 border border-white/10">
                      {i.category}
                    </div>
                    <div className="flex justify-center mb-5 mt-3">
                      <img
                        src={THUMB_IMAGES[i.category]}
                        alt={i.name}
                        className="w-20 h-20 rounded-xl object-cover border border-white/10"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-lg font-bold text-white">{i.name}</h4>
                      <div className="text-2xl font-bold text-secondary">${i.price}</div>
                      {i.vendor && (
                        <div className="text-xs text-text-sub space-y-1">
                          <div className="font-semibold text-white/70">Vendor: {i.vendor}</div>
                          <div className={i.availability === 'In Stock' ? 'text-emerald-300' : 'text-amber-300'}>
                            {i.availability}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-text-sub bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                        Alternative: {ALT_SUGGESTIONS[i.category]}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <a
                        href={i.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2 text-sm font-semibold shadow-glow hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
                      >
                        Buy Now
                      </a>
                      <button
                        onClick={() => setSwappingComponent(i.category)}
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-white/80 hover:text-white hover:bg-white/15 transition-colors duration-200"
                        title="Swap component"
                      >
                        <AiOutlineSwap size={16} />
                      </button>
                    </div>
                  </div>
                </Tippy>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Component Swap Modal */}
      {swappingComponent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border border-white/15 bg-card-elevated/95 px-6 sm:px-8 py-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Swap {swappingComponent} Component
            </h3>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {COMPONENT_ALTERNATIVES[swappingComponent]?.map(component => (
                <div
                  key={component.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleSwapComponent(swappingComponent, component)}
                >
                  <img
                    src={THUMB_IMAGES[swappingComponent]}
                    alt={component.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10"
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold">{component.name}</div>
                    <div className="text-secondary font-bold">${component.price}</div>
                  </div>
                  <div className="text-text-sub text-sm">Click to select</div>
                </div>
              ))}
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
    </div>
  )
}
