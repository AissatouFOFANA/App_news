// Configuration des environnements
export const ENV_CONFIG = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Environment
  IS_DEV: import.meta.env.DEV || false,
  IS_PROD: import.meta.env.PROD || false,
  
  // Build info
  BUILD_TIME: import.meta.env.BUILD_TIME || new Date().toISOString(),
  
  // Feature flags
  ENABLE_DEBUG: import.meta.env.VITE_DEV_MODE === 'true' || false,
};

// Validation de la configuration
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!ENV_CONFIG.API_URL) {
    errors.push('VITE_API_URL is not defined');
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }
  
  return true;
};

// Configuration pour le développement
export const DEV_CONFIG = {
  API_URL: 'http://localhost:3000/api',
  ENABLE_LOGS: true,
  ENABLE_MOCK_DATA: false,
};

// Configuration pour la production
export const PROD_CONFIG = {
  API_URL: ENV_CONFIG.API_URL,
  ENABLE_LOGS: false,
  ENABLE_MOCK_DATA: false,
};

// Configuration active selon l'environnement
export const getActiveConfig = () => {
  return ENV_CONFIG.IS_DEV ? DEV_CONFIG : PROD_CONFIG;
}; 