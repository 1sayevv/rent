import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Простая проверка аутентификации через localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  // Если не авторизован, перенаправляем на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Все проверки пройдены, показываем содержимое
  return <>{children}</>;
} 