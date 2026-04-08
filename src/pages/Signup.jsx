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
          <div className="text-lg font-semibold text-epiroc-dark">Technician Sign Up</div>
          <div className="text-sm text-slate-500">Create your technician account</div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError('');
              try {
                await signup(email, password, technicianName, employeeId);
                navigate('/maintenance/new');
              } catch (err) {
                setError(err?.response?.data?.message ?? 'Signup failed');
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
