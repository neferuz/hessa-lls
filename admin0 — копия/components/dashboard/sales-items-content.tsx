"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, ShoppingBag, 
  BarChart3, Search, ChevronRight, Package,
  ArrowUpRight, ArrowDownRight, Filter, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PeriodFilter } from "@/components/ui/period-filter";

const MOCK_SALES_ITEMS = [
  { id: "1", name: "Филадельфия Лайт", category: "Роллы", sold: 124, revenue: 4464000, trend: "+12%", isUp: true, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800" },
  { id: "2", name: "Калифорния Классик", category: "Роллы", sold: 98, revenue: 5880000, trend: "+5%", isUp: true, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800" },
  { id: "3", name: "Сет Самурай", category: "Сеты", sold: 45, revenue: 5760000, trend: "-2%", isUp: false, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800" },
  { id: "4", name: "Запеченный краб", category: "Теплые роллы", sold: 86, revenue: 3870000, trend: "+18%", isUp: true, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800" },
  { id: "5", name: "Мисо суп", category: "Супы", sold: 64, revenue: 1600000, trend: "+3%", isUp: true, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800" },
  { id: "6", name: "Зеленый чай", category: "Напитки", sold: 112, revenue: 1120000, trend: "+8%", isUp: true, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800" },
];

export function SalesItemsContent() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState("Сегодня");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = MOCK_SALES_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Toolbar — Command Center Standard */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <ShoppingBag className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Продажи</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                ITEMS
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <PeriodFilter value={period} onChange={setPeriod} isCompact />
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 border-0">
                 <Download className="size-4" />
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
          
          <div className="hidden sm:block">
            <PeriodFilter value={period} onChange={setPeriod} />
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border-0">
            <Download className="size-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border-0 text-primary">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-5 md:p-6 pb-20 sm:pb-6">
        <div className="max-w-[1300px] mx-auto space-y-5 sm:space-y-6">

          {/* Compact Stats Grid — Adaptive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Блюд продано", value: 624, trend: "+18%", isUp: true, icon: Package, color: "text-blue-500" },
              { label: "Популярная кат.", value: "Роллы", isText: true, trend: "45%", isUp: true, icon: BarChart3, color: "text-primary" },
              { label: "Средняя маржа", value: "62%", isText: true, trend: "+1.2%", isUp: true, icon: TrendingUp, color: "text-green-500" },
              { label: "Новинок в ТОП", value: 3, trend: "+1", isUp: true, icon: ArrowUpRight, color: "text-orange-500" },
            ].map((s) => (
              <div key={s.label} className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col items-start text-left">
                <div className="flex items-center justify-between w-full mb-2">
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
                <div className="w-full">
                  <p className="text-[11px] text-muted-foreground/60 font-semibold overflow-hidden text-ellipsis whitespace-nowrap mb-0.5">{s.label}</p>
                  <div className="flex items-baseline gap-1">
                    {typeof s.value === 'number' ? (
                      <AnimatedNumber value={s.value} className="text-[18px] font-bold tracking-tight tabular-nums" />
                    ) : (
                      <span className="text-[18px] font-bold tracking-tight">{s.value}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table / Cards */}
          <div className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden text-left">
            <div className="px-5 sm:px-8 h-16 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
               <h3 className="text-[14px] font-semibold text-foreground/80">Аналитика позиций</h3>
               <Badge variant="outline" className="hidden sm:inline-flex h-[20px] px-2 text-[9px] font-black bg-primary/5 border-0 text-primary rounded-md uppercase tracking-wider">TOP SELLING</Badge>
            </div>
            
            {/* Desktop View Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-transparent text-muted-foreground/40 border-b border-black/5 dark:border-white/10">
                    <th className="h-12 pl-8 text-[10px] font-bold uppercase tracking-widest">Блюдо</th>
                    <th className="h-12 px-4 text-[10px] font-bold uppercase tracking-widest">Категория</th>
                    <th className="h-12 px-4 text-[10px] font-bold uppercase tracking-widest text-right">Продано</th>
                    <th className="h-12 px-4 text-[10px] font-bold uppercase tracking-widest text-right">Выручка</th>
                    <th className="h-12 px-4 text-[10px] font-bold uppercase tracking-widest text-center">Тренд</th>
                    <th className="h-12 pr-8 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {filtered.map(item => (
                    <tr key={item.id} className="h-16 group/row cursor-pointer hover:bg-muted/10 transition-colors">
                      <td className="pl-8">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl overflow-hidden bg-muted border border-border/10">
                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <span className="text-[14px] font-semibold text-foreground">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4"><span className="text-[12px] font-semibold text-muted-foreground/60">{item.category}</span></td>
                      <td className="px-4 text-right"><span className="text-[13px] font-bold tabular-nums">{item.sold} шт</span></td>
                      <td className="px-4 text-right"><span className="text-[13px] font-bold tabular-nums">{item.revenue.toLocaleString("ru-RU")} UZS</span></td>
                      <td className="px-4 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                          item.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                        )}>
                          {item.isUp ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
                          {item.trend}
                        </div>
                      </td>
                      <td className="pr-8 text-right">
                         <div className="size-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors ml-auto">
                            <ChevronRight className="size-4 text-muted-foreground/30" />
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards — High Density */}
            <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
               {filtered.map((item) => (
                 <div key={item.id} className="p-3 px-5 flex items-center gap-4 active:bg-black/5 transition-colors">
                    <div className="size-9 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-black/5">
                       <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[13px] font-semibold truncate leading-none mb-1">{item.name}</p>
                       <p className="text-[10px] text-muted-foreground/40 font-semibold uppercase tracking-widest">{item.category}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                       <p className="text-[13px] font-bold tabular-nums tracking-tight">
                         {item.revenue.toLocaleString()} <span className="text-[9px] opacity-30 uppercase">sum</span>
                       </p>
                       <div className={cn(
                         "flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold",
                         item.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                       )}>
                         {item.sold} шт · {item.trend}
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
