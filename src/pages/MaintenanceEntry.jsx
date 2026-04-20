import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';

// Icon component
const Upload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const LogOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function MaintenanceEntry() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [batteries, setBatteries] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    technicianName: user?.technicianName || '',
    customerSite: '',
    assetId: '',
    assetType: '',
    serialNumber: '',
    maintenanceDate: new Date().toISOString().slice(0, 10),
    maintenanceType: 'Weekly',
    notes: ''
  });

  // Update form when user data becomes available
  useEffect(() => {
    if (user?.technicianName && !form.technicianName) {
      setForm(prev => ({ ...prev, technicianName: user.technicianName }));
    }
  }, [user]);

  useEffect(() => {
    // Auto-populate form when asset is selected
    if (selectedAsset) {
      setForm((f) => ({
        ...f,
        technicianName: f.technicianName || user?.technicianName || '',
        assetType: selectedAsset.assetType,
        customerSite: f.customerSite || selectedAsset.customerSite,
        serialNumber: f.serialNumber || selectedAsset.serialNumber,
        maintenanceDate: f.maintenanceDate || new Date().toISOString().slice(0, 10),
        maintenanceType: f.maintenanceType || 'Weekly',
        notes: f.notes || ''
      }));
    }
  }, [selectedAsset]);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/batteries');
        setBatteries(res);
      } catch {
        setBatteries([]);
      }
    })();
  }, []);

  const selectedAsset = useMemo(() => {
    return batteries.find((b) => b.assetId === form.assetId);
  }, [form.assetId, batteries]);

  useEffect(() => {
    if (selectedAsset) {
      setForm((f) => ({
        ...f,
        technicianName: f.technicianName || user?.technicianName || '',
        assetType: selectedAsset.assetType,
        customerSite: f.customerSite || selectedAsset.customerSite,
        serialNumber: f.serialNumber || selectedAsset.serialNumber,
        maintenanceDate: f.maintenanceDate || new Date().toISOString().slice(0, 10),
        maintenanceType: f.maintenanceType || 'Weekly',
        notes: f.notes || ''
      }));
    }
  }, [selectedAsset]);

  useEffect(() => {
    // Auto-populate technician name when user is available
    if (user?.technicianName && !form.technicianName) {
      setForm((f) => ({ ...f, technicianName: user.technicianName }));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-epiroc-light p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Technician Header */}
        <div className="rounded-xl bg-epiroc-dark text-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-epiroc-yellow text-epiroc-dark flex items-center justify-center font-black">
                EB
              </div>
              <div>
                <div className="text-xl font-semibold">Technician Portal</div>
                <div className="text-sm text-slate-300">Battery Maintenance Entry</div>
                {user?.technicianName && (
                  <div className="text-xs text-slate-400 mt-1">{user.technicianName} · {user.employeeId}</div>
                )}
              </div>
            </div>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              type="button"
            >
              <LogOut />
              Logout
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
          <div className="font-semibold text-epiroc-dark">Submit maintenance record</div>
          <div className="text-sm text-slate-500">One record + one PDF per battery per week.</div>
        </div>

        <form
          className="rounded-xl bg-white border border-slate-200 shadow-card p-4 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            setSuccess('');
            try {
              console.log('=== FORM SUBMISSION DEBUG ===');
              console.log('FORM STATE:', JSON.stringify(form, null, 2));
              console.log('PDF FILE:', pdf ? pdf.name : 'No PDF');
              
              // Validate form before submission
              if (!form.technicianName?.trim()) throw new Error('Technician name is required');
              if (!form.customerSite?.trim()) throw new Error('Customer/Site is required');
              if (!form.assetId?.trim()) throw new Error('Asset selection is required');
              if (!form.assetType?.trim()) throw new Error('Asset type is required');
              if (!form.serialNumber?.trim()) throw new Error('Serial number is required');
              if (!form.maintenanceDate) throw new Error('Maintenance date is required');
              if (!form.maintenanceType?.trim()) throw new Error('Maintenance type is required');
              
              if (!pdf) throw new Error('PDF is required');
              
              const fd = new FormData();
              Object.entries(form).forEach(([k, v]) => {
                if (v !== undefined && v !== null) {
                  fd.append(k, v);
                }
              });
              fd.append('pdf', pdf);
              
              console.log('FORM DATA ENTRIES:');
              for (let [key, value] of fd.entries()) {
                console.log(`${key}:`, value);
              }
              
              await api.post('/maintenance', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
              setSuccess('Maintenance record submitted successfully');
            } catch (err) {
              console.error('FORM SUBMISSION ERROR:', err);
              const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to submit';
              setError(errorMessage);
            } finally {
              setBusy(false);
            } 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Technician Name</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50"
                value={form.technicianName}
                onChange={(e) => setForm((f) => ({ ...f, technicianName: e.target.value }))}
                required
                readOnly={!!user?.technicianName}
                placeholder={user?.technicianName || 'Auto-populated from profile'}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Customer/Site</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50"
                value={form.customerSite}
                onChange={(e) => setForm((f) => ({ ...f, customerSite: e.target.value }))}
                required
                placeholder="e.g., Customer Name/Site Name"
                readOnly={!!selectedAsset}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Asset</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.assetId}
                onChange={(e) => setForm((f) => ({ ...f, assetId: e.target.value }))}
                required
              >
                <option value="">Select asset…</option>
                {batteries.map((b) => (
                  <option key={b._id} value={b.assetId}>
                    {b.customer}/{b.site} · {b.assetType} · {b.serialNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Maintenance Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.maintenanceDate}
                onChange={(e) => setForm((f) => ({ ...f, maintenanceDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Maintenance Type</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.maintenanceType}
                onChange={(e) => setForm((f) => ({ ...f, maintenanceType: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Asset Type</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.assetType}
                onChange={(e) => setForm((f) => ({ ...f, assetType: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Serial Number</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={form.serialNumber}
                onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Notes</label>
            <textarea
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Maintenance Report PDF</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
                required
              />
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Upload />
                PDF only
              </div>
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

          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-epiroc-yellow text-epiroc-dark font-semibold px-4 py-2 hover:brightness-95 disabled:opacity-60"
          >
            {busy ? 'Submitting…' : 'Submit maintenance'}
          </button>
        </form>
      </div>
    </div>
  );
}
