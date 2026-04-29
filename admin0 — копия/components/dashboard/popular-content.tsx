"use client";

import { useState } from "react";
import { Search, Flame, TrendingUp, TrendingDown, ShoppingBag, CreditCard, Package, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PeriodFilter } from "@/components/ui/period-filter";

const POPULAR_ITEMS = [
  { id: "1", name: "Филадельфия Лайт", category: "Роллы", sales: 852, revenue: "27.2 млн", trend: "+12%", trendUp: true, share: "24%", image: "/rolls.png" },
  { id: "2", name: "Калифорния краб", category: "Роллы", sales: 641, revenue: "17.9 млн", trend: "+5%", trendUp: true, share: "18%", image: "/rolls.png" },
  { id: "3", name: "Сет Самурай", category: "Сеты", sales: 320, revenue: "38.4 млн", trend: "-2%", trendUp: false, share: "32%", image: "/sets.png" },
  { id: "4", name: "Кока-Кола 0.5", category: "Напитки", sales: 1205, revenue: "9.6 млн", trend: "+18%", trendUp: true, share: "8%", image: "/drinks.png" },
  { id: "5", name: "Запеченный окунь", category: "Горячее", sales: 215, revenue: "9.6 млн", trend: "+3%", trendUp: true, share: "8%", image: "/rolls.png" },
];

export function PopularContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState(POPULAR_ITEMS);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePeriodChange = (period: string, range: { from: string; to: string }) => {
    setIsUpdating(true);
    // Simulate network delay
    setTimeout(() => {
      setItems(prev => [...prev].sort(() => Math.random() - 0.5).map(item => ({
        ...item,
        sales: Math.floor(Math.random() * 2000),
        revenue: (Math.random() * 50).toFixed(1) + " млн"
      })));
      setIsUpdating(false);
    }, 400);
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSales = items.reduce((a, i) => a + i.sales, 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">

      {/* Toolbar — adaptive layout (StopList Style on Desktop) */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Flame className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Популярные блюда</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                {filtered.length}
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <PeriodFilter onPeriodChange={handlePeriodChange} isCompact />
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative group w-full sm:w-[260px] px-0.5 sm:px-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Поиск по меню..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
            />
          </div>
        </div>
        
        <div className="hidden sm:block">
           <PeriodFilter onPeriodChange={handlePeriodChange} />
        </div>
      </div>

      {/* Body */}
      <div className={cn("flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 md:p-6 transition-all duration-300", isUpdating ? "opacity-30 scale-[0.99] grayscale-[0.5]" : "opacity-100 scale-100 grayscale-0")}>
        <div className="max-w-[1300px] mx-auto space-y-4 sm:space-y-5">

          {/* Compact Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { label: "Продаж всего", value: totalSales.toLocaleString("ru-RU"), icon: ShoppingBag, color: "text-orange-500", trend: "+14%", isUp: true },
              { label: "Ср. выручка", value: "20.5 млн", icon: CreditCard, color: "text-green-500", trend: "+8%", isUp: true },
              { label: "Позиций", value: items.length, icon: Package, color: "text-blue-500", trend: "0", isUp: true, className: "col-span-2 sm:col-span-1" },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left", s.className)}>
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("size-8 rounded-xl flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5", s.color)}>
                    <s.icon className="size-4" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    s.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  )}>
                    {s.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-semibold tracking-tight mb-0.5 whitespace-nowrap">{s.label}</p>
                  <div className="flex items-baseline gap-1">
                    <AnimatedNumber value={s.value} className="text-[17px] sm:text-[18px] font-semibold tracking-tight tabular-nums" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table / Cards — Adaptive structure */}
          {filtered.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
               <div className="size-20 sm:size-24 rounded-[2rem] sm:rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-5 sm:mb-6">
                  <Search className="size-8 sm:size-10 text-muted-foreground/40" />
               </div>
               <h3 className="text-[16px] sm:text-[18px] font-bold tracking-tight mb-2">Ничего не нашли</h3>
               <p className="text-[12px] sm:text-[13px] text-muted-foreground/70 max-w-[240px] leading-relaxed mb-6">
                 По запросу <span className="text-foreground font-semibold italic">«{searchQuery}»</span> блюд не обнаружено.
               </p>
               <Button 
                 onClick={() => setSearchQuery("")}
                 className="rounded-xl h-[42px] px-8 font-bold text-[13px] bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 transition-colors border-0 shadow-none"
               >
                 Сбросить
               </Button>
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10">
              {/* Desktop Table */}
              <table className="hidden sm:table w-full text-left border-collapse">
                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                  <tr>
                    <th className="py-3 px-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 w-12">#</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Блюдо</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Категория</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 text-right w-24">Продаж</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 text-right w-28">Выручка</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 text-right w-24">Доля</th>
                    <th className="py-3 pr-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 text-right w-20">Тренд</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {filtered.map((item, i) => (
                    <tr key={item.id} className="group cursor-pointer hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-5 text-[13px] font-semibold text-muted-foreground/40 tabular-nums">{i + 1}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl overflow-hidden bg-muted border border-border/30 group-hover:border-border/60 transition-colors relative">
                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <span className="text-[13px] font-semibold text-foreground">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-[12px] font-medium text-muted-foreground/70">{item.category}</td>
                      <td className="py-2.5 px-4 text-[13px] font-bold text-right tabular-nums text-foreground">{item.sales.toLocaleString("ru-RU")}</td>
                      <td className="py-2.5 px-4 text-[13px] font-bold text-foreground text-right tabular-nums">{item.revenue}</td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-14 h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: item.share }} />
                          </div>
                          <span className="text-[11px] font-bold text-muted-foreground tabular-nums w-7">{item.share}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-5 text-right">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[12px] font-bold",
                          item.trendUp ? "text-green-600" : "text-red-500"
                        )}>
                          {item.trendUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                          {item.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
                {filtered.map((item, i) => (
                  <div key={item.id} className="p-4 flex flex-col gap-3 active:bg-black/5 transition-colors">
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                           <span className="text-[11px] font-bold text-muted-foreground/30 w-4 tabular-nums">{i + 1}</span>
                           <div className="size-12 rounded-[1rem] overflow-hidden bg-muted border border-black/5 shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" alt="" />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-[13px] font-semibold line-clamp-1">{item.name}</p>
                              <p className="text-[11px] font-medium text-muted-foreground/60">{item.category}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[13px] font-bold tabular-nums">{item.revenue}</p>
                           <span className={cn(
                             "inline-flex items-center gap-0.5 text-[10px] font-semibold",
                             item.trendUp ? "text-green-600" : "text-red-500"
                           )}>
                             {item.trendUp ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                             {item.trend}
                           </span>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col gap-0.5">
                           <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase">Продаж</span>
                           <span className="text-[13px] font-bold tabular-nums">{item.sales.toLocaleString("ru-RU")}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col gap-1.5">
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase">Доля</span>
                              <span className="text-[11px] font-bold tabular-nums">{item.share}</span>
                           </div>
                           <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: item.share }} />
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

