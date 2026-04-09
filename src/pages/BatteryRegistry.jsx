import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';

// Icon components
const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const Filter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

function Table({ rows }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left bg-slate-50">
          <tr>
            <th className="px-3 py-2 font-semibold">Customer/Site</th>
            <th className="px-3 py-2 font-semibold">Asset Type</th>
            <th className="px-3 py-2 font-semibold">Serial Number</th>
            <th className="px-3 py-2 font-semibold">Asset ID</th>
            <th className="px-3 py-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-t">
              <td className="px-3 py-2">{r.customer && r.site ? `${r.customer} / ${r.site}` : r.customerSite || 'Unknown'}</td>
              <td className="px-3 py-2">{r.assetType}</td>
              <td className="px-3 py-2 font-mono">{r.serialNumber}</td>
              <td className="px-3 py-2 font-mono">{r.assetId}</td>
              <td className="px-3 py-2">
                <span
                  className={[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border',
                    r.status === 'Missed Service'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : r.status === 'Inactive'
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  ].join(' ')}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BatteryRegistry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canCreate = user?.role === 'Supervisor';

  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({ customerSite: '', assetType: '', assetId: '', serialNumber: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }, [filter]);

  async function load() {
    setBusy(true);
    setError('');
    try {
      const res = await api.get(`/batteries${query}`);
      setRows(res.data);
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Failed to load batteries');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="font-semibold text-epiroc-dark">Batteries</div>
            <div className="text-sm text-slate-500">Registry of batteries across customers, sites and workshops.</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-sm"
              onClick={load}
            >
              <Filter />
              Refresh
            </button>
            <button
              type="button"
              disabled={!canCreate}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-epiroc-yellow text-epiroc-dark font-semibold text-sm disabled:opacity-60"
              onClick={() => navigate('/batteries/create')}
            >
              <Plus />
              New Battery
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Customer/Site"
            value={filter.customerSite}
            onChange={(e) => setFilter((f) => ({ ...f, customerSite: e.target.value }))}
          />
          <input
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Asset Type"
            value={filter.assetType}
            onChange={(e) => setFilter((f) => ({ ...f, assetType: e.target.value }))}
          />
          <input
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Serial Number"
            value={filter.serialNumber}
            onChange={(e) => setFilter((f) => ({ ...f, serialNumber: e.target.value }))}
          />
          <input
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="Asset ID"
            value={filter.assetId}
            onChange={(e) => setFilter((f) => ({ ...f, assetId: e.target.value }))}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 shadow-card">
        {busy ? <div className="p-4 text-sm text-slate-500">Loading…</div> : <Table rows={rows} />}
        {error ? (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-t border-red-100">{error}</div>
        ) : null}
        {!busy && rows.length === 0 ? (
          <div className="p-8 text-sm text-slate-500">
            No batteries found. Adjust filters or create new battery records.
          </div>
        ) : null}
      </div>
    </div>
  );
}
