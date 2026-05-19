
// Base API configuration - detect environment
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/api'
  : 'https://battery-maintenance-backend.onrender.com/api';

console.log('=== API Configuration ===');
console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);
console.log('Environment:', window.location.hostname === 'localhost' ? 'Development' : 'Production');
console.log('🔧 Using', window.location.hostname === 'localhost' ? 'local server' : 'production server');

// Helper function for making authenticated requests
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  console.log('API Request - Token from localStorage:', token);
  console.log('API Request - Token validation:', {
    exists: !!token,
    isUndefined: token === 'undefined',
    isNull: token === null,
    isEmpty: token === ''
  });

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestOptions = {
    ...options,
    headers
  };

  // Remove body for GET requests
  if (requestOptions.method === 'GET') {
    delete requestOptions.body;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, requestOptions);

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
      
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
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
