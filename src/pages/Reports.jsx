import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

function Block({ title, children }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
      <div className="font-semibold text-epiroc-dark">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function Reports() {
  const [monthly, setMonthly] = useState(null);
  const [ytd, setYtd] = useState([]);
  const [tech, setTech] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [m, y, t] = await Promise.all([
          api.get('/reports/monthly-compliance'),
          api.get('/reports/ytd-compliance'),
          api.get('/reports/technician-activity')
        ]);
        setMonthly(m.data);
        setYtd(y.data);
        setTech(t.data);
      } catch {
        setMonthly(null);
        setYtd([]);
        setTech([]);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Block title="Monthly Compliance Report">
          {monthly ? (
            <div className="text-sm text-slate-700 space-y-1">
              <div>Total batteries: <span className="font-semibold">{monthly.totalBatteries}</span></div>
              <div>Expected services: <span className="font-semibold">{monthly.expectedServices}</span></div>
              <div>Completed services: <span className="font-semibold">{monthly.completedServices}</span></div>
              <div>Missed services: <span className="font-semibold">{monthly.missedServices}</span></div>
              <div>Compliance: <span className="font-semibold">{monthly.compliancePct}%</span></div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">No data.</div>
          )}
        </Block>

        <Block title="Technician Activity Report">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-slate-50">
                <tr>
                  <th className="px-2 py-1 font-semibold">Technician</th>
                  <th className="px-2 py-1 font-semibold">Records</th>
                  <th className="px-2 py-1 font-semibold">PDFs</th>
                </tr>
              </thead>
              <tbody>
                {tech.slice(0, 10).map((r) => (
                  <tr key={r.technicianName} className="border-t">
                    <td className="px-2 py-1">{r.technicianName}</td>
                    <td className="px-2 py-1">{r.maintenanceRecordsSubmitted}</td>
                    <td className="px-2 py-1">{r.pdfsUploaded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title="YTD Compliance Report">
          <div className="text-sm text-slate-500">Showing first 25 batteries.</div>
          <div className="overflow-auto mt-2">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-slate-50">
                <tr>
                  <th className="px-2 py-1 font-semibold">Battery ID</th>
                  <th className="px-2 py-1 font-semibold">Expected</th>
                  <th className="px-2 py-1 font-semibold">Completed</th>
                  <th className="px-2 py-1 font-semibold">Missed</th>
                  <th className="px-2 py-1 font-semibold">YTD %</th>
                </tr>
              </thead>
              <tbody>
                {ytd.slice(0, 25).map((r) => (
                  <tr key={r.batteryId} className="border-t">
                    <td className="px-2 py-1 font-mono">{r.batteryId}</td>
                    <td className="px-2 py-1">{r.expectedServices}</td>
                    <td className="px-2 py-1">{r.completedServices}</td>
                    <td className="px-2 py-1">{r.missedServices}</td>
                    <td className="px-2 py-1 font-semibold">{r.ytdCompliancePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      </div>
    </div>
  );
}
