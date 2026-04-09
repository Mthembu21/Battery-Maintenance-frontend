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
    if (token && token !== 'undefined' && token !== null) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor to handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
}

export const api = createApiClient();
