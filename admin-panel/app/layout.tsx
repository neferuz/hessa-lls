"use client";

import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <div className="min-h-svh bg-background flex flex-col items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden w-full flex flex-col">
        <div className="overflow-hidden flex flex-col items-stretch justify-start bg-container h-full w-full bg-background relative border-none shadow-none">
          {pathname !== "/" && <DashboardHeader />}
          <main className="flex-1 overflow-hidden flex flex-col relative">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${unbounded.variable} font-sans antialiased text-sm sm:text-base`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <DashboardProvider>
            <AppShell>
              {children}
            </AppShell>
          </DashboardProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
