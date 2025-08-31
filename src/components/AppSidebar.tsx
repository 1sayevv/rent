import { 
  LayoutDashboard, 
  Car, 
  CalendarDays, 
  Users, 
  DollarSign, 
  Settings,
  Plus,
  BookOpen,
  Database
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const allMainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ['admin', 'manager'] },
  { title: "Машины", url: "/cars", icon: Car, roles: ['admin', 'manager'] },
  { title: "Бронирования", url: "/bookings", icon: CalendarDays, roles: ['admin', 'manager'] },
  { title: "Клиенты", url: "/clients", icon: Users, roles: ['admin', 'manager'] },
  { title: "Финансы", url: "/finances", icon: DollarSign, roles: ['admin'] },
  { title: "Настройки", url: "/settings", icon: Settings, roles: ['admin'] },
  { title: "Данные", url: "/data", icon: Database, roles: ['admin'] },
];

const allQuickActions = [
  { title: "Добавить машину", url: "/cars/add", icon: Plus, roles: ['admin', 'manager'] },
  { title: "Календарь бронирований", url: "/bookings/calendar", icon: BookOpen, roles: ['admin', 'manager'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { userRole } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  // Фильтруем пункты меню по роли пользователя
  const mainItems = allMainItems.filter(item => item.roles.includes(userRole));
  const quickActions = allQuickActions.filter(item => item.roles.includes(userRole));

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-primary";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">RentaCar</h1>
              <p className="text-xs text-sidebar-foreground/70">Админ-панель</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <Car className="h-5 w-5 text-white" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!isCollapsed && "Основное"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!isCollapsed && "Быстрые действия"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>
    </Sidebar>
  );
}