import { 
  LayoutDashboard, 
  Car, 
<<<<<<< HEAD
  CalendarDays,
  DollarSign
=======
  CalendarDays, 
  Users, 
  DollarSign, 
  Settings,
  Database
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
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
  { title: "Cars", url: "/cars", icon: Car },
  { title: "Bookings", url: "/bookings", icon: CalendarDays },
  { title: "Finances", url: "/finances", icon: DollarSign },
];

const managerItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Cars", url: "/cars", icon: Car },
  { title: "Bookings", url: "/bookings", icon: CalendarDays },
<<<<<<< HEAD
  { title: "Finances", url: "/finances", icon: DollarSign },
=======
  { title: "Clients", url: "/clients", icon: Users },
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
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

<<<<<<< HEAD
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold border-l-4 border-primary shadow-sm" 
      : "hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-primary transition-all duration-200 border-l-4 border-transparent hover:border-primary/30";

=======
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
  // Select menu items based on role
  const mainItems = userRole === 'admin' ? adminItems : managerItems;

  return (
<<<<<<< HEAD
    <Sidebar collapsible="icon" className="border-r shadow-sm">
      <SidebarHeader className="p-6 border-b bg-gradient-to-br from-primary/5 to-transparent">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                RentaCar
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                {userRole === 'admin' ? '🔧 Admin Panel' : '📊 Manager Panel'}
=======
    <Sidebar 
      collapsible="icon" 
      className="hidden sm:flex bg-white border-r border-gray-200 shadow-lg"
    >
      <SidebarHeader className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">RentaCar</h1>
              <p className="text-xs text-gray-500 font-medium">
                {userRole === 'admin' ? 'Admin Panel' : 'Manager Panel'}
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
<<<<<<< HEAD
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Car className="h-5 w-5 text-white" />
=======
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RC</span>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
            </div>
          </div>
        )}
      </SidebarHeader>

<<<<<<< HEAD
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            {!isCollapsed && "Menü"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
=======
      <SidebarContent className="bg-white">
        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-3 px-3">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group ${
                          active 
                            ? "bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-500 shadow-sm" 
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
                        }`}
                        style={active ? { pointerEvents: 'none' } : {}}
                      >
                        <item.icon className="h-4 w-4 shrink-0 transition-colors duration-200" />
                        {!isCollapsed && (
                          <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}