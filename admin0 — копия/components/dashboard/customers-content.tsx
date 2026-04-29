"use client";

import { useState } from "react";
import { 
  Search, Plus, Filter, Users, Phone,
  ShoppingBag, User, ShieldAlert, Download, ChevronRight,
  Activity, Star, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CUSTOMERS } from "@/mock-data/customers";
import { useRouter } from "next/navigation";
import { AnimatedNumber } from "@/components/ui/animated-number";

export function CustomersContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = CUSTOMERS.filter((c) => {
    const s = searchQuery.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(s) || c.phone.includes(s);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Всего клиентов", value: CUSTOMERS.length, icon: Users, color: "text-primary" },
    { label: "Всего заказов", value: CUSTOMERS.reduce((a, c) => a + c.totalOrders, 0), icon: ShoppingBag, color: "text-blue-500" },
    { label: "Лояльность", value: "78%", icon: User, color: "text-green-500" },
    { label: "Заблокировано", value: CUSTOMERS.filter((c) => c.status === "inactive").length, icon: ShieldAlert, color: "text-amber-500" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">

      {/* Toolbar — adaptive layout (Categories/StopList Style) */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Users className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">База клиентов</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                {filtered.length}
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                 <Plus className="size-4" strokeWidth={2.5} />
               </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0">
            <div className="relative group flex-1 sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Поиск клиентов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
              />
            </div>
            
            <div className="sm:hidden">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border-0">
                      <Filter className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl p-1 border-black/5 bg-[#fefefe] dark:bg-[#1c1c1e] backdrop-blur-2xl">
                    <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 px-3 focus:bg-muted" onClick={() => setStatusFilter("all")}>Все клиенты</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 px-3 text-green-600 focus:bg-green-50" onClick={() => setStatusFilter("active")}>Активные</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 px-3 text-red-500 focus:bg-red-50" onClick={() => setStatusFilter("inactive")}>Заблокированные</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2.5">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border-0 hidden sm:flex", statusFilter !== 'all' && "text-primary bg-primary/10")}>
                  <Filter className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-1 border-black/5 bg-[#fefefe] dark:bg-[#1c1c1e] backdrop-blur-2xl">
                <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 px-3 focus:bg-muted" onClick={() => setStatusFilter("all")}>Все клиенты</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 px-3 text-green-600 focus:bg-green-50" onClick={() => setStatusFilter("active")}>Активные</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 px-3 text-red-500 focus:bg-red-50" onClick={() => setStatusFilter("inactive")}>Заблокированные</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border-0 hidden sm:flex">
              <Download className="size-4 text-muted-foreground" />
            </Button>
            <Button size="sm" className="hidden sm:flex h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none">
              <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Добавить
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 md:p-5 pb-20">
        <div className="max-w-[1300px] mx-auto space-y-5">

          {/* Compact Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { label: "Всего клиентов", value: 120, icon: Users, color: "text-primary", trend: "+12", isUp: true },
              { label: "Активных (30д)", value: 85, icon: Activity, color: "text-green-500", trend: "+8%", isUp: true },
              { label: "Новых сегодня", value: 42, icon: Star, color: "text-orange-500", trend: "+2", isUp: true },
              { label: "Средний чек", value: 68000, icon: CreditCard, color: "text-muted-foreground", trend: "-2%", isUp: false, suffix: " сум" },
            ].map((s) => (
              <div key={s.label} className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left">
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
                    <AnimatedNumber value={s.value} className="text-[18px] sm:text-[20px] font-black tracking-tight" />
                    {s.suffix && <span className="text-[11px] font-bold text-muted-foreground/40">{s.suffix}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table / Mobile Cards View */}
          {filtered.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
               <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                  <Search className="size-10 text-muted-foreground/40" />
               </div>
               <h3 className="text-[18px] font-semibold tracking-tight mb-2">Клиенты не найдены</h3>
               <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed mb-6">
                 По запросу <span className="text-foreground font-semibold italic">«{searchQuery}»</span> записей не обнаружено.
               </p>
               <Button 
                 onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                 className="rounded-xl h-[42px] px-8 font-bold text-[13px] bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 transition-colors border-0 shadow-none"
               >
                 Сбросить
               </Button>
            </div>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className="hidden sm:block rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 shadow-none">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                    <tr>
                      <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Клиент</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Телефон</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right">Заказов</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right">Выручка</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 w-28">Статус</th>
                      <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-36">Последний заказ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {filtered.map((customer) => (
                      <tr
                        key={customer.id}
                        className="group cursor-pointer hover:bg-muted/20 transition-colors"
                        onClick={() => router.push(`/clients/${customer.id}`)}
                      >
                        <td className="py-2.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/10">
                              <span className="text-[13px] font-bold text-muted-foreground uppercase">{customer.avatar}</span>
                            </div>
                            <div>
                              <p className="text-[13px] font-bold leading-none">{customer.name}</p>
                              <p className="text-[10px] font-bold text-primary/70 mt-1">{customer.level}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <Phone className="size-3 text-muted-foreground/40" />
                            <span className="text-[13px] font-medium text-foreground">{customer.phone}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[13px] font-bold">{customer.totalOrders}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[13px] font-bold tabular-nums text-foreground">{customer.totalSpent} сум</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border-0",
                            customer.status === "active"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-500"
                          )}>
                            <span className={cn("size-1.5 rounded-full", customer.status === "active" ? "bg-green-500" : "bg-red-500")} />
                            {customer.status === "active" ? "Активен" : "Заблокирован"}
                          </span>
                        </td>
                        <td className="py-2.5 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-muted-foreground/60 font-medium">{customer.lastOrder}</span>
                            <ChevronRight className="size-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View Cards */}
              <div className="sm:hidden space-y-3">
                {filtered.map((customer) => (
                  <div 
                    key={customer.id}
                    onClick={() => router.push(`/clients/${customer.id}`)}
                    className="p-4 rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10">
                           <span className="text-[14px] font-black text-muted-foreground uppercase">{customer.avatar}</span>
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[14px] font-black">{customer.name}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#007aff]">{customer.level}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "h-6 px-2.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1",
                        customer.status === "active" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                      )}>
                        <div className={cn("size-1 rounded-full", customer.status === "active" ? "bg-green-500" : "bg-red-500")} />
                        {customer.status === "active" ? "Ok" : "Ban"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                       <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 rounded-xl">
                          <p className="text-[9px] font-bold text-muted-foreground/40 uppercase mb-1">Заказов</p>
                          <p className="text-[14px] font-black tabular-nums">{customer.totalOrders}</p>
                       </div>
                       <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 rounded-xl">
                          <p className="text-[9px] font-bold text-muted-foreground/40 uppercase mb-1">Выручка</p>
                          <p className="text-[14px] font-black tabular-nums">{customer.totalSpent.split(' ')[0]}k</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/5">
                       <div className="flex items-center gap-1.5 text-muted-foreground/50">
                          <Phone className="size-3" />
                          <span className="text-[11px] font-bold">{customer.phone}</span>
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground/30 italic">Был {customer.lastOrder.toLowerCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
