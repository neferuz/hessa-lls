"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  usePageHeader({
    title: (
        <div className="flex items-center gap-2">
            <LayoutDashboard className="size-5 text-primary" />
            <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Рабочая панель</h1>
        </div>
    ),
    description: "Центр управления и общая статистика системы"
  });

  useEffect(() => {
    const checkAuth = () => {
      const admin = localStorage.getItem("hessaAdmin");
      if (!admin) {
        router.push("/login");
      }
    };
    
    checkAuth();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "hessaAdmin" && !e.newValue) {
        router.push("/login");
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  return (
    <DashboardContent />
  );
}
