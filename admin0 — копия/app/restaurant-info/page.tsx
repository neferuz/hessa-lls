import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RestaurantInfoContent } from "@/components/dashboard/restaurant-info-content";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RestaurantInfoPage() {
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full flex">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background shadow-none border-none relative">
          <DashboardHeader />
          <RestaurantInfoContent />
        </div>
      </div> 
    </SidebarProvider>
  );
}
