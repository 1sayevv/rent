import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Проверяем аутентификацию через localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userData = localStorage.getItem('userData');

  // Если не авторизован или нет данных пользователя, перенаправляем на логин
  if (!isAuthenticated || !userData) {
    return <Navigate to="/login" replace />;
  }

  // Все проверки пройдены, показываем содержимое
  return <>{children}</>;
} 