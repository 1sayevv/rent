import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ProfileMenu from "./ProfileMenu";
import { RoleIndicator } from "./RoleIndicator";
import { SearchBar } from "./SearchBar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card px-6 flex items-center justify-between shadow-card">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="text-sidebar-foreground bg-sidebar-accent hover:bg-sidebar-accent/80" />
              <SearchBar />
            </div>
            
            <div className="flex items-center space-x-3">
              <RoleIndicator />
              <div className="border-l border-border pl-3">
                <ProfileMenu />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}