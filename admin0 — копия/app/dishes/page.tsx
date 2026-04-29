import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DishesContent } from "@/components/dashboard/dishes-content";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DishesPage() {
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <DashboardHeader />
          <DishesContent />
        </div>
      </div> 
    </SidebarProvider>
  );
}
