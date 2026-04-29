"use client";

import { useState, useEffect } from "react";
import { 
  Tag, Plus, Search, Filter, MoreHorizontal, 
  Trash2, Edit2, Calendar, Ticket, Percent, 
  TrendingUp, Users, Clock
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
import { AnimatedNumber } from "@/components/ui/animated-number";

const MOCK_DISCOUNTS = [
  { id: "1", name: "Весенний SALE", type: "Процент", value: "15%", period: "01.04 — 30.04", usage: 145, status: "active", color: "text-green-500" },
  { id: "2", name: "Первый заказ", type: "Фикс. сумма", value: "25 000 сум", period: "Бессрочно", usage: 890, status: "active", color: "text-blue-500" },
  { id: "3", name: "Ночной дожор", type: "Процент", value: "20%", period: "Ежедневно 23:00+", usage: 42, status: "inactive", color: "text-purple-500" },
  { id: "4", name: "День рождения", type: "Подарок", value: "Торт в подарок", period: "Бессрочно", usage: 12, status: "active", color: "text-amber-500" },
];

export function DiscountsContent() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = MOCK_DISCOUNTS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans text-left">
      
      {/* Toolbar — adaptive layout (Categories/StopList Style) */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Ticket className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Акции и Скидки</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                {filtered.length}
              </Badge>
            </div>
            
            <div className="sm:hidden">
               <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                 <Plus className="size-4" strokeWidth={2.5} />
               </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative group w-full sm:w-[260px] px-0.5 sm:px-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Поиск акций..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
            />
          </div>
        </div>
        
        <div className="hidden sm:block">
          <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none">
            <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Создать
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-5 md:p-6 pb-24">
        <div className="max-w-[1200px] mx-auto space-y-6">
          
          {/* Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { label: "Активных акций", value: 3, icon: TrendingUp, color: "text-[#34c759]", trend: "+12%", isUp: true },
              { label: "Использовано всего", value: 1089, icon: Users, color: "text-[#007aff]", trend: "+8%", isUp: true },
              { label: "Экономия клиентов", value: 4500000, icon: Percent, color: "text-[#af52de]", trend: "-2%", isUp: false, suffix: " сум", className: "col-span-2 sm:col-span-1" },
            ].map((stat, i) => (
              <div key={i} className={cn("rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden text-left", stat.className)}>
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("size-8 rounded-xl flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5", stat.color)}>
                    <stat.icon className="size-4" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black",
                    stat.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  )}>
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground/60 font-semibold tracking-tight mb-0.5">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <AnimatedNumber value={stat.value} className="text-[18px] font-semibold tracking-tight" />
                    {stat.suffix && <span className="text-[11px] font-semibold text-muted-foreground/40">{stat.suffix}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table / Cards - Adaptive */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[14px] font-semibold tracking-tight uppercase opacity-30">Действующие предложения</h3>
                <div className="flex items-center gap-1.5">
                   <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase">LIVE</span>
                </div>
             </div>
             
             {/* Desktop View */}
             <div className="hidden sm:block rounded-[2rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden shadow-none">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-[#f2f2f7]/30 dark:bg-black/20 text-muted-foreground/40 border-b border-black/5 dark:border-white/5">
                            <th className="py-3 px-6 text-[10px] font-semibold uppercase tracking-widest">Название акции</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-center">Тип</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-center">Выгода</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-center">Период</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-right">Использовано</th>
                            <th className="py-3 pr-6 text-right w-10"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/10">
                         {filtered.map(item => (
                            <tr key={item.id} className="group/row cursor-pointer hover:bg-muted/10 transition-colors">
                               <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                     <div className={cn("size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5", item.color)}>
                                        <Tag className="size-4" />
                                     </div>
                                     <span className="text-[14px] font-semibold text-foreground tracking-tight">{item.name}</span>
                                  </div>
                               </td>
                               <td className="py-4 px-4 text-center">
                                  <span className="text-[12px] font-medium text-muted-foreground">{item.type}</span>
                               </td>
                               <td className="py-4 px-4 text-center">
                                  <Badge variant="outline" className="h-[22px] px-2.5 text-[10px] font-semibold border-0 bg-primary/10 text-primary rounded-full">
                                     {item.value}
                                  </Badge>
                               </td>
                               <td className="py-4 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground/60">
                                     <Calendar className="size-3" />
                                     <span className="text-[12px] font-medium">{item.period}</span>
                                  </div>
                               </td>
                               <td className="py-4 px-4 text-right">
                                  <span className="text-[13px] font-semibold tabular-nums">{item.usage} раз</span>
                               </td>
                               <td className="py-4 pr-6 text-right">
                                  <DropdownMenu>
                                     <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 opacity-40 hover:opacity-100 data-[state=open]:opacity-100 ml-auto">
                                           <MoreHorizontal className="size-4" />
                                        </Button>
                                     </DropdownMenuTrigger>
                                     <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1e] backdrop-blur-xl shadow-2xl">
                                        <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[13px] font-semibold focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer">
                                           <Edit2 className="size-3.5" /> Редактировать
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[13px] font-semibold focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer">
                                           <Clock className="size-3.5" /> Продлить
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1.5 opacity-5" />
                                        <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[13px] font-semibold text-red-500 focus:bg-red-500/5 focus:text-red-500 cursor-pointer">
                                           <Trash2 className="size-3.5" /> Удалить акцию
                                        </DropdownMenuItem>
                                     </DropdownMenuContent>
                                  </DropdownMenu>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Mobile View */}
             <div className="sm:hidden space-y-3">
                {filtered.map(item => (
                   <div key={item.id} className="p-4 rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] border border-black/5 active:scale-[0.98] transition-all">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <div className={cn("size-10 rounded-xl flex items-center justify-center bg-black/5", item.color)}>
                               <Tag className="size-5" />
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-[14px] font-semibold tracking-tight">{item.name}</p>
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-semibold text-muted-foreground/50">{item.type}</span>
                                  <div className="size-1 rounded-full bg-muted-foreground/20" />
                                  <span className="text-[10px] font-bold text-[#007aff] uppercase">{item.value}</span>
                               </div>
                            </div>
                         </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="size-8 rounded-full bg-black/5 border-0">
                                  <MoreHorizontal className="size-4 opacity-40" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl p-1.5 border-black/5 bg-white/95 backdrop-blur-xl">
                               <DropdownMenuItem className="rounded-xl py-2 px-3 text-[12px] font-bold">Изменить</DropdownMenuItem>
                               <DropdownMenuItem className="rounded-xl py-2 px-3 text-[12px] font-bold text-red-500">Удалить</DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-black/5">
                         <div className="flex items-center gap-1.5 text-muted-foreground/50">
                            <Calendar className="size-3" />
                            <span className="text-[11px] font-semibold">{item.period}</span>
                         </div>
                         <div className="flex items-center gap-1">
                            <span className="text-[13px] font-bold tabular-nums">{item.usage}</span>
                            <span className="text-[10px] font-semibold text-muted-foreground/30 uppercase tracking-tighter">Usage</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
