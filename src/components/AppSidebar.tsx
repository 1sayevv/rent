import { 
  LayoutDashboard, 
  Car, 
  CalendarDays, 
  Users, 
  DollarSign, 
  Settings,
  Plus,
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
  { title: "Cars", url: "/cars", icon: Car },
  { title: "Bookings", url: "/bookings", icon: CalendarDays },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Finances", url: "/finances", icon: DollarSign },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Data", url: "/data", icon: Database },
];

const managerItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Cars", url: "/cars", icon: Car },
  { title: "Bookings", url: "/bookings", icon: CalendarDays },
  { title: "Clients", url: "/clients", icon: Users },
];

const adminQuickActions = [
  { title: "Add Car", url: "/cars/add", icon: Plus },
];

const managerQuickActions = [
  { title: "Add Car", url: "/cars/add", icon: Plus },
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

  // Select menu items based on role
  const mainItems = userRole === 'admin' ? adminItems : managerItems;
  const quickActions = userRole === 'admin' ? adminQuickActions : managerQuickActions;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">RentaCar</h1>
              <p className="text-xs text-sidebar-foreground/70">
                {userRole === 'admin' ? 'Admin Panel' : 'Manager Panel'}
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="text-center">
            <h1 className="text-sm font-bold text-sidebar-foreground">RC</h1>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!isCollapsed && "Main"}
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
            {!isCollapsed && "Quick Actions"}
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