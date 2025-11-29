/**
 * Component Service
 * Handles fetching and filtering PC components from Supabase
 */

import { supabase } from '../lib/supabase';

/**
 * Get all components of a specific type
 * @param {string} type - Component type (cpu, gpu, motherboard, etc.)
 * @returns {Promise} Array of components
 */
export const getComponentsByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('type', type)
      .order('price', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${type} components:`, error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get components within a price range
 * @param {string} type - Component type
 * @param {number} maxPrice - Maximum price
 * @param {number} minPrice - Minimum price (optional)
 * @returns {Promise} Array of components
 */
export const getComponentsByPrice = async (type, maxPrice, minPrice = 0) => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('type', type)
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .order('price', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${type} by price:`, error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all components (all types)
 * @returns {Promise} Object with components grouped by type
 */
export const getAllComponents = async () => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('type', { ascending: true })
      .order('price', { ascending: true });

    if (error) throw error;

    // Group by type
    const grouped = data.reduce((acc, component) => {
      if (!acc[component.type]) {
        acc[component.type] = [];
      }
      acc[component.type].push(component);
      return acc;
    }, {});

    return { success: true, data: grouped };
  } catch (error) {
    console.error('Error fetching all components:', error);
    return { success: false, error: error.message, data: {} };
  }
};

/**
 * Get a single component by ID
 * @param {string} id - Component ID
 * @returns {Promise} Component object
 */
export const getComponentById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching component:', error);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Get compatible components based on existing build
 * @param {string} type - Component type to fetch
 * @param {Object} currentBuild - Current build configuration
 * @returns {Promise} Array of compatible components
 */
export const getCompatibleComponents = async (type, currentBuild) => {
  try {
    let query = supabase.from('components').select('*').eq('type', type);

    // Apply compatibility filters based on type
    switch (type) {
      case 'cpu':
        // Filter by socket if motherboard is selected
        if (currentBuild.motherboard) {
          const socket = currentBuild.motherboard.specs.socket;
          query = query.contains('specs', { socket });
        }
        break;

      case 'motherboard':
        // Filter by socket if CPU is selected
        if (currentBuild.cpu) {
          const socket = currentBuild.cpu.specs.socket;
          query = query.contains('specs', { socket });
        }
        break;

      case 'ram':
        // Filter by RAM type if motherboard is selected
        if (currentBuild.motherboard) {
          const ramType = currentBuild.motherboard.specs.ram_type;
          query = query.contains('specs', { type: ramType });
        }
        break;

      case 'gpu':
        // Filter by case size if case is selected
        if (currentBuild.case) {
          const maxGpuLength = parseInt(currentBuild.case.specs.max_gpu_length);
          // Note: This requires custom logic - simplified for now
        }
        break;

      case 'cooler':
        // Filter by socket support
        if (currentBuild.cpu) {
          const socket = currentBuild.cpu.specs.socket;
          // Note: This requires array checking - simplified for now
        }
        break;

      default:
        break;
    }

    const { data, error } = await query.order('price', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching compatible ${type}:`, error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Search components by name or brand
 * @param {string} searchTerm - Search term
 * @returns {Promise} Array of matching components
 */
export const searchComponents = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
      .order('price', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error searching components:', error);
    return { success: false, error: error.message, data: [] };
  }
};
