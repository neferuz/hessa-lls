import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EditDishContent } from "@/components/dashboard/edit-dish-content";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background shadow-none border-none">
          <DashboardHeader />
          <EditDishContent id={id} />
        </div>
      </div> 
    </SidebarProvider>
  );
}
