"use client";

import { useState } from "react";
import { 
  Search, Filter, Plus, LayoutGrid, List, Layers, 
  Package, TrendingUp, Image as ImageIcon, ChevronRight, Settings2, Activity, X,
  ShoppingBag, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";

const MOCK_CATEGORIES = [
  { id: "1", name: "Фирменные Роллы", slug: "signature-rolls", itemCount: 24, status: "active" as const, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800", revenue: "4.2M" },
  { id: "2", name: "Премиум Сеты", slug: "premium-sets", itemCount: 12, status: "active" as const, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800", revenue: "8.1M" },
  { id: "3", name: "Напитки и Чаи", slug: "beverages", itemCount: 18, status: "active" as const, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800", revenue: "1.8M" },
  { id: "4", name: "Горячие закуски", slug: "hot-snacks", itemCount: 8, status: "inactive" as const, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800", revenue: "960K" },
  { id: "5", name: "Супы", slug: "soups", itemCount: 6, status: "active" as const, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800", revenue: "1.1M" },
  { id: "6", name: "Десерты", slug: "desserts", itemCount: 10, status: "active" as const, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800", revenue: "2.3M" },
  { id: "7", name: "WOK Лапша", slug: "wok", itemCount: 15, status: "active" as const, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800", revenue: "3.5M" },
  { id: "8", name: "Свежие Салаты", slug: "salads", itemCount: 7, status: "inactive" as const, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", revenue: "420K" },
];

function StatusBadge({ status, overlay }: { status: "active" | "inactive", overlay?: boolean }) {
  if (status === "active") {
     return (
       <Badge variant="outline" className={cn("h-[22px] px-2 text-[10px] font-bold rounded-full border-0", overlay ? "bg-black/40 backdrop-blur-md text-green-400" : "bg-green-500/10 text-green-600 dark:border-green-900/50")}>
         <span className="size-1.5 rounded-full bg-green-500 mr-1.5" /> Активен
       </Badge>
     );
  }
  return (
    <Badge variant="outline" className={cn("h-[22px] px-2 text-[10px] font-bold rounded-full flex items-center justify-center border-0", overlay ? "bg-black/40 backdrop-blur-md text-white/70" : "bg-muted text-muted-foreground border-border/50")}>
         <span className="size-1.5 rounded-full bg-slate-400 mr-1.5" /> Скрыт
    </Badge>
  );
}

export function CategoriesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedCat, setSelectedCat] = useState<typeof MOCK_CATEGORIES[0] | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filtered = MOCK_CATEGORIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Search & Actions Toolbar - Adaptive */}
      <div className="h-auto py-2.5 sm:h-16 sm:py-0 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Layers className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Категории</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground">
                {filtered.length}
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <div className="flex items-center p-[2px] bg-black/5 dark:bg-white/10 rounded-lg">
                <button onClick={() => setViewMode("list")} className={cn("p-1 transition-all rounded-[6px]", viewMode === "list" ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-muted-foreground")}><List className="size-3.5" /></button>
                <button onClick={() => setViewMode("grid")} className={cn("p-1 transition-all rounded-[6px]", viewMode === "grid" ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-muted-foreground")}><LayoutGrid className="size-3.5" /></button>
               </div>
               <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                 <Plus className="size-4" strokeWidth={2.5} />
               </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative group w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 transition-colors" />
            <Input
              placeholder="Поиск по разделам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[13px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary shadow-none transition-all"
            />
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center p-[3px] bg-black/5 dark:bg-white/10 rounded-[10px]">
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 px-3 rounded-[7px] transition-all flex items-center justify-center", viewMode === "list" ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <List className="size-4" />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 px-3 rounded-[7px] transition-all flex items-center justify-center", viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-9 px-4 rounded-full text-[13px] font-bold border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors shadow-none", statusFilter !== 'all' && "bg-black/10 dark:bg-white/10 text-foreground")}>
                <Filter className="size-3.5 mr-1.5" /> 
                {statusFilter === 'all' ? 'Фильтры' : statusFilter === 'active' ? 'Активен' : 'Скрыт'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-1 border-border/80 bg-background/95 backdrop-blur-xl">
              <DropdownMenuItem onClick={() => setStatusFilter("all")} className="rounded-xl text-[12px] font-bold py-2 focus:bg-muted cursor-pointer transition-colors">Все</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")} className="rounded-xl text-[12px] font-bold py-2 text-green-600 focus:bg-green-50 focus:text-green-700 cursor-pointer transition-colors">Только активные</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")} className="rounded-xl text-[12px] font-bold py-2 text-slate-500 focus:bg-slate-50 focus:text-slate-600 cursor-pointer transition-colors">Только скрытые</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none">
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
              { label: "Всего разделов", value: MOCK_CATEGORIES.length, icon: Layers, color: "text-primary", trend: "+1", isUp: true },
              { label: "Активных разделов", value: MOCK_CATEGORIES.filter(c => c.status === 'active').length, icon: Activity, color: "text-blue-500", trend: "0%", isUp: true },
              { label: "Позиций в разделах", value: MOCK_CATEGORIES.reduce((a, c) => a + c.itemCount, 0), icon: Package, color: "text-green-500", trend: "+12%", isUp: true, className: "col-span-2 sm:col-span-1" },
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
          {filtered.length === 0 ? (
            /* Empty State */
            <div className="h-[300px] sm:h-[400px] flex flex-col items-center justify-center text-center bg-transparent">
               <div className="size-20 sm:size-24 rounded-[2rem] sm:rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-5 sm:mb-6 relative group">
                  <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Search className="size-8 sm:size-10 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
               </div>
               <h3 className="text-[16px] sm:text-[18px] font-bold tracking-tight mb-2">Ничего не нашли</h3>
               <p className="text-[12px] sm:text-[13px] text-muted-foreground/70 max-w-[240px] sm:max-w-[280px] leading-relaxed mb-6">
                 По запросу <span className="text-foreground font-semibold italic">«{searchQuery}»</span> разделов не обнаружено.
               </p>
               <Button 
                 onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                 className="rounded-xl h-[42px] px-8 font-bold text-[13px] bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 transition-colors border-0 shadow-none"
               >
                 Сбросить
               </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
               {filtered.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => setSelectedCat(cat)}
                    className="group flex flex-col h-[150px] sm:h-[180px] rounded-[1.25rem] sm:rounded-[1.5rem] bg-white dark:bg-zinc-900 cursor-pointer overflow-hidden relative border border-black/5 dark:border-white/10 transition-transform active:scale-95"
                  >
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={cat.image} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out" 
                        alt={cat.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                    </div>
                    <div className="absolute top-2.5 right-2.5 z-10 scale-90 sm:scale-100">
                      <StatusBadge status={cat.status} overlay />
                    </div>
                    <div className="relative z-10 p-3 sm:p-4 h-full flex flex-col justify-end">
                       <h3 className="text-[13px] sm:text-[15px] font-semibold text-white line-clamp-1 group-hover:-translate-y-0.5 transition-transform duration-300">{cat.name}</h3>
                       <div className="flex items-center justify-between mt-1 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                         <span className="text-[10px] sm:text-[12px] font-semibold text-white/90">{cat.itemCount} тов.</span>
                         <span className="text-[11px] sm:text-[13px] font-bold text-white tabular-nums">{cat.revenue}</span>
                       </div>
                    </div>
                  </div>
               ))}
            </div>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className="hidden md:block rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden mb-6 border border-black/5 dark:border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                    <tr>
                      <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Категория</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Slug</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-24">Позиций</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-28">Оборот</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center w-28">Статус</th>
                      <th className="py-3 pr-5 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {filtered.map(cat => (
                      <tr 
                        key={cat.id} 
                        onClick={() => setSelectedCat(cat)}
                        className="group cursor-pointer hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-2.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl overflow-hidden bg-muted border border-border/30 group-hover:border-border/60 transition-colors">
                              <img 
                                src={cat.image} 
                                className="w-full h-full object-cover" 
                                alt="" 
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_IMAGE;
                                }}
                              />
                            </div>
                            <span className="text-[13px] font-semibold text-foreground">{cat.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-[12px] font-mono text-muted-foreground/70">/{cat.slug}</td>
                        <td className="py-2.5 px-4 text-[13px] font-medium text-right tabular-nums text-muted-foreground">{cat.itemCount}</td>
                        <td className="py-2.5 px-4 text-[13px] font-bold text-foreground text-right tabular-nums">{cat.revenue}</td>
                        <td className="py-2.5 px-4"><div className="flex justify-center"><StatusBadge status={cat.status} /></div></td>
                        <td className="py-2.5 pr-5 text-right">
                          <div className="size-7 rounded-full flex items-center justify-center hover:bg-muted ml-auto transition-colors">
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View Cards for List Mode */}
              <div className="md:hidden space-y-3">
                {filtered.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => setSelectedCat(cat)}
                    className="p-3.5 rounded-[1.25rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 flex items-center justify-between active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-[1rem] overflow-hidden bg-muted border border-black/5 shrink-0">
                        <img src={cat.image} className="w-full h-full object-cover" alt="" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[13px] font-semibold line-clamp-1">{cat.name}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[11px] font-semibold text-muted-foreground/60">{cat.itemCount} тов.</span>
                           <StatusBadge status={cat.status} />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[13px] font-bold tabular-nums">{cat.revenue}</p>
                       <ChevronRight className="size-3.5 text-muted-foreground/20 ml-auto mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Settings Modal (iOS/Telegram Style) - Now as a right-side Sheet */}
      <Sheet open={!!selectedCat} onOpenChange={(open) => !open && setSelectedCat(null)}>
        <SheetContent side="right" className="w-[100vw] sm:max-w-[420px] p-0 border-l border-black/5 dark:border-white/10 bg-[#f2f2f7] dark:bg-zinc-900 flex flex-col pointer-events-auto [&>button]:hidden">
          <SheetHeader className="sr-only">
             <SheetTitle>Настройки раздела</SheetTitle>
             <SheetDescription>Редактор категории</SheetDescription>
          </SheetHeader>

          {selectedCat && (
             <div className="w-full flex-1 overflow-y-auto scrollbar-none flex flex-col relative px-5 py-8">
                
                {/* Floating Top Left Close Button */}
                <button 
                  onClick={() => setSelectedCat(null)}
                  className="absolute top-4 left-4 size-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors z-10"
                >
                  <X className="size-4 text-foreground/70" />
                </button>

                {/* Top Center Square Logo */}
                <div className="flex justify-center mt-2 mb-6">
                   <div className="size-20 rounded-[1.4rem] overflow-hidden border border-border/40 relative group cursor-pointer bg-background">
                      <img src={selectedCat.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="flex flex-col items-center text-white gap-1 mt-1">
                            <ImageIcon className="size-5" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Header Text */}
                <div className="text-center mb-6 px-4">
                   <h2 className="text-[22px] font-bold tracking-tight leading-tight text-foreground mb-1.5 flex items-center justify-center gap-2">
                       {selectedCat.name}
                   </h2>
                   <p className="text-[13px] font-medium text-foreground/60 leading-snug">
                       Параметры и настройки категории
                   </p>
                </div>

                {/* Group 1: General Info */}
                <div className="bg-background rounded-[1.5rem] overflow-hidden border border-border/40">
                   
                   {/* Name Row */}
                   <div className="flex items-center justify-between p-4 px-5 border-b border-border/40 min-h-[50px]">
                      <span className="text-[14px] font-medium text-foreground">Название</span>
                      <Input 
                        defaultValue={selectedCat.name} 
                        className="h-8 w-[160px] text-right text-[14px] font-bold border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none text-foreground placeholder:text-muted-foreground" 
                      />
                   </div>

                   {/* Slug Row */}
                   <div className="flex items-center justify-between p-4 px-5 min-h-[50px]">
                      <span className="text-[14px] font-medium text-foreground">Адрес (URL)</span>
                      <div className="flex flex-col items-end w-[180px]">
                         <Input 
                           defaultValue={selectedCat.slug} 
                           className="h-6 w-full text-right text-[14px] font-mono border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none text-foreground/80 placeholder:text-muted-foreground" 
                         />
                         <span className="text-[11px] text-muted-foreground/60">my-site.com/{selectedCat.slug}</span>
                      </div>
                   </div>
                </div>
                
                {/* Instruction Text 1 */}
                <p className="px-5 mt-2 mb-4 text-[12px] text-muted-foreground/80 font-medium">Это название используется во всем приложении.</p>

                {/* Group 2: Display Settings */}
                <div className="bg-background rounded-[1.5rem] overflow-hidden border border-border/40 shrink-0">
                   <div className="flex items-center justify-between p-4 px-5 min-h-[50px]">
                      <span className="text-[14px] font-medium text-foreground">Отображать в меню</span>
                      <div className={cn("w-12 h-[26px] rounded-full p-[2px] transition-colors cursor-pointer", selectedCat.status === 'active' ? "bg-green-500" : "bg-muted-foreground/30")}>
                         <div className={cn("size-[22px] bg-white rounded-full transition-transform", selectedCat.status === 'active' ? "translate-x-6" : "translate-x-0")} />
                      </div>
                   </div>
                </div>

                {/* Instruction Text 2 */}
                <p className="px-5 mt-2 mb-6 text-[12px] text-muted-foreground/80 font-medium">Если выключить, клиенты не смогут найти данный раздел.</p>

                {/* Bottom Buttons */}
                <div className="flex items-center gap-2 w-full mt-auto pt-6 pb-2">
                   <Button 
                     variant="ghost"
                     className="flex-1 h-[42px] rounded-xl font-bold text-[13px] text-foreground bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors border-0"
                     onClick={() => setIsDeleteDialogOpen(true)}
                   >
                      Удалить
                   </Button>
                   <Button 
                     className="flex-1 h-[42px] rounded-xl font-bold text-[13px] bg-[#007aff] text-white hover:bg-[#007aff]/90 transition-all active:scale-[0.98]"
                   >
                      Сохранить
                   </Button>
                </div>

             </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[90vw] max-w-[340px] p-0 border-0 bg-transparent shadow-none focus:outline-none flex items-center justify-center pointer-events-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Удаление</DialogTitle>
            <DialogDescription>Подтверждение действия</DialogDescription>
          </DialogHeader>
          
          <div className="w-full bg-background/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-7 flex flex-col items-center gap-5 pointer-events-auto">
             
             {/* Warning Icon - Animated */}
             <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                
                <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 relative">
                   <Activity className="size-8 animate-pulse" strokeWidth={2.5} />
                </div>
             </div>
             
             <div className="text-center space-y-1.5 mt-1">
               <h3 className="text-[19px] font-semibold tracking-tight text-foreground">Удалить раздел?</h3>
               <p className="text-[12.5px] font-medium text-muted-foreground/80 leading-snug px-2">
                 Вся категория <span className="text-foreground font-semibold font-mono">«{selectedCat?.name}»</span> будет удалена навсегда.
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
                  className="flex-1 rounded-full h-11 font-black text-[13px] bg-red-500 hover:bg-red-600 border-0 text-white transition-all active:scale-[0.96]" 
                  onClick={() => { setIsDeleteDialogOpen(false); setSelectedCat(null); }}
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
