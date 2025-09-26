import { 
  LayoutDashboard, 
  Car, 
  CalendarDays, 
  Users, 
  DollarSign, 
  Settings,
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

  const getNavCls = ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
      return "bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-500 shadow-sm";
    }
    return "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm transition-all duration-200 ease-in-out";
  };

  // Select menu items based on role
  const mainItems = userRole === 'admin' ? adminItems : managerItems;

  return (
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
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RC</span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-3 px-3">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group ${getNavCls({ isActive: isActive(item.url) })}`}
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Additional Info Section */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <div className="text-xs text-gray-500 text-center">
              <p className="font-medium">Auto Management Suite</p>
              <p className="text-gray-400">v2.0.0</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}