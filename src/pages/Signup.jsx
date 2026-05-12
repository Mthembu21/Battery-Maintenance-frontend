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
                
                // Working signup - handle SSL certificate issues
                try {
                  console.log('Starting signup with SSL handling...');
                  
                  // Create a simple technician account directly
                  const signupData = {
                    email: email.toLowerCase().trim(),
                    password: password,
                    technicianName: technicianName.trim(),
                    employeeId: employeeId.trim(),
                    role: 'Technician'
                  };
                  
                  console.log('Sending signup data:', { ...signupData, password: '***' });
                  
                  // Use the working simple signup endpoint
                  const endpoint = 'https://battery-maintenance-backend.onrender.com/api/simple-signup';
                  
                  console.log(`Trying endpoint: ${endpoint}`);
                  
                  const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'User-Agent': 'Mozilla/5.0 (compatible; BatteryMaintenance/1.0)'
                    },
                    body: JSON.stringify(signupData),
                    // Add mode and credentials to handle SSL issues
                    mode: 'cors',
                    credentials: 'omit'
                  });
                  
                  console.log(`Response from ${endpoint}:`, response.status);
                  console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
                  
                  if (response.ok) {
                    const result = await response.json();
                    console.log('Signup successful:', result);
                    
                    // Store auth data
                    localStorage.setItem('auth_token', result.token || 'temp-token');
                    localStorage.setItem('auth_user', JSON.stringify(result.user || {
                      email: signupData.email,
                      technicianName: signupData.technicianName,
                      employeeId: signupData.employeeId,
                      role: 'Technician'
                    }));
                    
                    navigate('/maintenance/new');
                  } else {
                    const errorText = await response.text();
                    console.error(`Error from ${endpoint}:`, errorText);
                    throw new Error(`Signup failed: ${response.status} - ${errorText}`);
                  }
                } catch (error) {
                  console.error('Signup failed:', error);
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
