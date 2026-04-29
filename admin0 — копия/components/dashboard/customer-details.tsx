"use client";

import { useState } from "react";
import { 
  Phone, Mail, MapPin, Star, ChevronRight, Heart,
  History, Search, Filter, Trash2, AlertTriangle, X,
  Download, Printer, CreditCard, ChevronLeft, Utensils, Smartphone,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CUSTOMERS } from "@/mock-data/customers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AnimatedNumber } from "@/components/ui/animated-number";

const MOCK_ORDERS = Array.from({ length: 35 }).map((_, i) => ({
  id: `#${8421 - i}`,
  date: i === 0 ? "Сегодня, 12:45" : `${Math.max(1, 28 - Math.floor(i / 3))}.03.2026`,
  items: i % 2 === 0 ? "Salmon Set, California" : "Dragon Roll, Miso Soup",
  total: i % 3 === 0 ? "245,000" : "125,000",
  status: i === 0 ? "Готовится" : "Завершен",
  color: i === 0 ? "orange" : "green",
  details: [
    { name: "Salmon Set", price: "185 000", qty: 1 },
    { name: "California Roll", price: "60 000", qty: 1 },
  ],
  address: "ул. Амира Темура, 45, кв 12",
  payment: "Картой (Payme)",
}));

const FAVORITES = [
  { name: "Филадельфия Лайт", count: 12, price: "98 000", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200" },
  { name: "Калифорния Классик", count: 8, price: "15 000", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=200" },
  { name: "Запеченный окунь", count: 4, price: "450 000", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200" },
  { name: "Сет Самурай", count: 3, price: "115 000", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200" },
];

const PER_PAGE = 10;

export function CustomerDetails({ id }: { id: string }) {
  const customer = CUSTOMERS.find((c) => c.id === id);

  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "active">("all");
  const [page, setPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm text-muted-foreground">Клиент не найден</p>
        <Link href="/clients"><Button variant="outline" size="sm">Назад к списку</Button></Link>
      </div>
    );
  }

  const filtered = MOCK_ORDERS.filter((o) => {
    const s = orderSearch.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(s) || o.items.toLowerCase().includes(s);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && o.status === "Завершен") ||
      (statusFilter === "active" && o.status === "Готовится");
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">

      {/* ── Header ── */}
      <div className="h-16 sm:h-20 shrink-0 flex items-center justify-between px-3 sm:px-6 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <Link href="/clients">
            <Button variant="ghost" size="icon" className="size-8 sm:size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground transition-colors self-center">
              <ChevronLeft className="size-5 sm:size-6" />
            </Button>
          </Link>
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 sm:size-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[12px] sm:text-[14px] font-bold text-muted-foreground uppercase border border-black/5 dark:border-white/10 shrink-0">
              {customer.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] sm:text-[16px] font-bold leading-none tracking-tight truncate">{customer.name}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 font-medium truncate opacity-60 uppercase tracking-widest">#{customer.id} · {customer.level}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 sm:h-10 px-3 sm:px-4 text-[12px] sm:text-[13px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 rounded-full transition-colors"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="size-3.5 sm:size-4" />
            <span className="hidden sm:inline">Удалить</span>
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-none p-5 md:p-6">
        <div className="max-w-[1300px] mx-auto space-y-5">

          {/* Row 1: Info + Favorites */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

            {/* Contact Info */}
            <div className="lg:col-span-4 rounded-[2rem] border border-black/5 dark:border-white/10 bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col">
              <div className="p-5 sm:p-7 space-y-5 flex-1 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Персональные данные</p>
                {[
                  { icon: Phone, label: "Телефон", value: customer.phone },
                  { icon: Mail, label: "Email", value: customer.email },
                  { icon: MapPin, label: "Основной адрес", value: "ул. Амира Темура, 45, кв 12" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="size-10 rounded-[14px] bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <Icon className="size-4.5 text-muted-foreground/40" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest mb-0.5">{label}</p>
                      <p className="text-[13px] sm:text-[14px] font-bold truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/5 dark:border-white/10 grid grid-cols-2 divide-x divide-black/5 dark:divide-white/10 text-left">
                <div className="p-5 sm:p-6">
                  <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">Заказов</p>
                  <AnimatedNumber value={customer.totalOrders} className="text-xl sm:text-2xl font-black mt-1 tabular-nums" />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">Выручка</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <AnimatedNumber value={customer.totalSpent} className="text-xl sm:text-2xl font-black text-primary tabular-nums" />
                  </div>
                </div>
              </div>
              <div className="border-t border-black/5 dark:border-white/10 p-5 sm:p-6 flex items-center gap-4 bg-[#f2f2f7]/30 dark:bg-black/20 text-left">
                <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10">
                   <Star className="size-6 fill-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">Бонусная программа</p>
                  <p className="text-[15px] sm:text-[16px] font-black tabular-nums">12 450 <span className="text-[11px] text-muted-foreground/60">баллов</span></p>
                </div>
              </div>
            </div>

            {/* Favorite Items */}
            <div className="lg:col-span-8 rounded-[2.25rem] border border-black/5 dark:border-white/10 bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col text-left">
              <div className="px-6 sm:px-8 h-16 border-b border-black/5 dark:border-white/10 flex items-center gap-3 bg-[#f2f2f7]/30 dark:bg-black/20">
                <Heart className="size-4 text-red-500 fill-red-500" />
                <p className="text-[12px] font-bold uppercase tracking-widest">Популярное у клиента</p>
              </div>
              <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {FAVORITES.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] transition-all cursor-pointer group relative overflow-hidden">
                    <div className="size-16 rounded-[1.25rem] overflow-hidden bg-muted border border-border/30 relative shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md text-[10px] font-black text-primary border border-primary/10">
                        {item.count}X
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold truncate group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-[12px] text-muted-foreground/60 font-bold mt-0.5 tabular-nums">{item.price} <span className="text-[10px] opacity-40 uppercase">sum</span></p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground/20 group-hover:text-primary shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Order History */}
          <div className="rounded-[2.25rem] border border-black/5 dark:border-white/10 bg-white dark:bg-[#1c1c1e] overflow-hidden">
            {/* Table Header Controls */}
            <div className="h-auto min-h-16 px-4 sm:px-8 py-4 sm:py-0 border-b border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f2f2f7]/30 dark:bg-black/20">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <History className="size-4 text-primary shrink-0 hidden sm:block" />
                <p className="text-[12px] font-bold uppercase tracking-widest shrink-0">История заказов</p>
                <div className="hidden sm:block w-px h-5 bg-border mx-1" />
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 transition-colors" />
                  <Input
                    placeholder="Поиск по ID..."
                    value={orderSearch}
                    onChange={(e) => { setOrderSearch(e.target.value); setPage(1); }}
                    className="pl-9 h-9 w-full text-[13px] bg-black/5 dark:bg-white/10 border-0 rounded-full shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 font-medium"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={cn("h-9 flex-1 sm:flex-none px-4 text-[13px] font-bold border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-all shadow-none rounded-full shrink-0", statusFilter !== "all" && "bg-primary/10 text-primary")}>
                      <Filter className="size-3.5 mr-2" />
                      <span className="truncate">{statusFilter === "all" ? "Все статусы" : statusFilter === "completed" ? "Завершен" : "Активен"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1 border-border/80 bg-background/95 backdrop-blur-xl">
                    <DropdownMenuItem className="text-[12px] font-bold py-2.5 rounded-xl cursor-pointer" onClick={() => { setStatusFilter("all"); setPage(1); }}>Все заказы</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-[12px] font-bold py-2.5 rounded-xl cursor-pointer text-orange-600 focus:bg-orange-50" onClick={() => { setStatusFilter("active"); setPage(1); }}>Активные</DropdownMenuItem>
                    <DropdownMenuItem className="text-[12px] font-bold py-2.5 rounded-xl cursor-pointer text-green-600 focus:bg-green-50" onClick={() => { setStatusFilter("completed"); setPage(1); }}>Завершённые</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/10 border-0 shrink-0">
                  <Download className="size-4" />
                </Button>
              </div>
            </div>

            {/* Table (Desktop) */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-black/5 dark:border-white/10">
                    <TableHead className="h-12 pl-8 text-[11px] font-bold uppercase text-muted-foreground/50 w-24 tracking-widest">ID</TableHead>
                    <TableHead className="h-12 text-[11px] font-bold uppercase text-muted-foreground/50 w-36 tracking-widest">Дата</TableHead>
                    <TableHead className="h-12 text-[11px] font-bold uppercase text-muted-foreground/50 tracking-widest">Состав</TableHead>
                    <TableHead className="h-12 text-[11px] font-bold uppercase text-muted-foreground/50 text-right w-36 tracking-widest">Сумма</TableHead>
                    <TableHead className="h-12 text-[11px] font-bold uppercase text-muted-foreground/50 text-right pr-8 w-36 tracking-widest">Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-black/5 dark:divide-white/10">
                  {paginated.length > 0 ? paginated.map((order, i) => (
                    <TableRow
                      key={i}
                      className="h-14 border-none cursor-pointer hover:bg-muted/10 transition-colors group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <TableCell className="pl-8 text-[13px] font-bold tabular-nums text-muted-foreground/50">{order.id}</TableCell>
                      <TableCell className="text-[12px] font-bold text-foreground opacity-80">{order.date}</TableCell>
                      <TableCell className="text-[13px] font-bold max-w-[20rem] truncate">{order.items}</TableCell>
                      <TableCell className="text-right text-[13px] font-black tabular-nums text-foreground">{order.total}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-3">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-tight",
                            order.color === "orange"
                              ? "bg-orange-500/10 text-orange-600"
                              : "bg-green-500/10 text-green-600"
                          )}>
                            <span className={cn("size-1.5 rounded-full", order.color === "orange" ? "bg-orange-500" : "bg-green-500")} />
                            {order.status}
                          </span>
                          <ChevronRight className="size-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-[13px] font-medium text-muted-foreground flex items-center justify-center">
                        Заказы не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards (Order History) */}
            <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
              {paginated.length > 0 ? paginated.map((order, i) => (
                <div 
                  key={i} 
                  className="p-4 active:bg-black/5 dark:active:bg-white/5 transition-colors flex items-center justify-between gap-4"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-bold">{order.id}</span>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold",
                        order.color === "orange" ? "bg-orange-500/10 text-orange-600" : "bg-green-500/10 text-green-600"
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-foreground opacity-80 mb-0.5 truncate">{order.items}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{order.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="text-[14px] font-black tabular-nums">{order.total}</p>
                    <ChevronRight className="size-4 text-muted-foreground/20" />
                  </div>
                </div>
              )) : (
                <div className="h-32 flex items-center justify-center text-[13px] text-muted-foreground font-medium">
                   Заказы не найдены
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                <p className="text-[12px] text-muted-foreground/70 font-medium tracking-tight">
                  Стр. <span className="font-bold text-foreground">{page}</span> из {totalPages}
                </p>
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-[3px] rounded-[10px]">
                  <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="size-8 p-0 rounded-[7px] text-muted-foreground hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-none focus-visible:ring-0">
                    <ChevronLeft className="size-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "size-8 rounded-[7px] text-[12px] font-bold transition-all flex items-center justify-center",
                        page === i + 1
                          ? "bg-white dark:bg-zinc-800 text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="size-8 p-0 rounded-[7px] text-muted-foreground hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-none focus-visible:ring-0">
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Order Detail Sheet ── */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="w-[400px] p-0 border-l-0 bg-white dark:bg-[#1c1c1e] shadow-none [&>button]:hidden">
          {selectedOrder && (
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-5 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <SheetTitle className="text-[17px] font-semibold tracking-tight">Заказ {selectedOrder.id}</SheetTitle>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border-0",
                        selectedOrder.color === "orange"
                          ? "bg-orange-500/10 text-orange-600"
                          : "bg-green-500/10 text-green-600"
                      )}>
                        <span className={cn("size-1.5 rounded-full", selectedOrder.color === "orange" ? "bg-orange-500" : "bg-green-500")} />
                        {selectedOrder.status}
                      </span>
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
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest mb-3">Состав заказа</p>
                  <div className="space-y-2">
                    {selectedOrder.details.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-[1.25rem] border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-[10px] bg-white dark:bg-[#2c2c2e] border border-black/5 flex items-center justify-center text-[12px] font-semibold text-[#007aff] shrink-0">
                            {item.qty}x
                          </div>
                          <span className="text-[13px] font-bold">{item.name}</span>
                        </div>
                        <span className="text-[13px] font-bold tabular-nums">{item.price} сум</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest mb-3">Доставка и оплата</p>
                  <div className="rounded-[1.25rem] border border-black/5 dark:border-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10">
                    <div className="p-3.5 flex items-center gap-4">
                      <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <MapPin className="size-4 text-muted-foreground/60" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Адрес</p>
                        <p className="text-[13px] font-bold">{selectedOrder.address}</p>
                      </div>
                    </div>
                    <div className="p-3.5 flex items-center gap-4">
                      <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <CreditCard className="size-4 text-muted-foreground/60" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Оплата</p>
                        <p className="text-[13px] font-bold">{selectedOrder.payment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 dark:border-white/10 pt-5 space-y-3">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted-foreground font-medium">Товары</span>
                    <span className="font-bold tabular-nums">{selectedOrder.total} сум</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted-foreground font-medium">Доставка</span>
                    <span className="font-bold tabular-nums">15 000 сум</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-black/5 dark:border-white/10">
                    <span className="text-[13px] font-bold text-muted-foreground">Итого</span>
                    <span className="text-[18px] font-semibold text-primary tabular-nums">260 000 сум</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-black/5 dark:border-white/10 grid grid-cols-2 gap-3 bg-[#f2f2f7]/30 dark:bg-black/20">
                <Button variant="outline" className="h-[42px] rounded-xl font-bold text-[13px] gap-2 border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 shadow-none hover:text-foreground">
                  <Printer className="size-4" /> Печать
                </Button>
                <Button className="h-[42px] rounded-xl bg-[#007aff] text-white font-semibold text-[13px] shadow-none hover:bg-[#007aff]/90 transition-colors">
                  Повторить заказ
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Delete Confirmation ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-[340px] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 rounded-[1.5rem] overflow-hidden p-6 flex flex-col items-center text-center">
             <div className="size-14 rounded-[1.25rem] bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20">
               <AlertTriangle className="size-7 text-red-500" />
             </div>
             <h3 className="text-[17px] font-black tracking-tight mb-2">Удалить клиента?</h3>
             <p className="text-[13px] text-muted-foreground/80 leading-relaxed mb-6">
               <span className="text-foreground font-bold">{customer.name}</span> будет навсегда удалён из базы данных. Это действие <span className="font-bold underline decoration-red-500/30 underline-offset-2 text-foreground">нельзя отменить</span>.
             </p>
             <div className="w-full grid grid-cols-2 gap-3">
               <Button 
                 variant="outline" 
                 onClick={() => setShowDeleteConfirm(false)} 
                 className="h-[42px] rounded-xl font-bold text-[13px] border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 shadow-none text-foreground"
               >
                 Отмена
               </Button>
               <Button
                 onClick={() => { window.location.href = "/clients"; }}
                 className="h-[42px] rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-[13px] shadow-none border-0 transition-colors"
               >
                 Удалить
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
