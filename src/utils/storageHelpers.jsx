/**
 * @fileoverview localStorage helper functions for saving/loading configurations and deployment history
 * Handles all persistence operations with error handling and fallbacks
 */

const STORAGE_KEYS = {
  SELECTED_PROJECT: 'deployment_selected_project',
  CONFIGURATIONS: 'deployment_configurations',
  DEPLOYMENTS: 'deployment_history',
  METRICS: 'deployment_metrics',
  ALERTS: 'deployment_alerts'
};

const MAX_DEPLOYMENTS = 50; // Keep last 50 deployments per project

/**
 * Safely parse JSON with fallback
 * @param {string} json - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback
 */
const safeParse = (json, fallback) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.warn('Failed to parse JSON from localStorage:', e);
    return fallback;
  }
};

/**
 * Safely stringify with error handling
 * @param {*} data - Data to stringify
 * @returns {string|null} JSON string or null if failed
 */
const safeStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error('Failed to stringify data:', e);
    return null;
  }
};

/**
 * Check if localStorage is available and has space
 * @returns {boolean} True if localStorage is available
 */
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    return false;
  }
};

/**
 * Save selected project ID
 * @param {number} projectId - Project ID to save
 * @returns {boolean} Success status
 */
export const saveSelectedProject = (projectId) => {
  if (!isStorageAvailable()) return false;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PROJECT, projectId.toString());
    return true;
  } catch (e) {
    console.error('Failed to save selected project:', e);
    return false;
  }
};

/**
 * Load selected project ID
 * @returns {number|null} Project ID or null
 */
export const loadSelectedProject = () => {
  if (!isStorageAvailable()) return null;
  
  try {
    const projectId = localStorage.getItem(STORAGE_KEYS.SELECTED_PROJECT);
    return projectId ? parseInt(projectId, 10) : null;
  } catch (e) {
    console.error('Failed to load selected project:', e);
    return null;
  }
};

/**
 * Save configurations for a specific project
 * @param {number} projectId - Project ID
 * @param {Object} configurations - Configuration object
 * @returns {boolean} Success status
 */
export const saveConfigurations = (projectId, configurations) => {
  if (!isStorageAvailable()) return false;
  
  try {
    const key = `${STORAGE_KEYS.CONFIGURATIONS}_${projectId}`;
    const json = safeStringify(configurations);
    if (!json) return false;
    
    localStorage.setItem(key, json);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Clearing old data...');
      // Try to clear old deployments and retry
      clearOldDeployments(projectId);
      try {
        const json = safeStringify(configurations);
        if (!json) return false;
        localStorage.setItem(`${STORAGE_KEYS.CONFIGURATIONS}_${projectId}`, json);
        return true;
      } catch (retryError) {
        console.error('Failed to save configurations after cleanup:', retryError);
        return false;
      }
    }
    console.error('Failed to save configurations:', e);
    return false;
  }
};

/**
 * Load configurations for a specific project
 * @param {number} projectId - Project ID
 * @returns {Object|null} Configuration object or null
 */
export const loadConfigurations = (projectId) => {
  if (!isStorageAvailable()) return null;
  
  try {
    const key = `${STORAGE_KEYS.CONFIGURATIONS}_${projectId}`;
    const json = localStorage.getItem(key);
    return json ? safeParse(json, null) : null;
  } catch (e) {
    console.error('Failed to load configurations:', e);
    return null;
  }
};

/**
 * Save deployment history for a specific project
 * @param {number} projectId - Project ID
 * @param {Array} deployments - Array of deployment objects
 * @returns {boolean} Success status
 */
export const saveDeployments = (projectId, deployments) => {
  if (!isStorageAvailable()) return false;
  
  try {
    const key = `${STORAGE_KEYS.DEPLOYMENTS}_${projectId}`;
    
    // Keep only last MAX_DEPLOYMENTS
    const limitedDeployments = deployments.slice(0, MAX_DEPLOYMENTS);
    
    const json = safeStringify(limitedDeployments);
    if (!json) return false;
    
    localStorage.setItem(key, json);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Reducing deployment history...');
      // Keep only last 20 deployments and retry
      const reducedDeployments = deployments.slice(0, 20);
      try {
        const json = safeStringify(reducedDeployments);
        if (!json) return false;
        localStorage.setItem(`${STORAGE_KEYS.DEPLOYMENTS}_${projectId}`, json);
        return true;
      } catch (retryError) {
        console.error('Failed to save deployments after reduction:', retryError);
        return false;
      }
    }
    console.error('Failed to save deployments:', e);
    return false;
  }
};

/**
 * Load deployment history for a specific project
 * @param {number} projectId - Project ID
 * @returns {Array} Array of deployment objects
 */
export const loadDeployments = (projectId) => {
  if (!isStorageAvailable()) return [];
  
  try {
    const key = `${STORAGE_KEYS.DEPLOYMENTS}_${projectId}`;
    const json = localStorage.getItem(key);
    const deployments = json ? safeParse(json, []) : [];
    
    // Convert timestamp strings back to Date objects
    return deployments.map(d => ({
      ...d,
      timestamp: new Date(d.timestamp)
    }));
  } catch (e) {
    console.error('Failed to load deployments:', e);
    return [];
  }
};

/**
 * Add a new deployment to history
 * @param {number} projectId - Project ID
 * @param {Object} deployment - Deployment object
 * @returns {boolean} Success status
 */
export const addDeployment = (projectId, deployment) => {
  const deployments = loadDeployments(projectId);
  deployments.unshift(deployment); // Add to beginning
  return saveDeployments(projectId, deployments);
};

/**
 * Save metrics for a specific project
 * @param {number} projectId - Project ID
 * @param {Object} metrics - Metrics object
 * @returns {boolean} Success status
 */
export const saveMetrics = (projectId, metrics) => {
  if (!isStorageAvailable()) return false;
  
  try {
    const key = `${STORAGE_KEYS.METRICS}_${projectId}`;
    const json = safeStringify(metrics);
    if (!json) return false;
    
    localStorage.setItem(key, json);
    return true;
  } catch (e) {
    console.error('Failed to save metrics:', e);
    return false;
  }
};

/**
 * Load metrics for a specific project
 * @param {number} projectId - Project ID
 * @returns {Object|null} Metrics object or null
 */
export const loadMetrics = (projectId) => {
  if (!isStorageAvailable()) return null;
  
  try {
    const key = `${STORAGE_KEYS.METRICS}_${projectId}`;
    const json = localStorage.getItem(key);
    const metrics = json ? safeParse(json, null) : null;
    
    if (metrics && metrics.timestamp) {
      metrics.timestamp = new Date(metrics.timestamp);
      if (metrics.history && metrics.history.timestamps) {
        metrics.history.timestamps = metrics.history.timestamps.map(t => new Date(t));
      }
    }
    
    return metrics;
  } catch (e) {
    console.error('Failed to load metrics:', e);
    return null;
  }
};

/**
 * Save alerts for a specific project
 * @param {number} projectId - Project ID
 * @param {Array} alerts - Array of alert objects
 * @returns {boolean} Success status
 */
export const saveAlerts = (projectId, alerts) => {
  if (!isStorageAvailable()) return false;
  
  try {
    const key = `${STORAGE_KEYS.ALERTS}_${projectId}`;
    const json = safeStringify(alerts);
    if (!json) return false;
    
    localStorage.setItem(key, json);
    return true;
  } catch (e) {
    console.error('Failed to save alerts:', e);
    return false;
  }
};

/**
 * Load alerts for a specific project
 * @param {number} projectId - Project ID
 * @returns {Array} Array of alert objects
 */
export const loadAlerts = (projectId) => {
  if (!isStorageAvailable()) return [];
  
  try {
    const key = `${STORAGE_KEYS.ALERTS}_${projectId}`;
    const json = localStorage.getItem(key);
    const alerts = json ? safeParse(json, []) : [];
    
    // Convert timestamp strings back to Date objects
    return alerts.map(a => ({
      ...a,
      timestamp: new Date(a.timestamp)
    }));
  } catch (e) {
    console.error('Failed to load alerts:', e);
    return [];
  }
};

/**
 * Clear old deployments to free up space
 * @param {number} projectId - Project ID
 */
const clearOldDeployments = (projectId) => {
  const deployments = loadDeployments(projectId);
  const reducedDeployments = deployments.slice(0, 20);
  saveDeployments(projectId, reducedDeployments);
};

/**
 * Clear all data for a specific project
 * @param {number} projectId - Project ID
 * @returns {boolean} Success status
 */
export const clearProjectData = (projectId) => {
  if (!isStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(`${STORAGE_KEYS.CONFIGURATIONS}_${projectId}`);
    localStorage.removeItem(`${STORAGE_KEYS.DEPLOYMENTS}_${projectId}`);
    localStorage.removeItem(`${STORAGE_KEYS.METRICS}_${projectId}`);
    localStorage.removeItem(`${STORAGE_KEYS.ALERTS}_${projectId}`);
    return true;
  } catch (e) {
    console.error('Failed to clear project data:', e);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Object} Storage usage info
 */
export const getStorageInfo = () => {
  if (!isStorageAvailable()) {
    return { available: false, used: 0, total: 0 };
  }
  
  try {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // Most browsers have 5-10MB limit
    const total = 5 * 1024 * 1024; // 5MB estimate
    
    return {
      available: true,
      used,
      total,
      percentage: (used / total) * 100
    };
  } catch (e) {
    console.error('Failed to get storage info:', e);
    return { available: false, used: 0, total: 0 };
  }
};
