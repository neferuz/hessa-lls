import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { IntegrationsContent } from "@/components/dashboard/integrations-content";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function IntegrationsPage() {
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full flex">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background shadow-none border-none relative">
          <DashboardHeader />
          <IntegrationsContent />
        </div>
      </div> 
    </SidebarProvider>
  );
}
