import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

export default function MaintenanceHistory() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({ customerSite: '', assetId: '', serialNumber: '', technician: '' });
  const [busy, setBusy] = useState(false);

  const handleViewPdf = async (fileUrl, filename) => {
    try {
      // Extract the file path from the full URL
      // fileUrl is like: http://localhost:4000/api/files/filename.pdf
      // We need: files/filename.pdf
      const urlParts = fileUrl.split('/api/');
      const filePath = urlParts.length > 1 ? urlParts[1] : fileUrl;
      
      // Get the file with authentication
      const response = await api.get(filePath, { 
        responseType: 'blob' 
      });
      
      // Create a blob URL and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      // Clean up the blob URL when the window is closed
      if (newWindow) {
        newWindow.onload = () => {
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        };
      }
    } catch (error) {
      console.error('Error viewing PDF:', error);
      alert('Failed to load PDF. Please try again.');
    }
  };

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }, [filter]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setBusy(true);
      try {
        const res = await api.get(`/maintenance${query}`);
        if (alive) setRows(res);
      } finally {
        if (alive) setBusy(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white border border-slate-200 shadow-card p-4">
        <div className="font-semibold text-epiroc-dark">Maintenance history</div>
        <div className="text-sm text-slate-500">Filter by customer, site, battery or technician.</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Customer/Site" value={filter.customerSite} onChange={(e) => setFilter((f) => ({ ...f, customerSite: e.target.value }))} />
          <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Asset ID" value={filter.assetId} onChange={(e) => setFilter((f) => ({ ...f, assetId: e.target.value }))} />
          <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Serial Number" value={filter.serialNumber || ''} onChange={(e) => setFilter((f) => ({ ...f, serialNumber: e.target.value }))} />
          <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Technician" value={filter.technician} onChange={(e) => setFilter((f) => ({ ...f, technician: e.target.value }))} />
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 shadow-card overflow-auto">
        {busy ? <div className="p-4 text-sm text-slate-500">Loading…</div> : null}
        <table className="min-w-full text-sm">
          <thead className="text-left bg-slate-50">
            <tr>
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Customer/Site</th>
              <th className="px-3 py-2 font-semibold">Asset Info</th>
              <th className="px-3 py-2 font-semibold">Technician</th>
              <th className="px-3 py-2 font-semibold">PDF</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-3 py-2">{new Date(r.maintenanceDate).toLocaleDateString()}</td>
                <td className="px-3 py-2">{r.customerName}/{r.site}</td>
                <td className="px-3 py-2">
                  <div className="font-mono text-xs">{r.assetId}</div>
                  <div className="text-xs text-slate-500">{r.serialNumber}</div>
                </td>
                <td className="px-3 py-2">{r.technicianName}</td>
                <td className="px-3 py-2">
                  <button
                    className="text-epiroc-dark underline hover:text-epiroc-yellow"
                    onClick={() => handleViewPdf(r.pdf?.fileUrl, r.pdf?.filename)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!busy && rows.length === 0 ? <div className="p-8 text-sm text-slate-500">No maintenance records found.</div> : null}
      </div>
    </div>
  );
}
