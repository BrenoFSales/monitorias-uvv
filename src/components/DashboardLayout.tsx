import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileTabBar } from "@/components/MobileTabBar";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { logout, user } = useAuth();

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-background">
        <header className="h-14 flex items-center justify-between border-b bg-card px-4">
          <h1 className="text-base font-semibold text-foreground">Monitorias UVV</h1>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 p-4 pb-24 overflow-auto animate-fade-in">
          <Outlet />
        </main>
        <MobileTabBar />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-foreground">Monitorias UVV</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
