import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

const titles = {
  '/': 'Dashboard',
  '/batteries': 'Battery Registry',
  '/maintenance/new': 'Maintenance Entry',
  '/maintenance/history': 'Maintenance History',
  '/compliance': 'Compliance Dashboard',
  '/reports': 'Reports',
  '/admin': 'Admin Settings'
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { logout, user, isTechnician } = useAuth();
  const navigate = useNavigate();

  const title = titles[pathname] ?? 'Battery Maintenance';

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-black/10">
      <div className="px-4 md:px-6 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-500">
            {isTechnician ? 'Technician Portal' : 'Epiroc Parts & Service'}
          </div>
          <div className="text-lg font-semibold truncate text-epiroc-dark">{title}</div>
        </div>

        {!isTechnician && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="text-sm">Search & filters in modules</span>
          </div>
        )}

        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-epiroc-dark text-white hover:opacity-90 text-sm"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
