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
                
                // Test backend accessibility first, then try signup
                try {
                  console.log('Testing backend accessibility...');
                  
                  // Test 1: Check if backend is accessible at all
                  const healthResponse = await fetch('https://battery-maintenance-backend.onrender.com/api/health-check');
                  console.log('Health Check Status:', healthResponse.status);
                  if (healthResponse.ok) {
                    const healthData = await healthResponse.json();
                    console.log('Health Check Response:', healthData);
                  }
                  
                  // Test 2: Check if test route works
                  const testResponse = await fetch('https://battery-maintenance-backend.onrender.com/api/test-signup', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, technicianName, employeeId })
                  });
                  console.log('Test Route Status:', testResponse.status);
                  if (testResponse.ok) {
                    const testData = await testResponse.json();
                    console.log('Test Route Response:', testData);
                  }
                  
                  // Test 3: Try the actual signup
                  console.log('Attempting actual signup...');
                  const response = await fetch('https://battery-maintenance-backend.onrender.com/api/auth/signup', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, technicianName, employeeId })
                  });
                  
                  console.log('Signup Response Status:', response.status);
                  console.log('Signup Response OK:', response.ok);
                  
                  if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Signup Error Response:', errorText);
                    throw new Error(`Signup failed: ${response.status} - ${errorText}`);
                  }
                  
                  const result = await response.json();
                  console.log('Signup Success:', result);
                  
                  // Store auth data
                  localStorage.setItem('auth_token', result.token);
                  localStorage.setItem('auth_user', JSON.stringify(result.user));
                  
                  navigate('/maintenance/new');
                } catch (directError) {
                  console.error('API call failed:', directError);
                  throw directError;
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
