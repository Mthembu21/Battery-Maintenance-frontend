import { createContext, useContext, useState } from 'react';
import { api } from './api.js';
import { clearAuth, getStoredAuth, storeAuth } from './auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const stored = getStoredAuth();
  console.log('AuthProvider initializing with stored auth:', { hasToken: !!stored.token, hasUser: !!stored.user, userRole: stored.user?.role });
  const [token, setToken] = useState(stored.token);
  const [user, setUser] = useState(stored.user);

  const login = async (email, password, role = 'technician', employeeId = '', code = '') => {
    let res;
    
    if (role === 'technician') {
      res = await api.post('/auth/technician/login', { name: email, employee_id: employeeId, password });
    } else if (role === 'supervisor') {
      res = await api.post('/auth/supervisor/login', { code, password });
    } else {
      res = await api.post('/auth/login', { email, password });
    }
    
    storeAuth({ token: res.token, user: res.user });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const signup = async (email, password, technicianName, employeeId) => {
    console.log('=== AUTH CONTEXT SIGNUP START ===');
    console.log('Signup data:', { email, password: '***', technicianName, employeeId });
    try {
      const res = await api.post('/auth/signup', { email, password, technicianName, employeeId });
      console.log('Signup response:', res);
      storeAuth({ token: res.token, user: res.user });
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } catch (error) {
      console.error('=== SIGNUP API ERROR ===');
      console.error('Error:', error);
      console.error('Status:', error.response?.status);
      console.error('StatusText:', error.response?.statusText);
      console.error('Data:', error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthed: Boolean(token),
    isTechnician: user?.role === 'Technician',
    isSupervisor: user?.role === 'Supervisor',
    isManager: user?.role === 'Manager',
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
