import { ENV_CONFIG, validateConfig } from './environment';

// Validation de la configuration au démarrage
try {
  validateConfig();
} catch (error) {
  console.error('API Configuration error:', error);
}

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_URL,
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
};

// Headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Configuration pour les requêtes avec authentification
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}; 