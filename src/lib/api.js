import axios from 'axios';

export function createApiClient() {
  const api = axios.create({
    baseURL: '/api'
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
