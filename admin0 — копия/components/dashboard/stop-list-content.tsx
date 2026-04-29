"use client";

import { useState } from "react";
import { 
  Search, Plus, X, RotateCcw, Ban, ChevronRight, Activity,
  Package, AlertTriangle, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

const INITIAL_STOP_LIST = [
  { id: "3", name: "Запеченный окунь", category: "Горячее", price: "45 000 сум", stoppedAt: "2 часа назад", image: "/rolls.png", reason: "Нет рыбы" },
  { id: "10", name: "Ролл Дракон", category: "Роллы", price: "38 000 сум", stoppedAt: "Вчера, 18:00", image: "/rolls.png", reason: "Закончился угорь" },
  { id: "15", name: "Кола 0.5", category: "Напитки", price: "8 000 сум", stoppedAt: "Сегодня, 10:30", image: "/drinks.png", reason: "Нет поставки" },
];

const AVAILABLE_DISHES = [
  { id: "1", name: "Филадельфия Лайт", category: "Роллы", price: "32 000 сум", image: "/rolls.png" },
  { id: "2", name: "Калифорния краб", category: "Роллы", price: "28 000 сум", image: "/rolls.png" },
  { id: "4", name: "Сет Самурай", category: "Сеты", price: "120 000 сум", image: "/sets.png" },
  { id: "5", name: "Кока-Кола 0.5", category: "Напитки", price: "8 000 сум", image: "/drinks.png" },
];

export function StopListContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState(INITIAL_STOP_LIST);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<typeof INITIAL_STOP_LIST[0] | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = items.filter((i) => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReturn = () => {
    if (!restoreTarget) return;
    setItems(items.filter(item => item.id !== restoreTarget.id));
    showNotification(`«${restoreTarget.name}» возвращено в меню`, "success");
    setIsRestoreDialogOpen(false);
    setRestoreTarget(null);
  };

  const handleAdd = () => {
    const dish = AVAILABLE_DISHES.find((d) => d.id === selectedDishId);
    if (!dish) return;
    setItems([{ ...dish, stoppedAt: "Только что", reason: reason || "Причина не указана" }, ...items]);
    setIsAddOpen(false);
    setSelectedDishId(null);
    setReason("");
    showNotification(`«${dish.name}» добавлено в стоп-лист`, "error");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Toolbar — adaptive */}
      <div className="h-auto py-2.5 sm:h-16 sm:py-0 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <Ban className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Стоп-лист</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground">
                {filtered.length}
              </Badge>
            </div>
            
            <div className="sm:hidden">
               <Button 
                onClick={() => setIsAddOpen(true)}
                size="sm" 
                className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black"
              >
                <Plus className="size-4" strokeWidth={2.5} />
              </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative group w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 transition-colors" />
            <Input
              placeholder="Поиск по стоп-листу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[13px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary shadow-none transition-all"
            />
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <Button 
            onClick={() => setIsAddOpen(true)}
            size="sm" 
            className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none"
          >
            <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Добавить
          </Button>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 md:p-6">
        <div className="max-w-[1300px] mx-auto space-y-4 sm:space-y-5">

          {/* Compact Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { label: "В стоп-листе", value: items.length, icon: Ban, color: "text-red-500", trend: "+1", isUp: false },
              { label: "Затронуто", value: new Set(items.map(i => i.category)).size, icon: Package, color: "text-orange-500", trend: "0", isUp: true },
              { label: "Потери", value: "91 000", icon: CreditCard, color: "text-muted-foreground", trend: "-5%", isUp: true, className: "col-span-2 sm:col-span-1" },
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
                    <AnimatedNumber value={s.value} className="text-[17px] sm:text-[18px] font-bold tracking-tight tabular-nums" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 ? (
            /* Empty State */
            <div className="h-[300px] sm:h-[400px] flex flex-col items-center justify-center text-center bg-transparent">
               <div className="size-20 sm:size-24 rounded-[2rem] sm:rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-5 sm:mb-6 relative group">
                  <div className="absolute inset-0 bg-green-500/5 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Ban className="size-8 sm:size-10 text-muted-foreground/40 group-hover:text-green-500/40 transition-colors" />
               </div>
               <h3 className="text-[16px] sm:text-[18px] font-bold tracking-tight mb-2">Стоп-лист пуст</h3>
               <p className="text-[12px] sm:text-[13px] text-muted-foreground/70 max-w-[240px] sm:max-w-[280px] leading-relaxed mb-6">
                 Все позиции доступны для продажи. Система работает штатно.
               </p>
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10">
              {/* Desktop View Table */}
              <table className="hidden sm:table w-full text-left border-collapse">
                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                  <tr>
                    <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Позиция</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Раздел</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Причина</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-28">Время</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-28">Цена</th>
                    <th className="py-3 pr-5 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {filtered.map(item => (
                    <tr 
                      key={item.id} 
                      onClick={() => { setRestoreTarget(item); setIsRestoreDialogOpen(true); }}
                      className="group cursor-pointer hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-2.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl overflow-hidden bg-muted border border-border/30 group-hover:border-border/60 transition-colors relative">
                            <img 
                              src={item.image} 
                              className="w-full h-full object-cover opacity-50 grayscale" 
                              alt="" 
                            />
                            <div className="absolute inset-0 bg-red-500/10" />
                          </div>
                          <span className="text-[13px] font-bold text-foreground/60 line-through">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-[12px] font-medium text-muted-foreground/70">{item.category}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-red-500" />
                          <span className="text-[12px] font-bold text-red-600/70">{item.reason}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-[13px] font-medium text-right tabular-nums text-muted-foreground">{item.stoppedAt}</td>
                      <td className="py-2.5 px-4 text-[13px] font-bold text-foreground/40 text-right tabular-nums line-through">{item.price}</td>
                      <td className="py-2.5 pr-5 text-right">
                         <div className="size-7 rounded-full flex items-center justify-center hover:bg-muted ml-auto transition-colors">
                           <ChevronRight className="size-4 text-muted-foreground" />
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
                {filtered.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => { setRestoreTarget(item); setIsRestoreDialogOpen(true); }}
                    className="p-4 flex flex-col gap-3 active:bg-black/5 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                          <div className="size-12 rounded-[1rem] overflow-hidden bg-muted border border-black/5 shrink-0 relative">
                            <img src={item.image} className="w-full h-full object-cover grayscale opacity-60" alt="" />
                            <div className="absolute inset-0 bg-red-500/10" />
                          </div>
                          <div className="space-y-0.5">
                             <p className="text-[13px] font-bold line-through text-muted-foreground/60">{item.name}</p>
                             <p className="text-[11px] font-medium text-muted-foreground/40">{item.category}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[13px] font-bold text-red-500/80">{item.price}</p>
                          <p className="text-[10px] font-medium text-muted-foreground/40">{item.stoppedAt}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-red-500/5 border border-red-500/10">
                       <div className="flex items-center gap-2">
                          <AlertTriangle className="size-3 text-red-500" />
                          <span className="text-[11px] font-bold text-red-600/70">{item.reason}</span>
                       </div>
                       <RotateCcw className="size-3.5 text-red-500/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sheet — Add to stop list (same structure as categories Sheet) */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent side="right" className="w-[100vw] sm:max-w-[420px] p-0 border-l border-black/5 dark:border-white/10 bg-[#f2f2f7] dark:bg-zinc-900 flex flex-col pointer-events-auto [&>button]:hidden">
          <SheetHeader className="sr-only">
             <SheetTitle>Остановить продажи</SheetTitle>
             <SheetDescription>Добавление в стоп-лист</SheetDescription>
          </SheetHeader>

          <div className="w-full flex-1 overflow-y-auto scrollbar-none flex flex-col relative px-5 py-8">
             
             {/* Close Button */}
             <button 
               onClick={() => setIsAddOpen(false)}
               className="absolute top-4 left-4 size-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors z-10"
             >
               <X className="size-4 text-foreground/70" />
             </button>

             {/* Top Center Square Logo */}
             <div className="flex justify-center mt-2 mb-6">
                <div className="size-20 rounded-[1.4rem] overflow-hidden border border-border/40 relative group cursor-pointer bg-background flex items-center justify-center">
                   {selectedDishId ? (
                     <img 
                       src={AVAILABLE_DISHES.find(d => d.id === selectedDishId)?.image} 
                       className="w-full h-full object-cover" 
                       alt="" 
                     />
                   ) : (
                     <Ban className="size-8 text-red-500/40" />
                   )}
                </div>
             </div>

             {/* Header Text */}
             <div className="text-center mb-6 px-4">
                <h2 className="text-[22px] font-black tracking-tight leading-tight text-foreground mb-1.5 flex items-center justify-center gap-2">
                    Добавить в стоп
                </h2>
                <p className="text-[13px] font-medium text-foreground/60 leading-snug">
                    Выберите блюдо для временного исключения из меню
                </p>
             </div>

             {/* Group 1: General Info */}
             <div className="bg-background rounded-[1.5rem] overflow-hidden border border-border/40">
                
                {/* Dish Row */}
                <div className="flex items-center justify-between p-4 px-5 border-b border-border/40 min-h-[50px]">
                   <span className="text-[14px] font-medium text-foreground">Позиция</span>
                   <select
                     className="h-8 max-w-[180px] text-right text-[14px] font-bold border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none text-foreground outline-none appearance-none cursor-pointer"
                     value={selectedDishId ?? ""}
                     onChange={(e) => setSelectedDishId(e.target.value)}
                   >
                     <option value="" disabled>Выберите блюдо...</option>
                     {AVAILABLE_DISHES.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                   </select>
                </div>

                {/* Reason Row */}
                <div className="flex items-center justify-between p-4 px-5 min-h-[50px]">
                   <span className="text-[14px] font-medium text-foreground">Причина</span>
                   <Input 
                      placeholder="Укажите причину..." 
                      value={reason} 
                      onChange={(e) => setReason(e.target.value)} 
                      className="h-8 w-[180px] text-right text-[14px] font-bold border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none text-foreground placeholder:text-muted-foreground" 
                   />
                </div>
             </div>
             
             {/* Instruction Text */}
             <p className="px-5 mt-2 mb-4 text-[12px] text-muted-foreground/80 font-medium">Это блюдо будет скрыто у всех клиентов в приложении и на сайте.</p>

             {/* Bottom Buttons */}
             <div className="flex items-center gap-2 w-full mt-auto pt-6 pb-2">
                <Button 
                  variant="ghost"
                  className="flex-1 h-[42px] rounded-xl font-bold text-[13px] text-foreground bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors border-0"
                  onClick={() => setIsAddOpen(false)}
                >
                   Отмена
                </Button>
                <Button 
                  disabled={!selectedDishId}
                  onClick={handleAdd}
                  className="flex-1 h-[42px] rounded-xl font-bold text-[13px] bg-red-600 text-white hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-30"
                >
                   Исключить
                </Button>
             </div>

          </div>
        </SheetContent>
      </Sheet>

      {/* Restore Confirmation Dialog — same as categories delete dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="w-[90vw] max-w-[340px] p-0 border-0 bg-transparent shadow-none focus:outline-none flex items-center justify-center pointer-events-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Восстановление</DialogTitle>
            <DialogDescription>Подтверждение действия</DialogDescription>
          </DialogHeader>
          
          <div className="w-full bg-background/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-7 flex flex-col items-center gap-5 pointer-events-auto">
             
             {/* Icon */}
             <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                
                <div className="size-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 relative">
                   <RotateCcw className="size-8 animate-pulse" strokeWidth={2.5} />
                </div>
             </div>
             
             <div className="text-center space-y-1.5 mt-1">
               <h3 className="text-[19px] font-black tracking-tight text-foreground">Восстановить?</h3>
               <p className="text-[12.5px] font-medium text-muted-foreground/80 leading-snug px-2">
                 Позиция <span className="text-foreground font-bold font-mono">«{restoreTarget?.name}»</span> будет возвращена в меню.
               </p>
             </div>
             
             <div className="flex gap-2.5 w-full mt-3">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-full h-11 font-bold text-[13px] border-border/40 hover:bg-muted/50 transition-colors bg-muted/5 shadow-none" 
                  onClick={() => setIsRestoreDialogOpen(false)}
                >
                   Нет
                </Button>
                <Button 
                  className="flex-1 rounded-full h-11 font-black text-[13px] bg-[#007aff] hover:bg-[#007aff]/90 border-0 text-white transition-all active:scale-[0.96]" 
                  onClick={handleReturn}
                >
                   Да, восстановить
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Toast */}
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 flex flex-col items-center pointer-events-none",
        notification ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      )}>
         <div className={cn(
           "px-6 py-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 flex items-center gap-3 pointer-events-auto shrink-0",
           notification?.type === "success" && "border-green-500/20",
           notification?.type === "error" && "border-red-500/20"
         )}>
            <div className={cn(
               "size-2 rounded-full",
               notification?.type === "success" ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-[13px] font-black tracking-wide text-foreground">{notification?.message}</span>
         </div>
      </div>

    </div>
  );
}
