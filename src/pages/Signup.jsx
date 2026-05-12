import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-epiroc-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-6 shadow-card border border-black/5">
          <div className="text-lg font-semibold text-epiroc-dark">Technician Sign Up v2.0</div>
          <div className="text-sm text-slate-500">Create your technician account - Latest Version</div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError('');
              try {
                // Client-side validation before sending to backend
                if (!email || !email.trim()) {
                  throw new Error('Email is required');
                }
                if (!password || password.length < 6) {
                  throw new Error('Password must be at least 6 characters');
                }
                if (!technicianName || !technicianName.trim()) {
                  throw new Error('Technician name is required');
                }
                if (!employeeId || !employeeId.trim()) {
                  throw new Error('Employee ID is required');
                }
                
                console.log('Attempting technician signup...');
                console.log('Signup data:', { email, password: '***', technicianName, employeeId });
                
                // Smart signup - works in both local and production
                try {
                  console.log('Starting smart signup...');
                  
                  // Create a simple technician account
                  const signupData = {
                    email: email.toLowerCase().trim(),
                    password: password,
                    technicianName: technicianName.trim(),
                    employeeId: employeeId.trim(),
                    role: 'Technician'
                  };
                  
                  console.log('Sending signup data:', { ...signupData, password: '***' });
                  
                  // Determine endpoint based on environment
                  const isLocal = window.location.hostname === 'localhost';
                  const endpoint = isLocal 
                    ? 'http://localhost:4000/api/auth/signup'
                    : 'https://battery-maintenance-backend.onrender.com/api/simple-signup';
                  
                  console.log(`Using ${isLocal ? 'local' : 'production'} endpoint: ${endpoint}`);
                  
                  // Prepare request with proper headers for SSL handling
                  const requestConfig = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'User-Agent': 'BatteryMaintenance/1.0'
                    },
                    body: JSON.stringify(signupData)
                  };
                  
                  // Add SSL-specific handling for production
                  if (!isLocal) {
                    requestConfig.mode = 'cors';
                    requestConfig.credentials = 'omit';
                  }
                  
                  const response = await fetch(endpoint, requestConfig);
                  console.log(`Response from ${isLocal ? 'local' : 'production'} server:`, response.status);
                  
                  if (response.ok) {
                    const result = await response.json();
                    console.log(`${isLocal ? 'Local' : 'Production'} signup successful:`, result);
                    
                    // Store auth data
                    localStorage.setItem('auth_token', result.token);
                    localStorage.setItem('auth_user', JSON.stringify(result.user));
                    
                    alert(`✅ Technician account created successfully! Redirecting to maintenance...`);
                    navigate('/maintenance/new');
                  } else {
                    const errorText = await response.text();
                    console.error(`${isLocal ? 'Local' : 'Production'} server error:`, errorText);
                    
                    let errorMessage;
                    try {
                      const errorData = JSON.parse(errorText);
                      errorMessage = errorData.message || `Signup failed: ${response.status}`;
                    } catch {
                      errorMessage = `Signup failed: ${response.status}`;
                    }
                    
                    // Specific error handling for local server
                    if (isLocal && (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED'))) {
                      errorMessage = 'Local server is not running. Please start the local server first: node local-server.js';
                    }
                    
                    throw new Error(errorMessage);
                  }
                } catch (error) {
                  console.error('Smart signup failed:', error);
                  throw error;
                }
              } catch (err) {
                console.error('SIGNUP ERROR:', err);
                const errorMessage = err?.response?.data?.message || 'Signup failed';
                const errorDetails = err?.response?.data?.errors || [];
                const errorField = err?.response?.data?.field || '';
                
                if (errorDetails.length > 0) {
                  setError(`${errorMessage}: ${errorDetails.join(', ')}`);
                } else if (errorField) {
                  setError(`${errorMessage} (${errorField})`);
                } else {
                  setError(errorMessage);
                }
              } finally {
                setBusy(false);
              }
            }}
          >
            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-epiroc-yellow"
                type="text"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Employee ID</label>
              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-epiroc-yellow"
                type="text"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-epiroc-yellow"
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-epiroc-yellow"
                type="password"
                required
                minLength="6"
              />
            </div>

            {error ? (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-epiroc-yellow text-epiroc-dark font-semibold px-4 py-2 hover:brightness-95 disabled:opacity-60"
            >
              {busy ? 'Creating account…' : 'Sign Up'}
            </button>

            <div className="text-xs text-slate-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-epiroc-dark font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
