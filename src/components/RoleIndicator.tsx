import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Shield, User } from "lucide-react";

export function RoleIndicator() {
  const { userRole } = useAuth();

  if (!userRole) return null;

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          text: 'Администратор',
          icon: Shield,
          className: 'bg-primary/10 text-primary border-primary'
        };
      case 'manager':
        return {
          text: 'Менеджер',
          icon: User,
          className: 'bg-blue-50 text-blue-600 border-blue-200'
        };
      default:
        return {
          text: 'Пользователь',
          icon: User,
          className: 'bg-gray-50 text-gray-600 border-gray-200'
        };
    }
  };

  const roleInfo = getRoleInfo(userRole);
  const Icon = roleInfo.icon;

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${roleInfo.className}`}>
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{roleInfo.text}</span>
    </Badge>
  );
} 