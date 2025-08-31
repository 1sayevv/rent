import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'manager';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole>('manager');
  const [loginTime, setLoginTime] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      const email = localStorage.getItem('adminEmail') || "";
      const role = (localStorage.getItem('userRole') as UserRole) || 'manager';
      const time = localStorage.getItem('loginTime') || "";
      
      setIsAuthenticated(auth);
      setUserEmail(email);
      setUserRole(role);
      setLoginTime(time);
    };

    checkAuth();

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (email: string, role: UserRole = 'manager') => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('loginTime', new Date().toISOString());
    
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserRole(role);
    setLoginTime(new Date().toISOString());
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginTime');
    
    setIsAuthenticated(false);
    setUserEmail("");
    setUserRole('manager');
    setLoginTime("");
  };

  return {
    isAuthenticated,
    userEmail,
    userRole,
    loginTime,
    login,
    logout
  };
} 