import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ProfileMenu from "./ProfileMenu";
import { RoleIndicator } from "./RoleIndicator";
import { SearchBar } from "./SearchBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Desktop Sidebar */}
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
<<<<<<< HEAD
          <header className="h-16 border-b bg-white/50 backdrop-blur-sm px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="text-foreground hover:bg-sidebar-accent hover:text-primary transition-all duration-200" />
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Araç, müşteri ara..." 
                  className="pl-10 w-80 bg-background border-border focus:border-primary transition-colors"
                />
=======
          <header className="h-14 sm:h-16 border-b border-gray-200 bg-white px-4 sm:px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="sm:hidden hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-white">
                  <AppSidebar />
                </SheetContent>
              </Sheet>
              
              {/* Desktop sidebar trigger */}
              <SidebarTrigger className="hidden sm:flex text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg p-2" />
              
              {/* Search bar */}
              <div className="flex-1 max-w-md">
                <SearchBar />
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RoleIndicator />
              <div className="border-l border-gray-200 pl-2 sm:pl-3">
                <ProfileMenu />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}