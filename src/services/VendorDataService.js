/**
 * Vendor Data Service
 * 
 * This service handles vendor pricing data management with caching capabilities.
 * It provides:
 * - Automatic data caching for offline functionality
 * - Periodic data synchronization (24-hour intervals)
 * - Price fluctuation simulation for realistic pricing
 * - Fallback mechanisms when APIs are unavailable
 * 
 * Functional Requirements Satisfied:
 * - FR15: Cache vendor pricing data for offline use and API downtime
 * - FR16: Automatically synchronize vendor pricing data periodically
 * 
 * Features:
 * - 24-hour cache refresh interval
 * - Dynamic price fluctuations (±10% from base price)
 * - Offline fallback data
 * - Cache status monitoring
 * - Manual refresh capabilities
 */
class VendorDataService {
  constructor() {
    this.cacheKey = 'vendorPricingCache'        // Local storage key for cached data
    this.lastSyncKey = 'lastVendorSync'         // Local storage key for last sync timestamp
    this.syncInterval = 24 * 60 * 60 * 1000     // 24 hours in milliseconds
  }

  /**
   * Get vendor data with intelligent caching
   * Satisfies FR15 & FR16: Caching and automatic synchronization
   * 
   * @param {boolean} forceRefresh - Force fetch fresh data ignoring cache
   * @returns {Object} Vendor data with current pricing
   */
  async getVendorData(forceRefresh = false) {
    const lastSync = localStorage.getItem(this.lastSyncKey)
    const now = Date.now()
    
    // Check if we need to refresh data (every 24 hours or forced)
    if (forceRefresh || !lastSync || (now - parseInt(lastSync)) > this.syncInterval) {
      console.log('Fetching fresh vendor data...')
      return await this.fetchAndCacheData()
    }
    
    // Return cached data if available and fresh
    const cachedData = localStorage.getItem(this.cacheKey)
    if (cachedData) {
      console.log('Using cached vendor data')
      return JSON.parse(cachedData)
    }
    
    // Fallback to fresh fetch if no cache exists
    return await this.fetchAndCacheData()
  }

  // Simulate fetching vendor data from APIs
  async fetchAndCacheData() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate vendor data with dynamic pricing
      const vendorData = {
        lastUpdated: new Date().toISOString(),
        apiStatus: 'online',
        components: {
          CPU: [
            { 
              id: 'cpu1', 
              name: 'Ryzen 5 5600X', 
              basePrice: 199, 
              currentPrice: this.simulatePriceFluctuation(199),
              vendor: 'Amazon',
              availability: 'In Stock',
              link: 'https://www.amazon.com/AMD-Ryzen-5600X-12-Thread-Processor/dp/B08166SLDF'
            },
            { 
              id: 'cpu2', 
              name: 'Intel i5-11400F', 
              basePrice: 189, 
              currentPrice: this.simulatePriceFluctuation(189),
              vendor: 'Newegg',
              availability: 'In Stock',
              link: 'https://www.amazon.com/Intel-i5-11400F-Desktop-Processor-Cache/dp/B08X6PPTTH'
            },
            { 
              id: 'cpu3', 
              name: 'Ryzen 7 5700X', 
              basePrice: 259, 
              currentPrice: this.simulatePriceFluctuation(259),
              vendor: 'Best Buy',
              availability: 'Limited Stock',
              link: 'https://www.amazon.com/AMD-Ryzen-5700X-16-Thread-Processor/dp/B09VCHR1VH'
            }
          ],
          GPU: [
            { 
              id: 'gpu1', 
              name: 'RTX 3060', 
              basePrice: 329, 
              currentPrice: this.simulatePriceFluctuation(329),
              vendor: 'Best Buy',
              availability: 'In Stock',
              link: 'https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3060-12gb-gddr6-pci-express-4-0-graphics-card-black/6468931.p?skuId=6468931'
            },
            { 
              id: 'gpu2', 
              name: 'AMD RX 6600', 
              basePrice: 299, 
              currentPrice: this.simulatePriceFluctuation(299),
              vendor: 'Amazon',
              availability: 'In Stock',
              link: 'https://www.amazon.com/MSI-Radeon-RX-6600-8G/dp/B098Q4M5J3'
            }
          ],
          RAM: [
            { 
              id: 'ram1', 
              name: '16GB DDR4 3200MHz', 
              basePrice: 79, 
              currentPrice: this.simulatePriceFluctuation(79),
              vendor: 'Corsair Direct',
              availability: 'In Stock',
              link: 'https://www.bestbuy.com/site/corsair-vengeance-rgb-pro-16gb-2x8gb-ddr4-3200mhz-c16-udimm-desktop-memory-black/6256216.p?skuId=6256216'
            }
          ],
          MB: [
            { 
              id: 'mb1', 
              name: 'ROG STRIX B550-F', 
              basePrice: 180, 
              currentPrice: this.simulatePriceFluctuation(180),
              vendor: 'ASUS Store',
              availability: 'In Stock',
              link: 'https://www.amazon.com/ROG-B550-F-II-Motherboard-Addressable/dp/B09GP7P1XS'
            }
          ],
          PSU: [
            { 
              id: 'psu1', 
              name: 'Focus GX-650', 
              basePrice: 110, 
              currentPrice: this.simulatePriceFluctuation(110),
              vendor: 'Seasonic',
              availability: 'In Stock',
              link: 'https://www.amazon.com/Seasonic-SSR-650FX-Modular-Warranty-Compact/dp/B073H33X7R'
            }
          ]
        }
      }

      // Cache the data
      localStorage.setItem(this.cacheKey, JSON.stringify(vendorData))
      localStorage.setItem(this.lastSyncKey, Date.now().toString())
      
      console.log('Vendor data cached successfully')
      return vendorData
      
    } catch (error) {
      console.error('Failed to fetch vendor data:', error)
      
      // Try to return cached data as fallback
      const cachedData = localStorage.getItem(this.cacheKey)
      if (cachedData) {
        console.log('Using cached data as fallback')
        return JSON.parse(cachedData)
      }
      
      // If no cache available, return basic data
      return this.getFallbackData()
    }
  }

  // Simulate price fluctuations (±10% from base price)
  simulatePriceFluctuation(basePrice) {
    const fluctuation = (Math.random() - 0.5) * 0.2 // ±10%
    return Math.round(basePrice * (1 + fluctuation))
  }

  // Get fallback data when APIs are down and no cache
  getFallbackData() {
    return {
      lastUpdated: new Date().toISOString(),
      apiStatus: 'offline',
      components: {
        CPU: [{ id: 'cpu1', name: 'Ryzen 5 5600X', basePrice: 199, currentPrice: 199, vendor: 'Offline', availability: 'Unknown' }],
        GPU: [{ id: 'gpu1', name: 'RTX 3060', basePrice: 329, currentPrice: 329, vendor: 'Offline', availability: 'Unknown' }],
        RAM: [{ id: 'ram1', name: '16GB DDR4 3200MHz', basePrice: 79, currentPrice: 79, vendor: 'Offline', availability: 'Unknown' }],
        MB: [{ id: 'mb1', name: 'ROG STRIX B550-F', basePrice: 180, currentPrice: 180, vendor: 'Offline', availability: 'Unknown' }],
        PSU: [{ id: 'psu1', name: 'Focus GX-650', basePrice: 110, currentPrice: 110, vendor: 'Offline', availability: 'Unknown' }]
      }
    }
  }

  // Check if data needs refresh
  needsRefresh() {
    const lastSync = localStorage.getItem(this.lastSyncKey)
    if (!lastSync) return true
    
    const now = Date.now()
    return (now - parseInt(lastSync)) > this.syncInterval
  }

  // Manual refresh trigger
  async refreshData() {
    return await this.getVendorData(true)
  }

  // Get cache status
  getCacheStatus() {
    const lastSync = localStorage.getItem(this.lastSyncKey)
    const cachedData = localStorage.getItem(this.cacheKey)
    
    return {
      hasCachedData: !!cachedData,
      lastSync: lastSync ? new Date(parseInt(lastSync)) : null,
      needsRefresh: this.needsRefresh(),
      cacheSize: cachedData ? new Blob([cachedData]).size : 0
    }
  }

  // Clear cache
  clearCache() {
    localStorage.removeItem(this.cacheKey)
    localStorage.removeItem(this.lastSyncKey)
  }
}

// Export singleton instance
export default new VendorDataService()