import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { StaffRole } from '@/types/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: StaffRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on their actual role
    if (user.role === 'cashier') {
      return <Navigate to="/cashier" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}