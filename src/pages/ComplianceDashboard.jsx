import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

export default function ComplianceDashboard() {
  const [monthly, setMonthly] = useState(null);
  const [tech, setTech] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [m, t] = await Promise.all([
          api.get('/reports/monthly-compliance'),
          api.get('/reports/technician-activity')
        ]);
        setMonthly(m);
        setTech(t);
      } catch {
        setMonthly(null);
        setTech([]);
      }
    })();
  }, []);

  const chartData = useMemo(() => {
    return tech.slice(0, 10).map((r) => ({
      name: r.technicianName,
      records: r.maintenanceRecordsSubmitted
    }));
  }, [tech]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
        <div className="font-semibold text-epiroc-dark">Compliance analytics</div>
        <div className="text-sm text-slate-500">
          This page will expand with site/customer/category breakdowns. Current view uses available reporting endpoints.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
          <div className="text-sm text-slate-500">Monthly compliance</div>
          <div className="mt-1 text-2xl font-semibold text-epiroc-dark">
            {monthly ? `${monthly.compliancePct}%` : '—'}
          </div>
          {monthly ? (
            <div className="mt-3 text-sm text-slate-600">
              Expected: {monthly.expectedServices} · Completed: {monthly.completedServices} · Missed: {monthly.missedServices}
            </div>
          ) : (
            <div className="mt-3 text-sm text-slate-500">No data yet.</div>
          )}
        </div>

        <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4 lg:col-span-2">
          <div className="text-sm text-slate-500">Technician activity (top 10)</div>
          <div className="mt-3 space-y-2">
            {chartData.length > 0 ? (
              chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-sm text-slate-600 w-24 truncate">{item.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-epiroc-yellow h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.min((item.records / Math.max(...chartData.map(d => d.records))) * 100, 100)}%` }}
                    >
                      <span className="text-xs text-epiroc-dark font-medium">{item.records}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No technician data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
