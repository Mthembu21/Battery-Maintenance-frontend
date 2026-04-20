import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@epiroc.local');
  const [password, setPassword] = useState('Admin123!');
  const [employeeId, setEmployeeId] = useState('');
  const [code, setCode] = useState('');
  const [role, setRole] = useState('manager');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-epiroc-light flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-epiroc-dark text-white p-6 shadow-card">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-epiroc-yellow text-epiroc-dark flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 7l-1.5-1.5L13 10l-2-2L5 14l1.5 1.5L11 11l2 2 5-6z"/>
                <path d="M12 2v6m0 4v6m0 4v2"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-semibold">Battery Maintenance Tracking</div>
              <div className="text-sm text-slate-300">Epiroc Parts & Service</div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-epiroc-yellow font-semibold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              Proof-of-service compliance
            </div>
            <div className="mt-2 text-sm text-slate-200">
              Weekly maintenance per battery with mandatory PDF evidence.
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-300">
            Tip: Use the seeded supervisor account shown on the right.
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-card border border-black/5">
          <div className="text-lg font-semibold text-epiroc-dark">Login</div>
          <div className="text-sm text-slate-500">Enter your credentials to continue.</div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError('');
              try {
                await login(email, password, role, employeeId, code);
                navigate('/');
              } catch (err) {
                setError(err?.response?.data?.message ?? 'Login failed');
              } finally {
                setBusy(false);
              }
            }}
          >
            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-epiroc-yellow"
              >
                <option value="manager">Manager</option>
                <option value="technician">Technician</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            {role === 'technician' && (
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
            )}

            {role === 'technician' && (
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
            )}

            {role === 'supervisor' && (
              <div>
                <label className="text-sm font-medium text-slate-700">Supervisor Code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-epiroc-yellow"
                  type="text"
                  placeholder="SUP001"
                  required
                />
              </div>
            )}

            {role === 'manager' && (
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
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-epiroc-yellow"
                type="password"
                placeholder={role === 'supervisor' ? 'Supervisor123!' : 'Admin123!'}
                required
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
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="text-xs text-slate-500">
              Seeded supervisor: <span className="font-mono">SUP001</span> / <span className="font-mono">Supervisor123!</span>
            </div>

            <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
              Technician?{' '}
              <a href="/signup" className="text-epiroc-dark font-semibold hover:underline">
                Create an account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
