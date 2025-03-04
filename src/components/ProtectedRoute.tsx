// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = ['admin', 'volunteer'] 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setIsAuthenticated(true);
      setUserRole(user.role || 'volunteer');
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Still loading
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role-based access
  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Authenticated and authorized
  return <Outlet />;
};