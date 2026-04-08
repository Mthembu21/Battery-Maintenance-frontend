import { useAuth } from '../lib/AuthContext.jsx';
import { api } from '../lib/api.js';

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
        <div className="font-semibold text-epiroc-dark">Admin Settings</div>
        <div className="text-sm text-slate-500">Supervisor-only operational actions.</div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
        <div className="text-sm text-slate-700">
          Current role: <span className="font-semibold">{user?.role ?? '—'}</span>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-epiroc-dark text-white text-sm"
            onClick={async () => {
              try {
                await api.post('/auth/seed-admin');
                alert('Seed endpoint executed.');
              } catch (e) {
                alert(e?.response?.data?.message ?? 'Failed');
              }
            }}
          >
            Seed demo supervisor (backend)
          </button>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          In production, this should be removed/locked down.
        </div>
      </div>
    </div>
  );
}
