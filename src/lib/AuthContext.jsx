import { createContext, useContext, useMemo, useState } from 'react';
import { api } from './api.js';
import { clearAuth, getStoredAuth, storeAuth } from './auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const stored = getStoredAuth();
  const [token, setToken] = useState(stored.token);
  const [user, setUser] = useState(stored.user);

  const value = useMemo(() => {
    return {
      token,
      user,
      isAuthed: Boolean(token),
      isTechnician: user?.role === 'Technician',
      isSupervisor: user?.role === 'Supervisor',
      isManager: user?.role === 'Manager',
      async login(email, password, role = 'technician', employeeId = '', code = '') {
        let res;
        
        if (role === 'technician') {
          res = await api.post('/auth/technician/login', { name: email, employee_id: employeeId, password });
        } else if (role === 'supervisor') {
          res = await api.post('/auth/supervisor/login', { code, password });
        } else {
          // Fallback to email/password login for managers
          res = await api.post('/auth/login', { email, password });
        }
        
        storeAuth({ token: res.token, user: res.user });
        setToken(res.token);
        setUser(res.user);
        return res.user;
      },
      async signup(email, password, technicianName, employeeId) {
        const res = await api.post('/auth/signup', { email, password, technicianName, employeeId });
        storeAuth({ token: res.token, user: res.user });
        setToken(res.token);
        setUser(res.user);
        return res.user;
      },
      logout() {
        clearAuth();
        setToken(null);
        setUser(null);
      }
    };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
