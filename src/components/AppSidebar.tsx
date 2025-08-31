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

const adminItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Машины", url: "/cars", icon: Car },
  { title: "Бронирования", url: "/bookings", icon: CalendarDays },
  { title: "Клиенты", url: "/clients", icon: Users },
  { title: "Финансы", url: "/finances", icon: DollarSign },
  { title: "Настройки", url: "/settings", icon: Settings },
  { title: "Данные", url: "/data", icon: Database },
];

const managerItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Машины", url: "/cars", icon: Car },
  { title: "Бронирования", url: "/bookings", icon: CalendarDays },
  { title: "Клиенты", url: "/clients", icon: Users },
];

const adminQuickActions = [
  { title: "Добавить машину", url: "/cars/add", icon: Plus },
  { title: "Календарь бронирований", url: "/bookings/calendar", icon: BookOpen },
];

const managerQuickActions = [
  { title: "Добавить машину", url: "/cars/add", icon: Plus },
  { title: "Календарь бронирований", url: "/bookings/calendar", icon: BookOpen },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { userRole } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-primary";

  // Выбираем пункты меню в зависимости от роли
  const mainItems = userRole === 'admin' ? adminItems : managerItems;
  const quickActions = userRole === 'admin' ? adminQuickActions : managerQuickActions;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-3 sm:p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Car className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-sidebar-foreground">RentaCar</h1>
              <p className="text-xs text-sidebar-foreground/70">
                {userRole === 'admin' ? 'Админ-панель' : 'Панель менеджера'}
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <Car className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 sm:px-4 text-xs font-medium text-sidebar-foreground/70">
            Основное меню
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild className={getNavCls({ isActive: isActive(item.url) })}>
                    <NavLink to={item.url} className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm sm:text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 sm:px-4 text-xs font-medium text-sidebar-foreground/70">
            Быстрые действия
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild className={getNavCls({ isActive: isActive(item.url) })}>
                    <NavLink to={item.url} className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm sm:text-base">{item.title}</span>}
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