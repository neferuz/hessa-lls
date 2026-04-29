"use client";

import { useState, useEffect } from "react";
import { 
  Users, Shield, ShieldCheck, UserPlus, 
  Search, ChevronRight, MoreHorizontal, Mail, Key,
  Edit2, History, Lock, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MOCK_STAFF = [
  { id: "1", name: "Сергей Воронов", role: "Администратор", email: "sergey@sushilab.uz", status: "active", icon: ShieldCheck, color: "text-red-500" },
  { id: "2", name: "Анна Ким", role: "Менеджер", email: "anna@sushilab.uz", status: "active", icon: Shield, color: "text-blue-500" },
  { id: "3", name: "Дилшод Турсунов", role: "Шеф-повар", email: "dilshod@sushilab.uz", status: "on_duty", icon: Users, color: "text-primary" },
  { id: "4", name: "Мадина Рахимова", role: "Оператор", email: "madina@sushilab.uz", status: "active", icon: Users, color: "text-muted-foreground" },
];

export function RolesContent() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredStaff = MOCK_STAFF.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans text-left">
      
      {/* Toolbar — Command Center Standard */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Персонал</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                ACCESS
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                 <UserPlus className="size-4" />
               </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
            <Input 
              placeholder="Поиск..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 sm:h-8 w-full sm:w-48 pl-9 sm:pl-8 pr-4 rounded-full sm:rounded-xl bg-black/5 dark:bg-white/10 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none text-[13px] font-medium" 
            />
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" className="h-9 px-5 rounded-xl text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none">
            <UserPlus className="size-4 mr-1.5" /> Добавить
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-5 md:p-6 pb-20 sm:pb-6">
        <div className="w-full space-y-5 sm:space-y-6 max-w-[1300px] mx-auto">

          {/* Quick Stats Grid — Compact & Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Всего", value: 12, icon: Users, color: "text-primary" },
              { label: "Админы", value: 2, icon: ShieldCheck, color: "text-red-500" },
              { label: "На смене", value: 4, icon: Key, color: "text-green-500" },
            ].map((s, idx) => (
              <div key={s.label} className={cn(
                "rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col items-start",
                idx === 2 ? "col-span-2 sm:col-span-1" : ""
              )}>
                <div className="flex items-center justify-between w-full mb-1">
                   <div className={cn("size-8 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5", s.color)}>
                     <s.icon className="size-4" />
                   </div>
                   <span className="text-[18px] font-black tracking-tight tabular-nums">{s.value}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table / Cards */}
          <div className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden text-left">
            <div className="px-5 sm:px-8 h-16 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
               <h3 className="text-[14px] font-semibold text-foreground/80">Доступ персонала</h3>
               <div className="hidden sm:flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Security Active</span>
               </div>
            </div>
            
            {/* Desktop View Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-transparent text-muted-foreground/40 border-b border-black/5 dark:border-white/10">
                    <th className="h-12 pl-8 text-[10px] font-black uppercase tracking-widest">Сотрудник</th>
                    <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest">Роль</th>
                    <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest">Email</th>
                    <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-center">Статус</th>
                    <th className="h-12 pr-8 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {filteredStaff.map(staff => (
                    <tr key={staff.id} className="h-16 group/row cursor-pointer hover:bg-muted/10 transition-colors">
                      <td className="pl-8">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[13px] font-black text-muted-foreground/60 border border-black/5 dark:border-white/10 uppercase tabular-nums">
                            {staff.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-[14px] font-bold text-foreground">{staff.name}</span>
                        </div>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <staff.icon className={cn("size-3.5", staff.color)} />
                          <span className="text-[13px] font-bold text-muted-foreground/60">{staff.role}</span>
                        </div>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2 text-muted-foreground/40 group-hover/row:text-foreground/60 transition-colors">
                          <Mail className="size-3" />
                          <span className="text-[12px] font-bold">{staff.email}</span>
                        </div>
                      </td>
                      <td className="px-4 text-center">
                        <Badge variant="outline" className={cn(
                          "h-[22px] px-2.5 text-[9px] font-black border-0 rounded-md uppercase tracking-wider",
                          staff.status === "active" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                        )}>
                          {staff.status === "active" ? "Онлайн" : "На смене"}
                        </Badge>
                      </td>
                      <td className="pr-8 text-right">
                         <StaffActionsMenu />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards — High Density */}
            <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
               {filteredStaff.map((staff) => (
                 <div key={staff.id} className="p-4 flex items-center gap-4 active:bg-black/5 transition-colors">
                    <div className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[12px] font-black text-muted-foreground/40 border border-black/5 dark:border-white/10 uppercase shrink-0">
                       {staff.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14px] font-bold truncate leading-tight">{staff.name}</p>
                          <Badge variant="outline" className={cn(
                            "h-[16px] px-1.5 text-[8px] font-black border-0 rounded-[4px] uppercase tracking-wider",
                            staff.status === "active" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                          )}>
                            {staff.status === "active" ? "●" : "◕"}
                          </Badge>
                       </div>
                       <p className="text-[11px] text-muted-foreground/50 font-bold uppercase tracking-widest">{staff.role}</p>
                    </div>
                    <StaffActionsMenu />
                 </div>
               ))}
            </div>

            {filteredStaff.length === 0 && (
               <div className="h-[300px] flex flex-col items-center justify-center text-center p-8">
                  <div className="size-20 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-6">
                     <Search className="size-8 text-muted-foreground/20" />
                  </div>
                  <h3 className="text-[16px] font-semibold tracking-tight mb-2">Ничего не нашли</h3>
                  <p className="text-[12px] text-muted-foreground/50 max-w-[240px] leading-relaxed mb-6 italic">
                     «{searchQuery}»
                  </p>
                  <Button 
                    onClick={() => setSearchQuery("")}
                    className="h-9 px-6 rounded-full text-[12px] font-semibold bg-black/5 dark:bg-white/10 text-foreground border-0 shadow-none"
                  >
                    Сбросить
                  </Button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffActionsMenu() {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors opacity-40 hover:opacity-100 data-[state=open]:opacity-100 ml-auto shrink-0">
               <MoreHorizontal className="size-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-2xl border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1e] backdrop-blur-xl shadow-2xl">
            <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[13px] font-semibold focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer">
               <Edit2 className="size-4 text-muted-foreground/60" />
               Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[13px] font-semibold focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer">
               <History className="size-4 text-muted-foreground/60" />
               История входов
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5 bg-black/5 dark:bg-white/5" />
            <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[13px] font-semibold focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer">
               <Lock className="size-4 text-muted-foreground/60" />
               Сбросить пароль
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[13px] font-semibold text-red-500 focus:bg-red-500/5 focus:text-red-500 cursor-pointer">
               <Trash2 className="size-4" />
               Приостановить
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
