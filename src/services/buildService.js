/**
 * Build Service
 * Handles PC build generation, compatibility checking, and management
 * Advanced algorithm with dynamic budget allocation and optimization
 *
 * FR1: Budget input
 * FR2: Auto-generate compatible build
 * FR3: Display detailed component specs
 * FR4: Compatibility validation
 * FR5: Price range filter
 * FR6: Brand filter
 * FR7: Tier selection
 * FR8: Performance metrics
 * FR10: Save builds
 * FR11: Delete builds
 * FR13: Swap individual components
 * FR14: View alternative components
 */

import { supabase } from '../lib/supabase'
import { getAllComponents } from './componentService'

const REQUIRED_CATEGORIES = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'case', 'psu', 'cooler']

const toNumber = (value) => {
  if (typeof value === 'number') return value
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const calculateMinimumBuildCost = (componentsGrouped = {}) => {
  let total = 0

  for (const category of REQUIRED_CATEGORIES) {
    const components = componentsGrouped[category] || []
    if (!components.length) return Infinity
    const cheapest = components.reduce((min, component) => Math.min(min, toNumber(component.price)), Infinity)
    if (!Number.isFinite(cheapest)) return Infinity
    total += cheapest
  }

  return parseFloat(total.toFixed(2))
}


const getAlternativeComponents = (components = [], selectedId, limit = 3) => {
  if (!components.length) return []
  return [...components]
    .filter(component => component.id !== selectedId)
    .sort((a, b) => toNumber(a.price) - toNumber(b.price))
    .slice(0, limit)
}

/**
 * Calculate performance score for a component
 * Higher score = better value for money
 */
const calculateComponentScore = (component, type) => {
  const price = toNumber(component.price)
  if (price === 0) return 0

  let performanceScore = 0

  switch (type) {
    case 'cpu':
      const cores = component.specs.cores || 1
      const threads = component.specs.threads || 1
      const boostClock = parseFloat(component.specs.boost_clock) || 3.0
      performanceScore = (cores * threads * boostClock) / price
      break

    case 'gpu':
      const vramSize = parseInt(component.specs.vram) || 4
      const tdp = component.specs.tdp || 100
      performanceScore = (vramSize * tdp) / price
      break

    case 'ram':
      const capacity = parseInt(component.specs.capacity) || 8
      const speed = parseInt(component.specs.speed) || 2400
      performanceScore = (capacity * speed) / price
      break

    case 'storage':
      const storageCapacity = parseInt(component.specs.capacity) || 256
      const readSpeed = parseInt(component.specs.read_speed) || 500
      performanceScore = (storageCapacity * readSpeed) / price
      break

    case 'psu':
      const wattage = component.specs.wattage || 450
      const efficiency = component.specs.efficiency || '80+'
      const efficiencyScore = efficiency.includes('Gold') ? 1.2 : efficiency.includes('Bronze') ? 1.1 : 1.0
      performanceScore = (wattage * efficiencyScore) / price
      break

    default:
      performanceScore = 100 / price
  }

  return performanceScore
}

/**
 * Generate a compatible PC build within budget
 * Advanced algorithm with dynamic optimization and backtracking
 *
 * FR1: Budget input (accepts budget parameter)
 * FR2: Auto-generate compatible build (core functionality)
 * FR4: Compatibility validation (via checkCompatibility)
 * FR5: Price range filter (via budget allocation)
 * FR8: Performance metrics (calculated in result)
 *
 * @param {number} budget - Total budget in USD
 * @returns {Promise} Generated build object
 */
export const generateBuild = async (budget) => {
  try {
    // Fetch all components
    const { data: componentsGrouped } = await getAllComponents()

    if (!componentsGrouped) {
      throw new Error('Failed to fetch components')
    }

    const minimumViableCost = calculateMinimumBuildCost(componentsGrouped)

    if (!Number.isFinite(minimumViableCost)) {
      throw new Error('Component inventory is incomplete. Please add more parts before generating builds.')
    }

    if (budget < minimumViableCost) {
      return {
        success: false,
        error: `The minimum build cost with the current inventory is $${minimumViableCost.toFixed(2)}. Increase your budget to continue.`,
        minimumRequiredBudget: minimumViableCost,
      }
    }

    // Initial budget allocation percentages (will be adjusted dynamically)
    // Add slight randomization to allocation (±2%) for variety
    const randomOffset = () => (Math.random() - 0.5) * 0.04 // Random ±2%
    const initialAllocation = {
      cpu: 0.20 + randomOffset(),      // 18-22%
      gpu: 0.30 + randomOffset(),      // 28-32% (most important for gaming)
      motherboard: 0.12 + randomOffset(), // 10-14%
      ram: 0.10 + randomOffset(),      // 8-12%
      storage: 0.10 + randomOffset(),  // 8-12%
      psu: 0.08 + randomOffset(),      // 6-10%
      case: 0.06 + randomOffset(),     // 4-8%
      cooler: 0.04 + randomOffset(),   // 2-6%
    }

    // Try generating build with multiple strategies
    let buildResult = null

    // Strategy 1: Standard allocation
    buildResult = await attemptBuildGeneration(componentsGrouped, budget, initialAllocation)

    // Strategy 2: If failed, try budget-optimized allocation (favor cheaper components)
    if (!buildResult.success) {
      const budgetAllocation = {
        cpu: 0.18,
        gpu: 0.28,
        motherboard: 0.10,
        ram: 0.12,
        storage: 0.12,
        psu: 0.10,
        case: 0.06,
        cooler: 0.04,
      }
      buildResult = await attemptBuildGeneration(componentsGrouped, budget, budgetAllocation)
    }

    // Strategy 3: If still failed, use aggressive cost-cutting
    if (!buildResult.success) {
      const aggressiveAllocation = {
        cpu: 0.16,
        gpu: 0.25,
        motherboard: 0.09,
        ram: 0.13,
        storage: 0.14,
        psu: 0.11,
        case: 0.07,
        cooler: 0.05,
      }
      buildResult = await attemptBuildGeneration(componentsGrouped, budget, aggressiveAllocation)
    }

    // Strategy 4: Last resort - use minimum viable components
    if (!buildResult.success) {
      buildResult = await generateMinimumViableBuild(componentsGrouped, budget)
    }

    if (!buildResult.success) {
      return {
        success: false,
        error: `Unable to generate a build within $${budget.toFixed(2)} budget. Try increasing your budget to at least $${minimumViableCost.toFixed(2)}.`,
        minimumRequiredBudget: minimumViableCost,
      }
    }

    return buildResult
  } catch (error) {
    console.error('Build generation error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Attempt to generate a build with specific budget allocation
 */
const attemptBuildGeneration = async (componentsGrouped, budget, budgetAllocation) => {
  try {
    const build = {}
    const buildAlternatives = {}
    let totalPrice = 0

    // Selection order optimized for compatibility
    const selectionOrder = [
      { type: 'cpu', allocation: budgetAllocation.cpu },
      { type: 'motherboard', allocation: budgetAllocation.motherboard },
      { type: 'ram', allocation: budgetAllocation.ram },
      { type: 'gpu', allocation: budgetAllocation.gpu },
      { type: 'case', allocation: budgetAllocation.case },
      { type: 'storage', allocation: budgetAllocation.storage },
      { type: 'psu', allocation: budgetAllocation.psu },
      { type: 'cooler', allocation: budgetAllocation.cooler },
    ]

    for (const { type, allocation } of selectionOrder) {
      const remainingBudget = budget - totalPrice
      const componentBudget = budget * allocation

      // Get compatible pool based on already selected components
      let componentPool = getCompatiblePool(componentsGrouped, type, build)

      if (!componentPool.length) {
        return { success: false, error: `No compatible ${type} found` }
      }

      // Select component using smart selection
      const selected = selectComponentSmartly(
        componentPool,
        componentBudget,
        remainingBudget,
        type,
        selectionOrder.indexOf({ type, allocation }) + 1,
        selectionOrder.length
      )

      if (!selected) {
        return { success: false, error: `Could not select ${type} within budget` }
      }

      build[type] = selected
      buildAlternatives[type] = getAlternativeComponents(componentPool, selected.id)
      totalPrice += toNumber(selected.price)

      // Early exit if over budget
      if (totalPrice > budget) {
        return { success: false, error: 'Budget exceeded during selection' }
      }
    }

    // Final budget check
    if (totalPrice > budget) {
      return { success: false, error: 'Total price exceeds budget' }
    }

    // Check compatibility
    const compatibilityReport = checkCompatibility(build)

    return {
      success: true,
      build,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      budget,
      compatibilityReport,
      alternatives: buildAlternatives,
      minimumRequiredBudget: calculateMinimumBuildCost(componentsGrouped),
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get compatible component pool based on already selected parts
 */
const getCompatiblePool = (componentsGrouped, type, currentBuild) => {
  const pool = componentsGrouped[type] || []

  switch (type) {
    case 'motherboard':
      if (currentBuild.cpu) {
        return pool.filter(mb => mb.specs.socket === currentBuild.cpu.specs.socket)
      }
      return pool

    case 'ram':
      if (currentBuild.motherboard) {
        return pool.filter(ram => ram.specs.type === currentBuild.motherboard.specs.ram_type)
      }
      return pool

    case 'case':
      if (currentBuild.gpu) {
        const gpuLength = parseInt(currentBuild.gpu.specs.length) || 0
        return pool.filter(c => {
          const maxGpuLength = parseInt(c.specs.max_gpu_length) || 400
          return maxGpuLength >= gpuLength
        })
      }
      return pool

    case 'psu':
      if (currentBuild.cpu && currentBuild.gpu) {
        const totalTDP = (currentBuild.cpu.specs.tdp || 0) + (currentBuild.gpu.specs.tdp || 0) + 100
        const recommendedWattage = Math.ceil(totalTDP * 1.2) // 20% headroom for tighter budgets
        return pool.filter(psu => psu.specs.wattage >= recommendedWattage)
      }
      return pool

    case 'cooler':
      if (currentBuild.cpu) {
        return pool.filter(cooler =>
          cooler.specs.socket_support?.includes(currentBuild.cpu.specs.socket)
        )
      }
      return pool

    default:
      return pool
  }
}

/**
 * Smart component selection with lookahead and randomization
 */
const selectComponentSmartly = (components, idealBudget, remainingBudget, type, step, totalSteps) => {
  if (!components.length) return null

  // Calculate how much budget we need to reserve for remaining components
  const stepsRemaining = totalSteps - step
  const reservePercentage = stepsRemaining * 0.06 // Reserve ~6% per remaining component
  const reservedBudget = remainingBudget * reservePercentage
  const availableBudget = remainingBudget - reservedBudget

  // Sort by price
  const sorted = [...components].sort((a, b) => toNumber(a.price) - toNumber(b.price))

  // Find components within available budget
  const affordable = sorted.filter(c => toNumber(c.price) <= availableBudget)

  if (affordable.length === 0) {
    // If nothing is affordable, return cheapest option
    return sorted[0]
  }

  // Try to get best value close to ideal budget
  const targetPrice = Math.min(idealBudget, availableBudget)

  // Find component with best performance/price ratio near target
  const scoredComponents = affordable.map(component => ({
    component,
    score: calculateComponentScore(component, type),
    price: toNumber(component.price),
    distanceFromTarget: Math.abs(toNumber(component.price) - targetPrice)
  }))

  // Sort by score (descending) and then by distance from target (ascending)
  scoredComponents.sort((a, b) => {
    const scoreDiff = b.score - a.score
    if (Math.abs(scoreDiff) > 0.1) return scoreDiff
    return a.distanceFromTarget - b.distanceFromTarget
  })

  // RANDOMIZATION: Instead of always picking the top component,
  // select from the top 3-5 best options to add variety
  const topCandidatesCount = Math.min(5, scoredComponents.length)
  const topCandidates = scoredComponents.slice(0, topCandidatesCount)

  // Weight selection towards better components (top has higher chance)
  const weights = topCandidates.map((_, index) =>
    Math.pow(2, topCandidatesCount - index) // Exponential weighting
  )
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)

  // Randomly select based on weights
  let random = Math.random() * totalWeight
  for (let i = 0; i < topCandidates.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return topCandidates[i].component
    }
  }

  return scoredComponents[0]?.component || sorted[0]
}

/**
 * Generate minimum viable build as last resort
 */
const generateMinimumViableBuild = async (componentsGrouped, budget) => {
  try {
    const build = {}
    const buildAlternatives = {}
    let totalPrice = 0

    // Select cheapest compatible components (with slight randomization)
    const categories = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'case', 'psu', 'cooler']

    for (const type of categories) {
      const pool = getCompatiblePool(componentsGrouped, type, build)

      if (!pool.length) {
        return { success: false, error: `No compatible ${type} available` }
      }

      // Get cheapest options (select from top 3 cheapest for variety)
      const sorted = [...pool].sort((a, b) => toNumber(a.price) - toNumber(b.price))
      const topCheapest = sorted.slice(0, Math.min(3, sorted.length))
      const randomIndex = Math.floor(Math.random() * topCheapest.length)
      const selected = topCheapest[randomIndex]

      build[type] = selected
      buildAlternatives[type] = getAlternativeComponents(pool, selected.id)
      totalPrice += toNumber(selected.price)

      if (totalPrice > budget) {
        return { success: false, error: 'Minimum build exceeds budget' }
      }
    }

    const compatibilityReport = checkCompatibility(build)

    return {
      success: true,
      build,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      budget,
      compatibilityReport,
      alternatives: buildAlternatives,
      minimumRequiredBudget: totalPrice,
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}


/**
 * Check compatibility of all components in a build
 * FR4: Compatibility validation
 * @param {Object} build - Build object with all components
 * @returns {Object} Compatibility report
 */
export const checkCompatibility = (build) => {
  const issues = [];
  const warnings = [];

  // Check CPU and Motherboard socket compatibility
  if (build.cpu && build.motherboard) {
    if (build.cpu.specs.socket !== build.motherboard.specs.socket) {
      issues.push('CPU socket does not match motherboard socket');
    }
  }

  // Check RAM compatibility with motherboard
  if (build.ram && build.motherboard) {
    if (build.ram.specs.type !== build.motherboard.specs.ram_type) {
      issues.push('RAM type does not match motherboard');
    }
  }

  // Check GPU fits in case
  if (build.gpu && build.case) {
    const gpuLength = parseInt(build.gpu.specs.length) || 0;
    const maxGpuLength = parseInt(build.case.specs.max_gpu_length) || 400;
    if (gpuLength > maxGpuLength) {
      issues.push(`GPU (${gpuLength}mm) does not fit in case (max ${maxGpuLength}mm)`);
    }
  }

  // Check PSU wattage
  if (build.cpu && build.gpu && build.psu) {
    const totalTDP = (build.cpu.specs.tdp || 0) + (build.gpu.specs.tdp || 0) + 100;
    const recommendedWattage = Math.ceil(totalTDP * 1.3);
    const psuWattage = build.psu.specs.wattage || 0;

    if (psuWattage < totalTDP) {
      issues.push(`PSU wattage (${psuWattage}W) is insufficient for system TDP (${totalTDP}W)`);
    } else if (psuWattage < recommendedWattage) {
      warnings.push(`PSU wattage (${psuWattage}W) is lower than recommended (${recommendedWattage}W)`);
    }
  }

  // Check cooler compatibility
  if (build.cooler && build.cpu) {
    const socketSupport = build.cooler.specs.socket_support || [];
    if (!socketSupport.includes(build.cpu.specs.socket)) {
      issues.push('Cooler does not support CPU socket');
    }

    // Check TDP rating
    const coolerTDP = build.cooler.specs.tdp_rating || 0;
    const cpuTDP = build.cpu.specs.tdp || 0;
    if (coolerTDP < cpuTDP) {
      warnings.push(`Cooler TDP rating (${coolerTDP}W) is lower than CPU TDP (${cpuTDP}W)`);
    }
  }

  return {
    compatible: issues.length === 0,
    issues,
    warnings,
    totalTDP: (build.cpu?.specs.tdp || 0) + (build.gpu?.specs.tdp || 0) + 100,
    recommendedPSU: Math.ceil(((build.cpu?.specs.tdp || 0) + (build.gpu?.specs.tdp || 0) + 100) * 1.3),
  };
};

/**
 * Save a build to the database
 * FR10: Save builds
 * @param {string} userId - User ID
 * @param {string} buildName - Name for the build
 * @param {Object} build - Build object
 * @param {number} totalPrice - Total price
 * @param {number} budget - Original budget
 * @param {Object} compatibilityReport - Compatibility report
 * @returns {Promise} Saved build data
 */
export const saveBuild = async (userId, buildName, build, totalPrice, budget, compatibilityReport) => {
  try {
    const { data, error } = await supabase
      .from('builds')
      .insert({
        user_id: userId,
        build_name: buildName,
        components: build,
        total_price: totalPrice,
        budget,
        compatibility_report: compatibilityReport,
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: userId,
      action: 'build_saved',
      details: { build_name: buildName, total_price: totalPrice },
    });

    return { success: true, data };
  } catch (error) {
    console.error('Save build error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all builds for a user
 * FR9: View saved builds
 * @param {string} userId - User ID
 * @returns {Promise} Array of builds
 */
export const getUserBuilds = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('builds')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get builds error:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Delete a build
 * FR11: Delete builds
 * @param {string} buildId - Build ID
 * @param {string} userId - User ID
 * @returns {Promise} Success or error
 */
export const deleteBuild = async (buildId, userId) => {
  try {
    const { error } = await supabase
      .from('builds')
      .delete()
      .eq('id', buildId)
      .eq('user_id', userId);

    if (error) throw error;

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: userId,
      action: 'build_deleted',
      details: { build_id: buildId },
    });

    return { success: true };
  } catch (error) {
    console.error('Delete build error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a build
 * @param {string} buildId - Build ID
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Updated build data
 */
export const updateBuild = async (buildId, userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('builds')
      .update(updates)
      .eq('id', buildId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Update build error:', error);
    return { success: false, error: error.message };
  }
};
