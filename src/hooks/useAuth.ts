import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loginTime, setLoginTime] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      const email = localStorage.getItem('adminEmail') || "";
      const time = localStorage.getItem('loginTime') || "";
      
      setIsAuthenticated(auth);
      setUserEmail(email);
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

  const login = (email: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('loginTime', new Date().toISOString());
    
    setIsAuthenticated(true);
    setUserEmail(email);
    setLoginTime(new Date().toISOString());
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('loginTime');
    
    setIsAuthenticated(false);
    setUserEmail("");
    setLoginTime("");
  };

  return {
    isAuthenticated,
    userEmail,
    loginTime,
    login,
    logout
  };
} 