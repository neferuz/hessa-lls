"use client";

import { useState } from "react";
import { Search, ShoppingCart, Clock, CreditCard, MapPin, User, ChevronRight, Package, Truck, X, ArrowUpRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PeriodFilter } from "@/components/ui/period-filter";

const STATUS_MAP = {
  new:        { label: "Новый",      dot: "bg-blue-500",   bg: "bg-blue-500/10 text-blue-600" },
  cooking:    { label: "Готовится",   dot: "bg-orange-500", bg: "bg-orange-500/10 text-orange-600" },
  ready:      { label: "Готов",       dot: "bg-purple-500", bg: "bg-purple-500/10 text-purple-600" },
  delivering: { label: "Доставка",   dot: "bg-yellow-500", bg: "bg-yellow-500/10 text-yellow-600" },
  done:       { label: "Завершён",   dot: "bg-green-500",  bg: "bg-green-500/10 text-green-600" },
  cancelled:  { label: "Отменён",    dot: "bg-red-500",    bg: "bg-red-500/10 text-red-500" },
} as const;

const MOCK_ORDERS = [
  { id: "1024", customer: "Алексей И.", phone: "+998 90 123 45 67", items: ["Филадельфия Лайт × 2", "Кока-Кола × 1"], total: "72 000", date: "Сегодня, 14:20", status: "cooking" as const, address: "ул. Амира Темура, 45", payment: "Payme" },
  { id: "1023", customer: "Марина К.", phone: "+998 93 444 22 11", items: ["Сет Самурай × 1", "Имбирь доп. × 2"], total: "128 000", date: "Сегодня, 13:50", status: "delivering" as const, address: "Чиланзар, 12 квартал", payment: "Наличными" },
  { id: "1022", customer: "Джамшид У.", phone: "+998 97 777 00 00", items: ["Калифорния × 3", "Запеченный окунь × 1"], total: "105 000", date: "Сегодня, 13:10", status: "done" as const, address: "Юнусабад, ул. 1", payment: "Uzcard" },
  { id: "1021", customer: "Лола С.", phone: "+998 90 999 88 77", items: ["Ролл Дракон × 1", "Моти × 2"], total: "54 000", date: "Сегодня, 12:45", status: "new" as const, address: "Мирзо-Улугбек, 22", payment: "Click" },
  { id: "1020", customer: "Санжар Р.", phone: "+998 91 555 33 22", items: ["Сет Токио × 1"], total: "210 000", date: "Сегодня, 12:00", status: "cancelled" as const, address: "Яккасарай, 7", payment: "Payme" },
];

const STATUS_TABS = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "cooking", label: "Готовятся" },
  { key: "delivering", label: "Доставка" },
  { key: "done", label: "Завершённые" },
];

function StatusBadge({ status }: { status: keyof typeof STATUS_MAP }) {
  const s = STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border-0", s.bg)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function OrdersContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch =
      o.id.includes(searchQuery) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    const matchStatus = statusTab === "all" || o.status === statusTab;
    return matchSearch && matchStatus;
  });

  const totalRevenue = MOCK_ORDERS.reduce((a, o) => a + parseInt(o.total.replace(/\s/g, ""), 10), 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">

      {/* Toolbar - Adaptive (StopList Style on Desktop) */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <ShoppingCart className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Список заказов</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                {filtered.length}
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <PeriodFilter isCompact />
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative group w-full sm:w-[260px] px-0.5 sm:px-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
            />
          </div>
        </div>
        
        <div className="hidden sm:block">
           <PeriodFilter />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 md:p-6">
        <div className="max-w-[1300px] mx-auto space-y-4 sm:space-y-5">

          {/* Compact Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { label: "Заказов", value: MOCK_ORDERS.length, icon: ShoppingCart, color: "text-primary", trend: "+12%", isUp: true },
              { label: "В работе", value: MOCK_ORDERS.filter(o => o.status !== "done" && o.status !== "cancelled").length, icon: Clock, color: "text-orange-500", trend: "+2", isUp: false },
              { label: "Выручка", value: totalRevenue.toLocaleString("ru-RU"), icon: CreditCard, color: "text-green-500", trend: "+24%", isUp: true, className: "col-span-2 sm:col-span-1" },
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
                    <AnimatedNumber value={s.value} className="text-[16px] sm:text-[18px] font-bold tracking-tight tabular-nums" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Tabs - Scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-none pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-full w-fit">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusTab(tab.key)}
                  className={cn(
                    "px-4 h-7 rounded-full text-[11px] font-bold transition-all whitespace-nowrap",
                    statusTab === tab.key
                      ? "bg-white dark:bg-[#2c2c2e] text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                      : "text-muted-foreground/60 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table / Mobile Cards */}
          {filtered.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
               <div className="size-20 sm:size-24 rounded-[2rem] sm:rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-5 sm:mb-6">
                  <Search className="size-8 sm:size-10 text-muted-foreground/40" />
               </div>
               <h3 className="text-[16px] sm:text-[18px] font-black tracking-tight mb-2">Заказы не найдены</h3>
               <p className="text-[12px] sm:text-[13px] text-muted-foreground/70 max-w-[240px] sm:max-w-[280px] leading-relaxed mb-6">
                 Попробуйте другой запрос или сбросьте фильтры.
               </p>
               <Button 
                 onClick={() => { setSearchQuery(""); setStatusTab("all"); }}
                 className="rounded-xl h-[42px] px-8 font-bold text-[13px] bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 transition-colors border-0 shadow-none"
               >
                 Сбросить
               </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                    <tr>
                      <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 w-24">№ Заказа</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Клиент</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Состав</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-28">Сумма</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 w-28">Статус</th>
                      <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-36">Время</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {filtered.map((order) => (
                      <tr
                        key={order.id}
                        className="group cursor-pointer hover:bg-muted/20 transition-colors"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-2.5 px-5 text-[13px] font-bold tabular-nums">#{order.id}</td>
                        <td className="py-2.5 px-4">
                          <p className="text-[13px] font-bold leading-none">{order.customer}</p>
                          <p className="text-[11px] text-muted-foreground/60 font-medium mt-0.5">{order.phone}</p>
                        </td>
                        <td className="py-2.5 px-4 text-[12px] font-medium text-muted-foreground/70 max-w-[220px] truncate">
                          {order.items[0]}{order.items.length > 1 ? ` +${order.items.length - 1}` : ""}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[13px] font-bold tabular-nums">{order.total} сум</td>
                        <td className="py-2.5 px-4"><StatusBadge status={order.status} /></td>
                        <td className="py-2.5 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-muted-foreground/60 font-medium">{order.date}</span>
                            <ChevronRight className="size-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {filtered.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="p-4 rounded-[1.25rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                         <span className="text-[13px] font-black text-primary">#{order.id}</span>
                         <div className="w-px h-3 bg-black/5 dark:bg-white/10" />
                         <span className="text-[11px] font-bold text-muted-foreground/60">{order.date.split(",")[1]}</span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    
                    <div className="space-y-1 mb-4">
                       <p className="text-[14px] font-bold">{order.customer}</p>
                       <p className="text-[11px] font-medium text-muted-foreground/60">{order.items.join(", ")}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10">
                       <span className="text-[11px] font-bold uppercase text-muted-foreground/40 tracking-wider">Сумма</span>
                       <span className="text-[15px] font-black tabular-nums">{order.total} сум</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent side="right" className="w-[100vw] sm:w-[400px] p-0 border-l-0 bg-white dark:bg-[#1c1c1e] shadow-none [&>button]:hidden px-safe">
          {selectedOrder && (
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-5 border-b border-black/5 dark:border-white/10 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <SheetTitle className="text-[17px] font-black tracking-tight">Заказ #{selectedOrder.id}</SheetTitle>
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 font-medium mt-1">{selectedOrder.date}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="size-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="size-4 text-muted-foreground" />
                  </button>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Customer */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest mb-3">Клиент</p>
                  <div className="rounded-[1.25rem] border border-black/5 dark:border-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10">
                    <div className="p-3.5 flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <User className="size-3.5 text-muted-foreground/60" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-bold">{selectedOrder.customer}</p>
                          <button className="text-muted-foreground/40 hover:text-primary transition-colors">
                            <ArrowUpRight className="size-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground/60 font-medium">{selectedOrder.phone}</p>
                      </div>
                    </div>
                    <div className="p-3.5 flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <MapPin className="size-3.5 text-muted-foreground/60" />
                      </div>
                      <p className="text-[13px] font-bold">{selectedOrder.address}</p>
                    </div>
                    <div className="p-3.5 flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <CreditCard className="size-3.5 text-muted-foreground/60" />
                      </div>
                      <p className="text-[13px] font-bold">{selectedOrder.payment}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest mb-3">Состав заказа</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-[1.25rem] border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <Package className="size-3.5 text-muted-foreground/60" />
                          </div>
                          <span className="text-[13px] font-bold">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-muted-foreground">Итого</span>
                  <span className="text-[18px] font-black tabular-nums">{selectedOrder.total} сум</span>
                </div>
              </div>

              {/* Status Actions */}
              {selectedOrder.status !== "done" && selectedOrder.status !== "cancelled" && (
                <div className="p-5 border-t border-black/5 dark:border-white/10">
                  <Button className="w-full h-[42px] rounded-xl bg-[#007aff] text-white font-black text-[13px] shadow-none hover:bg-[#007aff]/90 transition-colors">
                    {selectedOrder.status === "new" ? "Принять в работу" :
                     selectedOrder.status === "cooking" ? "Готов к выдаче" :
                     selectedOrder.status === "ready" ? "Передать курьеру" :
                     "Подтвердить доставку"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
