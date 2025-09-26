import { useState, useEffect, useCallback } from 'react';
import { UserRole, User } from '@/types';

// Move permissions outside the hook for stability
const MANAGER_PERMISSIONS: Record<string, string[]> = {
  'dashboard': ['view'],
  'cars': ['view', 'create', 'edit', 'delete'],
  'bookings': ['view', 'create', 'edit', 'confirm', 'reject', 'complete'],
  'clients': ['view', 'create', 'edit'],
  'finances': [],
  'settings': [],
  'data': []
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginTime, setLoginTime] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      const userData = localStorage.getItem('userData');
      const time = localStorage.getItem('loginTime') || "";
      
      setIsAuthenticated(auth);
      setUser(userData ? JSON.parse(userData) : null);
      setLoginTime(time);
    };

    checkAuth();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (email: string, role: UserRole, name: string) => {
    const userData: User = {
      id: Date.now(),
      email,
      role,
      name,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('loginTime', new Date().toISOString());
    
    setIsAuthenticated(true);
    setUser(userData);
    setLoginTime(new Date().toISOString());
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
    
    setIsAuthenticated(false);
    setUser(null);
    setLoginTime("");
  };

  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // Permissions for manager
    if (user.role === 'manager') {
      const permissions = MANAGER_PERMISSIONS[resource];
      return permissions ? permissions.includes(action) : false;
    }

    return false;
  }, [user]);

  return {
    isAuthenticated,
    user,
    userEmail: user?.email || "",
    userRole: user?.role || null,
    loginTime,
    login,
    logout,
    hasPermission
  };
} 