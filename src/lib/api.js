import axios from 'axios';

export function createApiClient() {
  const baseURL = import.meta.env.PROD 
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
