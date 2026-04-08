import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';

const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function BatteryCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    customerSite: '',
    assetType: 'Charger',
    serialNumber: '',
    assetId: '',
    locationType: 'On Customer Site',
    workshopName: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/batteries', form);
      setSuccess('Battery created successfully!');
      setTimeout(() => navigate('/batteries'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to create battery');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-epiroc-light p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="rounded-xl bg-epiroc-dark text-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-epiroc-yellow text-epiroc-dark flex items-center justify-center">
              <Plus />
            </div>
            <div>
              <div className="text-xl font-semibold">Create New Battery</div>
              <div className="text-sm text-slate-300">Register a new battery in the system</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          className="rounded-xl bg-white border border-slate-200 shadow-card p-4 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Customer/Site *</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.customerSite}
                onChange={(e) => setForm((f) => ({ ...f, customerSite: e.target.value }))}
                required
                placeholder="Customer/Site (e.g., ABC Company/Mine Site)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Asset Type *</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.assetType}
                onChange={(e) => setForm((f) => ({ ...f, assetType: e.target.value }))}
                required
              >
                <option value="Charger">Charger</option>
                <option value="B2 Battery">B2 Battery</option>
                <option value="B4 Battery">B4 Battery</option>
                <option value="B5 Battery">B5 Battery</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Serial Number *</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono"
                value={form.serialNumber}
                onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Asset ID *</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono"
                value={form.assetId}
                onChange={(e) => setForm((f) => ({ ...f, assetId: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Location Type *</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.locationType}
                onChange={(e) => setForm((f) => ({ ...f, locationType: e.target.value }))}
                required
              >
                <option value="On Customer Site">On Customer Site</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            {form.locationType === 'Workshop' && (
              <div>
                <label className="text-sm font-medium text-slate-700">Workshop Name</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={form.workshopName}
                  onChange={(e) => setForm((f) => ({ ...f, workshopName: e.target.value }))}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Additional notes about this asset..."
              />
            </div>
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
              {success}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-epiroc-yellow text-epiroc-dark font-semibold px-4 py-2 hover:brightness-95 disabled:opacity-60"
            >
              {busy ? 'Creating...' : 'Create Battery'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/batteries')}
              className="rounded-md border border-slate-200 text-slate-700 px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
