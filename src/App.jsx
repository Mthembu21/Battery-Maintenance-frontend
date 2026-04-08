import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Shell from './components/Shell.jsx';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BatteryRegistry from './pages/BatteryRegistry.jsx';
import BatteryCreate from './pages/BatteryCreate.jsx';
import MaintenanceEntry from './pages/MaintenanceEntry.jsx';
import MaintenanceHistory from './pages/MaintenanceHistory.jsx';
import ComplianceDashboard from './pages/ComplianceDashboard.jsx';
import Reports from './pages/Reports.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import NotFound from './pages/NotFound.jsx';

function IndexRedirect() {
  const { isAuthed } = useAuth();
  return isAuthed ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthed, isTechnician, isSupervisor, isManager } = useAuth();
  
  function IndexRedirect() {
    return isAuthed ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
  }

  // Technician routes - only maintenance entry
  if (isTechnician) {
    return (
      <Routes>
        <Route path="/login" element={<Navigate to="/maintenance/new" replace />} />
        <Route path="/signup" element={<Navigate to="/maintenance/new" replace />} />
        <Route path="/" element={<Navigate to="/maintenance/new" replace />} />
        <Route path="/maintenance/new" element={<MaintenanceEntry />} />
        <Route path="*" element={<Navigate to="/maintenance/new" replace />} />
      </Routes>
    );
  }

  // Supervisor routes - dashboard, battery entry, compliance, admin settings, maintenance history
  if (isSupervisor) {
    return (
      <Routes>
        <Route path="/" element={<ProtectedRoute><Shell /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="batteries" element={<BatteryRegistry />} />
          <Route path="batteries/create" element={<BatteryCreate />} />
          <Route path="maintenance/history" element={<MaintenanceHistory />} />
          <Route path="compliance" element={<ComplianceDashboard />} />
          <Route path="admin" element={<AdminSettings />} />
        </Route>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Manager routes - only reports and compliance
  if (isManager) {
    return (
      <Routes>
        <Route path="/" element={<ProtectedRoute><Shell /></ProtectedRoute>}>
          <Route index element={<Navigate to="/reports" replace />} />
          <Route path="reports" element={<Reports />} />
          <Route path="compliance" element={<ComplianceDashboard />} />
        </Route>
        <Route path="/login" element={<Navigate to="/reports" replace />} />
        <Route path="/signup" element={<Navigate to="/reports" replace />} />
        <Route path="*" element={<Navigate to="/reports" replace />} />
      </Routes>
    );
  }

  // Public routes (not authenticated)
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/index" element={<IndexRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
