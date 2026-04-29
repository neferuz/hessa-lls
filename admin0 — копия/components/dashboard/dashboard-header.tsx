"use client";

import { useState, useEffect } from "react";
import { User, Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full sticky top-0 z-50 flex h-14 items-center justify-between bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl px-4 border-b border-black/5 dark:border-white/10">
      {/* Left: Sidebar Trigger */}
      <div className="flex items-center gap-2 sm:gap-4 sm:flex-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 h-9 w-9 border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all text-muted-foreground/60 focus-visible:ring-0"
        >
          <Menu className="size-5" />
        </Button>
        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold tracking-tight text-foreground uppercase">
            Sushi Lab <span className="text-[10px] font-semibold text-muted-foreground/60 ml-1.5 tracking-widest uppercase">Operation Center</span>
          </h1>
        </div>
      </div>

      {/* Center: Mobile Logo */}
      <div className="sm:hidden absolute left-1/2 -translate-x-1/2">
        <span className="text-[14px] font-bold tracking-tight uppercase">Sushi Lab</span>
      </div>

      {/* Right: Profile & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Search className="size-4.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
            <Bell className="size-4.5" />
            <span className="absolute top-2 right-2 size-1.5 bg-primary rounded-full ring-2 ring-background" />
          </Button>
          <div className="h-4 w-px bg-border/60 mx-1.5" />
          <ThemeToggle />
          <div className="h-4 w-px bg-border/60 mx-1.5" />
        </div>
        
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 overflow-hidden p-0 group">
                <div className="flex h-full w-full items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="size-4 text-muted-foreground/70" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-1 gap-0.5 border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl shadow-none rounded-[1.75rem]">
              <DropdownMenuLabel className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-[13px] font-semibold leading-none tracking-tight">Администратор</p>
                  <p className="text-[10px] leading-none text-muted-foreground font-medium opacity-60">Sushi Lab Team</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5 mx-1" />
              <DropdownMenuItem className="text-[12px] font-medium py-2 px-3 rounded-2xl cursor-pointer focus:bg-black/5 dark:focus:bg-white/5 transition-colors">Профиль</DropdownMenuItem>
              <DropdownMenuItem className="text-[12px] font-medium py-2 px-3 rounded-2xl cursor-pointer focus:bg-black/5 dark:focus:bg-white/5 transition-colors">Настройки</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5 mx-1" />
              <DropdownMenuItem 
                onClick={() => window.location.href = "/login"}
                className="text-[12px] font-semibold py-2 px-3 rounded-xl cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20 transition-colors"
              >
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
