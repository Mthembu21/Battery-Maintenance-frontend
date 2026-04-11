// Base API configuration using environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://battery-maintenance-backend.onrender.com/api';

// Helper function for making authenticated requests
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token && token !== 'undefined' && token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestOptions = {
    method: options.method || 'GET',
    headers,
    ...options
  };

  // Remove body for GET requests to avoid issues
  if (requestOptions.method === 'GET') {
    delete requestOptions.body;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API request:', { method: requestOptions.method, url });
  console.log('API Base URL:', API_BASE_URL);
  console.log('Environment Variables:', { VITE_API_URL: import.meta.env.VITE_API_URL });

  const res = await fetch(url, requestOptions);

  if (!res.ok) {
    console.error('API Error:', { 
      status: res.status, 
      url, 
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      endpoint,
      base_url: API_BASE_URL
    });
    
    if (res.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

// Authentication functions
export async function login(email, password) {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  return res;
}

export async function signup(email, password, technicianName, employeeId) {
  const res = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, technicianName, employeeId })
  });

  return res;
}

// API object for backward compatibility
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE'
  })
};
