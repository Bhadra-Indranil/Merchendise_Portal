import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export default function Protected({ children, requiredRoles }: ProtectedProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return (
      <div className="card text-center">
        <h3>Access Denied</h3>
        <p>You don't have permission to access this page.</p>
        <p>Required role: {requiredRoles.join(' or ')}</p>
        <p>Your role: {user.role}</p>
      </div>
    );
  }

  return <>{children}</>;
}