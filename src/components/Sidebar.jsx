import { NavLink } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-epiroc-yellow text-epiroc-dark'
            : 'text-slate-200 hover:bg-slate-700/60'
        ].join(' ')
      }
    >
      <Icon />
      <span>{label}</span>
    </NavLink>
  );
}

// Icon components
const LayoutDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const Battery = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
    <line x1="23" y1="11" x2="23" y2="13"/>
    <line x1="1" y1="11" x2="23" y2="11"/>
  </svg>
);

const ClipboardList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="4" rx="1" ry="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M9 14h6"/>
    <path d="M9 18h3"/>
  </svg>
);

const BarChart3 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="M18 17V9"/>
    <path d="M13 17V5"/>
    <path d="M8 17v-3"/>
  </svg>
);

const FileText = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const Settings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M1.54 14.04l4.24-4.24M18.46 14.04l4.24-4.24"/>
  </svg>
);

export default function Sidebar() {
  const { user, isSupervisor, isManager } = useAuth();

  const getNavItems = () => {
    if (isSupervisor) {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/batteries', icon: Battery, label: 'Battery Registry' },
        { to: '/maintenance/history', icon: ClipboardList, label: 'Maintenance History' },
        { to: '/compliance', icon: BarChart3, label: 'Compliance' },
        { to: '/admin', icon: Settings, label: 'Admin Settings' }
      ];
    }
    
    if (isManager) {
      return [
        { to: '/reports', icon: FileText, label: 'Reports' },
        { to: '/compliance', icon: BarChart3, label: 'Compliance' }
      ];
    }
    
    return [];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 hidden md:flex flex-col bg-[#1f232b] text-white border-r border-black/20">
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-epiroc-yellow text-epiroc-dark flex items-center justify-center font-black">
            EB
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Epiroc</div>
            <div className="text-xs text-slate-300">Battery Maintenance</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-300">
          {user?.email ?? ''}
          <span className="text-slate-400"> · </span>
          {user?.role ?? ''}
          {user?.technicianName && (
            <>
              <span className="text-slate-400"> · </span>
              {user.technicianName}
            </>
          )}
        </div>
      </div>

      {navItems.length > 0 && (
        <nav className="p-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      )}

      <div className="mt-auto p-3 text-[11px] text-slate-400">
        Field + workshop use
      </div>
    </aside>
  );
}
