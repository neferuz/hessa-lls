"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Filter, UtensilsCrossed, Activity, X, Package, TrendingUp, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import Image from "next/image";
import Link from "next/link";

const INITIAL_DISHES = [
  { id: "1", name: "Филадельфия Лайт", category: "Роллы", price: "32 000 сум", weight: "280г", status: "active", image: "/rolls.png", updatedAt: "Сегодня, 14:20" },
  { id: "2", name: "Калифорния краб", category: "Роллы", price: "28 000 сум", weight: "240г", status: "active", image: "/rolls.png", updatedAt: "Сегодня, 14:15" },
  { id: "3", name: "Запеченный окунь", category: "Горячее", price: "45 000 сум", weight: "320г", status: "inactive", image: "/rolls.png", updatedAt: "Вчера, 18:45" },
  { id: "4", name: "Сет Самурай", category: "Сеты", price: "120 000 сум", weight: "1200г", status: "active", image: "/sets.png", updatedAt: "14.04.2026" },
  { id: "5", name: "Кока-Кола 0.5", category: "Напитки", price: "8 000 сум", weight: "500мл", status: "active", image: "/drinks.png", updatedAt: "13.04.2026" },
];

export function DishesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<typeof INITIAL_DISHES[0] | null>(null);
  const [dishes, setDishes] = useState(INITIAL_DISHES);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showNotification = (message: string, type: "success" | "info" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleStatus = (id: string) => {
    setDishes(prev => prev.map(d => {
       if (d.id === id) {
          const newStatus = d.status === "active" ? "inactive" : "active";
          showNotification(
            newStatus === "active" ? `Блюдо «${d.name}» теперь видно клиентам` : `Блюдо «${d.name}» скрыто из меню`,
            newStatus === "active" ? "success" : "info"
          );
          return { ...d, status: newStatus };
       }
       return d;
    }));
  };

  const filtered = dishes.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Toolbar - Adaptive */}
      <div className="h-auto py-2.5 sm:h-16 sm:py-0 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                 <UtensilsCrossed className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Блюда меню</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground">
                {dishes.length}
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-black/5 dark:bg-white/10 border-0">
                      <Filter className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl p-1 border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1e] backdrop-blur-xl">
                    <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 focus:bg-black/5 dark:focus:bg-white/5" onClick={() => setStatusFilter("all")}>Все блюда</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 text-green-600 focus:bg-green-50" onClick={() => setStatusFilter("active")}>Активные</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 text-muted-foreground focus:bg-black/5" onClick={() => setStatusFilter("inactive")}>Скрытые</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
               <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                 <Plus className="size-4" strokeWidth={2.5} />
               </Button>
            </div>
          </div>
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          <div className="relative group w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 transition-colors" />
            <Input
              placeholder="Поиск по блюдам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[13px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary shadow-none transition-all"
            />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn(
                  "h-9 px-4 rounded-full text-[13px] font-bold border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors shadow-none",
                  statusFilter !== "all" && "bg-black/10 dark:bg-white/10 text-foreground"
                )}>
                  <Filter className="size-3.5 mr-1.5" />
                  {statusFilter === "all" ? "Все" : statusFilter === "active" ? "Активные" : "Скрытые"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-1 border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1e] backdrop-blur-xl">
                <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer transition-colors" onClick={() => setStatusFilter("all")}>Все блюда</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 text-green-600 focus:bg-green-50 dark:focus:bg-green-900/20 cursor-pointer transition-colors" onClick={() => setStatusFilter("active")}>Активные</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl text-[12px] font-bold py-2 text-muted-foreground focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer transition-colors" onClick={() => setStatusFilter("inactive")}>Скрытые</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none">
            <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Добавить блюдо
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 md:p-6 pb-20">
        <div className="max-w-[1300px] mx-auto space-y-4 sm:space-y-5">

          {/* Compact Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { label: "Всего блюд", value: dishes.length, icon: UtensilsCrossed, color: "text-primary", trend: "+2", isUp: true },
              { label: "Активных", value: dishes.filter(d => d.status === 'active').length, icon: Activity, color: "text-green-500", trend: "+5%", isUp: true },
              { label: "Скрытых", value: dishes.filter(d => d.status === 'inactive').length, icon: EyeOff, color: "text-muted-foreground", trend: "-1", isUp: false, className: "col-span-2 sm:col-span-1" },
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

          <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10">
            {/* Desktop Table View */}
            <Table className="hidden sm:table">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                  <TableHead className="h-11 pl-5 text-[11px] font-semibold uppercase text-muted-foreground/70">Блюдо</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase text-muted-foreground/70">Категория</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase text-muted-foreground/70 text-center">Вес</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase text-muted-foreground/70 text-right">Цена</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase text-muted-foreground/70 text-center">Статус</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase text-muted-foreground/70">Обновлено</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase text-muted-foreground/70 text-right pr-5">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-black/5 dark:divide-white/10">
                {filtered.map((dish) => (
                  <TableRow key={dish.id} className="h-16 border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                    <TableCell className="pl-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg border border-border/50 overflow-hidden bg-muted shrink-0 relative">
                          <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                        </div>
                        <p className="text-[13px] font-semibold">{dish.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge variant="outline" className="h-[22px] px-2 text-[11px] font-semibold border-0 bg-black/5 dark:bg-white/10 rounded-full">{dish.category}</Badge>
                    </TableCell>
                    <TableCell className="py-2.5 text-[13px] font-medium text-muted-foreground text-center tabular-nums">{dish.weight}</TableCell>
                    <TableCell className="py-2.5 text-right text-[13px] font-bold tabular-nums text-foreground">{dish.price}</TableCell>
                    <TableCell className="py-2.5 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center gap-1.5 h-[22px] px-2 rounded-full text-[10px] font-bold",
                        dish.status === "active"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                      )}>
                        <span className={cn("size-1.5 rounded-full", dish.status === "active" ? "bg-green-500" : "bg-zinc-400")} />
                        {dish.status === "active" ? "Активно" : "Скрыто"}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-[12px] text-muted-foreground font-medium tabular-nums">{dish.updatedAt}</TableCell>
                    <TableCell className="py-2.5 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dishes/${dish.id}`}>
                          <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground"><Edit2 className="size-4" /></Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                             e.stopPropagation();
                             toggleStatus(dish.id);
                          }}
                          className={cn(
                            "size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
                            dish.status === "active" ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {dish.status === "active" ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                             e.stopPropagation();
                             setSelectedDish(dish);
                             setIsDeleteDialogOpen(true);
                          }}
                          className="size-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Mobile Cards View */}
            <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
              {filtered.map((dish) => (
                <div key={dish.id} className="p-4 flex flex-col gap-4 active:bg-black/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-14 rounded-xl border border-black/5 overflow-hidden bg-muted relative shrink-0">
                        <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[14px] font-semibold leading-tight">{dish.name}</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-semibold border-0 bg-black/5 dark:bg-white/10 rounded-full">{dish.category}</Badge>
                           <span className="text-[11px] font-medium text-muted-foreground/60">{dish.weight}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <p className="text-[15px] font-bold tabular-nums">{dish.price}</p>
                       <span className={cn(
                        "inline-flex items-center gap-1.5 h-[20px] px-2 rounded-full text-[9px] font-semibold",
                        dish.status === "active" ? "bg-green-500/10 text-green-600" : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                      )}>
                        <span className={cn("size-1 rounded-full", dish.status === "active" ? "bg-green-500" : "bg-zinc-400")} />
                        {dish.status === "active" ? "Активно" : "Скрыто"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                     <p className="text-[11px] font-medium text-muted-foreground/40 italic">Обновлено {dish.updatedAt.toLowerCase()}</p>
                     <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="icon" className="size-9 rounded-full bg-black/5 dark:bg-white/10 text-muted-foreground"><Edit2 className="size-4" /></Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleStatus(dish.id)}
                          className={cn("size-9 rounded-full bg-black/5 dark:bg-white/10", dish.status === "active" ? "text-primary" : "text-muted-foreground")}
                        >
                          {dish.status === "active" ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setSelectedDish(dish); setIsDeleteDialogOpen(true); }}
                          className="size-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="h-[400px] flex flex-col items-center justify-center text-center bg-transparent">
                 <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6 relative group">
                    <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Search className="size-10 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                 </div>
                 <h3 className="text-[18px] font-semibold tracking-tight mb-2">Ничего не нашли</h3>
                 <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed mb-6">
                   По запросу <span className="text-foreground font-bold italic">«{searchQuery}»</span> блюд не обнаружено. Попробуйте другой запрос или сбросьте фильтры.
                 </p>
                 <Button 
                   onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                   className="rounded-xl h-[42px] px-8 font-bold text-[13px] bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 transition-colors border-0 shadow-none"
                 >
                   Сбросить поиск
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Notification UI */}
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 flex flex-col items-center pointer-events-none",
        notification ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      )}>
         <div className={cn(
           "px-6 py-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 flex items-center gap-3 pointer-events-auto",
           notification?.type === "success" && "border-green-500/20",
           notification?.type === "error" && "border-red-500/20"
         )}>
            <div className={cn(
              "size-2 rounded-full",
              notification?.type === "success" ? "bg-green-500" : notification?.type === "error" ? "bg-red-500" : "bg-blue-500"
            )} />
            <span className="text-[13px] font-bold tracking-tight text-foreground">{notification?.message}</span>
         </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[90vw] max-w-[340px] p-0 border-0 bg-transparent shadow-none focus:outline-none flex items-center justify-center pointer-events-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Удаление блюда</DialogTitle>
            <DialogDescription>Подтверждение удаления позиции из меню</DialogDescription>
          </DialogHeader>
          
          <div className="w-full bg-background/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-7 flex flex-col items-center gap-5 pointer-events-auto">
             
             {/* Warning Icon - Animated */}
             <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                
                <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 relative">
                   <Activity className="size-8 animate-pulse" strokeWidth={2.5} />
                </div>
             </div>
             
             <div className="text-center space-y-1.5 mt-1">
               <h3 className="text-[19px] font-semibold tracking-tight text-foreground">Удалить блюдо?</h3>
               <p className="text-[12.5px] font-medium text-muted-foreground/80 leading-snug px-2">
                 Блюдо <span className="text-foreground font-bold font-mono">«{selectedDish?.name}»</span> будет удалено из меню навсегда.
               </p>
             </div>
             
             <div className="flex gap-2.5 w-full mt-3">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-full h-11 font-bold text-[13px] border-border/40 hover:bg-muted/50 transition-colors bg-muted/5 shadow-none" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                   Нет
                </Button>
                <Button 
                  className="flex-1 rounded-full h-11 font-semibold text-[13px] bg-red-500 hover:bg-red-600 border-0 text-white transition-all active:scale-[0.96]" 
                  onClick={() => { 
                    setIsDeleteDialogOpen(false); 
                    const dishName = selectedDish?.name;
                    setSelectedDish(null);
                    showNotification(`Блюдо «${dishName}» успешно удалено`, "success");
                  }}
                >
                   Да, удалить
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
