import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';

export default function MaintenanceHistory() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({ customerSite: '', assetId: '', serialNumber: '', technician: '' });
  const [busy, setBusy] = useState(false);
  const auth = useAuth();
  const isSupervisor = auth.isSupervisor;
  const isManager = auth.isManager;

  const handleViewPdf = async (fileUrl, filename) => {
    try {
      console.log('=== PDF VIEWING START ===');
      console.log('PDF View - fileUrl:', fileUrl);
      console.log('PDF View - filename:', filename);
      
      // Extract the file path from the full URL
      // fileUrl is like: /api/files/filename.pdf
      // We need: files/filename.pdf
      const urlParts = fileUrl.split('/api/');
      let filePath = urlParts.length > 1 ? urlParts[1] : fileUrl.replace('/api/', '');
      
      // Ensure filePath starts with / for correct API construction
      if (!filePath.startsWith('/')) {
        filePath = '/' + filePath;
      }
      
      console.log('PDF View - filePath:', filePath);
      console.log('PDF View - Making API request with responseType: blob');
      
      // Get the file with authentication
      const response = await api.get(filePath, { 
        responseType: 'blob' 
      });
      
      console.log('PDF View - Response received:', {
        type: typeof response,
        size: response.size,
        isBlob: response instanceof Blob
      });
      
      // Create a blob URL and open in new tab
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      console.log('PDF View - Blob created:', {
        blobSize: blob.size,
        blobUrl: url.substring(0, 50) + '...'
      });
      
      const newWindow = window.open(url, '_blank');
      
      console.log('PDF View - Window opened:', !!newWindow);
      
      // Clean up the blob URL when the window is closed
      if (newWindow) {
        newWindow.onload = () => {
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        };
      }
      
      console.log('=== PDF VIEWING SUCCESS ===');
    } catch (error) {
      console.error('=== PDF VIEWING ERROR ===');
      console.error('Error viewing PDF:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      alert('Failed to load PDF. Please try again.');
    }
  };

  const handleDeleteRecord = async (recordId, assetId, technicianName) => {
    if (!window.confirm(`Are you sure you want to delete the maintenance record for ${assetId} (${technicianName})?`)) {
      return;
    }

    try {
      setBusy(true);
      console.log('Deleting maintenance record:', recordId);
      
      const response = await api.delete(`/maintenance/${recordId}`);
      
      console.log('Delete response:', response);
      
      // Remove the deleted record from the local state
      setRows(prevRows => prevRows.filter(row => row._id !== recordId));
      
      alert('Maintenance record deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      alert('Failed to delete maintenance record. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const getQuery = () => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setBusy(true);
      try {
        const query = getQuery();
        const res = await api.get(`/maintenance${query}`);
        if (alive) setRows(res);
      } finally {
        if (alive) setBusy(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [filter]);

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
              {(isSupervisor || isManager) && <th className="px-3 py-2 font-semibold">Actions</th>}
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
                {(isSupervisor || isManager) && (
                  <td className="px-3 py-2">
                    <button
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                      onClick={() => handleDeleteRecord(r._id, r.assetId, r.technicianName)}
                      disabled={busy}
                    >
                      {busy ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!busy && rows.length === 0 ? <div className="p-8 text-sm text-slate-500">No maintenance records found.</div> : null}
      </div>
    </div>
  );
}
