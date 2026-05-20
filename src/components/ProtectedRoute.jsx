import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  console.log('ProtectedRoute checking authentication:', { isAuthed });
  if (!isAuthed) {
    console.log('ProtectedRoute redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }
  console.log('ProtectedRoute allowing access - authenticated');
  return children;
}
