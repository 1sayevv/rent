import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/hooks/useAuth';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export default function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleBasedRouteProps) {
  const { userRole } = useAuth();
  
  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}