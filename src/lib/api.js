import axios from 'axios';

export function createApiClient() {
  // Check if we're in production by looking at hostname
  const isProduction = window.location.hostname === 'battery-maintenance-frontend.onrender.com';
  
  const baseURL = isProduction 
    ? 'https://battery-maintenance-backend.onrender.com/api'
    : '/api';
  
  const api = axios.create({
    baseURL
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
}

export const api = createApiClient();
