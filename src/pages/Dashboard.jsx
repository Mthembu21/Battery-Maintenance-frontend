import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

// Icon components
const Battery = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
    <line x1="23" y1="11" x2="23" y2="13"/>
    <line x1="1" y1="11" x2="23" y2="11"/>
  </svg>
);

const AlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const CalendarCheck2 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="m9 16 2 2 4-4"/>
  </svg>
);

const Percent = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

function Card({ title, value, icon: Icon, tone = 'default' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-red-200 bg-red-50'
      : tone === 'good'
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-slate-200 bg-white';

  return (
    <div className={["rounded-xl border p-4 shadow-card", toneClass].join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-epiroc-dark">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-epiroc-yellow/30 text-epiroc-dark flex items-center justify-center">
          <Icon />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get('/dashboard/overview');
        if (alive) setData(res);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message ?? 'Failed to load');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cards = useMemo(() => {
    if (!data) return [];
    return [
      { title: 'Total Batteries', value: data.totalBatteries, icon: Battery },
      { title: 'Serviced This Week', value: data.batteriesServicedThisWeek, icon: CalendarCheck2, tone: 'good' },
      { title: 'Missed Services', value: data.missedServices, icon: AlertTriangle, tone: 'warn' },
      { title: 'Monthly Compliance %', value: `${data.monthlyCompliancePct}%`, icon: Percent },
      { title: 'Year-to-Date Compliance %', value: `${data.ytdCompliancePct}%`, icon: Percent }
    ];
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.title} {...c} />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-card p-4">
        <div className="font-semibold text-epiroc-dark">Operational overview</div>
        <div className="mt-1 text-sm text-slate-500">
          Use modules to register batteries, submit weekly maintenance with a PDF, and generate compliance reports.
        </div>

        {error ? (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </div>
        ) : null}

        {!data ? <div className="mt-4 text-sm text-slate-500">Loading metrics…</div> : null}
      </div>
    </div>
  );
}
