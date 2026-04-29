"use client";

import { useState, useEffect } from "react";
import { 
  XCircle, RotateCcw, AlertTriangle, ShieldAlert,
  Search, ChevronRight, ArrowUpRight, ArrowDownRight,
  Filter, Download, Calendar, BarChart3, Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PeriodFilter } from "@/components/ui/period-filter";

const MOCK_RETURNS = [
  { id: "#8240", customer: "Антон С.", items: "Сет Филадельфия", amount: 185000, reason: "Долго везли", time: "14:20", status: "returned" },
  { id: "#8238", customer: "Елена В.", items: "Ролл Дракон", amount: 65000, reason: "Не тот состав", time: "13:55", status: "cancelled" },
  { id: "#8235", customer: "Олег П.", items: "Сет Токио", amount: 210000, reason: "Ошибка клиента", time: "12:15", status: "returned" },
  { id: "#8233", customer: "Мария Г.", items: "Напитки", amount: 45000, reason: "Отмена оператором", time: "11:40", status: "cancelled" },
];

export function ReturnsContent() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState("Сегодня");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = MOCK_RETURNS.filter(r => 
    r.id.includes(searchQuery) || r.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans text-left">
      
      {/* Toolbar — Command Center Standard */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shrink-0">
                <XCircle className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Возвраты</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                ALERTS
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <PeriodFilter value={period} onChange={setPeriod} isCompact />
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 border-0 text-red-500">
                 <AlertTriangle className="size-4" />
               </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
            <Input 
              placeholder="Поиск ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 sm:h-8 w-full sm:w-48 pl-9 sm:pl-8 pr-4 rounded-full sm:rounded-xl bg-black/5 dark:bg-white/10 border-0 focus-visible:ring-1 focus-visible:ring-red-500/20 shadow-none text-[13px] font-medium" 
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
            {[
              { label: "Всего отмен", value: 4, trend: "-12%", isUp: true, icon: XCircle, color: "text-red-500" },
              { label: "Сумма возвратов", value: 505000, trend: "+8%", isUp: false, icon: RotateCcw, color: "text-orange-500" },
              { label: "Уровень отказов", value: "2.4%", isText: true, trend: "-0.5%", isUp: true, icon: AlertTriangle, color: "text-yellow-500" },
              { label: "Убытки", value: 42000, trend: "+2.4k", isUp: false, icon: ShieldAlert, color: "text-muted-foreground" },
            ].map((s) => (
              <div key={s.label} className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 group hover:border-red-500/20 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={cn("size-8 rounded-xl flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5", s.color)}>
                    <s.icon className="size-4" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black tabular-nums",
                    s.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  )}>
                    {s.trend}
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-[11px] text-muted-foreground/60 font-bold overflow-hidden text-ellipsis whitespace-nowrap mb-0.5">{s.label}</p>
                  <div className="flex items-baseline gap-1">
                    {typeof s.value === 'number' ? (
                      <AnimatedNumber value={s.value} className="text-[18px] font-black tracking-tight tabular-nums" />
                    ) : (
                      <span className="text-[18px] font-black tracking-tight">{s.value}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content — Table / Cards */}
          <div className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden text-left">
            <div className="px-5 sm:px-8 h-16 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
               <h3 className="text-[14px] font-semibold text-foreground/80">Журнал возвратов</h3>
               <Badge variant="outline" className="hidden sm:inline-flex h-[20px] px-2 text-[9px] font-black bg-red-500/5 border-0 text-red-500 rounded-md uppercase tracking-wider">требует внимания</Badge>
            </div>
            
            {/* Desktop View Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-transparent text-muted-foreground/40 border-b border-black/5 dark:border-white/10">
                    <th className="h-12 pl-8 text-[10px] font-black uppercase tracking-widest">Клиент</th>
                    <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest">Заказ</th>
                    <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest">Причина</th>
                    <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-right">Сумма</th>
                    <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-center">Статус</th>
                    <th className="h-12 pr-8 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {filtered.map(row => (
                    <tr key={row.id} className="h-20 group/row cursor-pointer hover:bg-muted/10 transition-colors">
                      <td className="pl-8">
                        <div className="flex items-center gap-3">
                           <div className="size-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/10">
                              <span className="text-[13px] font-black text-muted-foreground uppercase">
                                 {row.customer.split(" ").map(n => n[0]).join("")}
                              </span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-foreground leading-none mb-1">{row.customer}</span>
                              <span className="text-[10px] text-primary/70 font-bold uppercase tracking-tight">Silver Member</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <div className="flex flex-col">
                           <span className="text-[13px] font-black tabular-nums opacity-60 leading-none mb-1">{row.id}</span>
                           <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-tight">{row.items}</span>
                        </div>
                      </td>
                      <td className="px-4">
                         <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-red-500/30" />
                            <span className="text-[12px] font-medium text-muted-foreground/80 italic leading-tight">«{row.reason}»</span>
                         </div>
                      </td>
                      <td className="px-4 text-right"><span className="text-[14px] font-black tabular-nums">{row.amount.toLocaleString("ru-RU")} UZS</span></td>
                      <td className="px-4 text-center">
                        <Badge variant="outline" className={cn(
                          "h-[24px] px-3 text-[10px] font-black border-0 rounded-full uppercase tracking-wider",
                          row.status === "returned" ? "bg-orange-500/10 text-orange-600" : "bg-red-500/10 text-red-500"
                        )}>
                          {row.status === "returned" ? "Возврат" : "Отмена"}
                        </Badge>
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
               {filtered.map((row) => (
                 <div key={row.id} className="p-3.5 px-5 flex items-center justify-between gap-4 active:bg-black/5 transition-colors">
                    <div className="min-w-0 text-left">
                       <p className="text-[13px] font-bold mb-0.5 leading-tight">{row.customer}</p>
                       <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest truncate">{row.id} · {row.items}</p>
                       <p className="text-[11px] text-muted-foreground/60 italic mt-1 line-clamp-1 opacity-70">«{row.reason}»</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                       <p className="text-[14px] font-black tabular-nums tracking-tight">
                         {row.amount.toLocaleString()} <span className="text-[9px] opacity-30 uppercase">sum</span>
                       </p>
                       <Badge variant="outline" className={cn(
                         "h-[16px] px-1.5 text-[8px] font-black border-0 rounded-[4px] uppercase tracking-wider",
                         row.status === "returned" ? "bg-orange-500/10 text-orange-600" : "bg-red-500/10 text-red-500"
                       )}>
                         {row.status === "returned" ? "Возврат" : "Отмена"}
                       </Badge>
                    </div>
                 </div>
               ))}
            </div>

            {filtered.length === 0 && (
               <div className="h-[300px] flex flex-col items-center justify-center text-center p-8">
                  <div className="size-20 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-6">
                     <Search className="size-8 text-muted-foreground/20" />
                  </div>
                  <h3 className="text-[16px] font-semibold tracking-tight mb-2">Ничего не нашли</h3>
                  <p className="text-[12px] text-muted-foreground/50 max-w-[240px] leading-relaxed mb-6 italic">
                     По запросу <span className="text-foreground font-bold">«{searchQuery}»</span> записей не обнаружено.
                  </p>
                  <Button 
                    onClick={() => setSearchQuery("")}
                    className="h-10 px-8 rounded-full text-[13px] font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all border-0 shadow-none"
                  >
                    Сбросить поиск
                  </Button>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
