"use client";

import { useState, useEffect } from "react";
import { 
  Globe, Smartphone, MessageSquare, CreditCard, 
  Settings2, Plus, Power, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const INTEGRATIONS_DATA = [
  { id: "payme", name: "Payme", category: "Платежные системы", status: "connected", icon: CreditCard, color: "text-[#00aeef]", desc: "Прием платежей через UzCard и Humo" },
  { id: "click", name: "Click", category: "Платежные системы", status: "connected", icon: CreditCard, color: "text-[#00a6e3]", desc: "Популярный платежный шлюз в Узбекистане" },
  { id: "telegram", name: "Telegram Bot", category: "Каналы продаж", status: "connected", icon: MessageSquare, color: "text-sky-500", desc: "Автоматический прием заказов в мессенджере" },
  { id: "app", name: "Mobile App", category: "Каналы продаж", status: "connected", icon: Smartphone, color: "text-primary", desc: "Ваше фирменное приложение для iOS и Android" },
  { id: "instagram", name: "Instagram Shop", category: "Маркетинг", status: "disconnected", icon: Globe, color: "text-purple-500", desc: "Синхронизация меню с товарами в Instagram" },
  { id: "poster", name: "Poster POS", category: "Учетные системы", status: "disconnected", icon: Smartphone, color: "text-green-500", desc: "Синхронизация заказов с облачной кассой" },
  { id: "iiko", name: "iiko Office", category: "Учетные системы", status: "not_available", icon: Smartphone, color: "text-zinc-500", desc: "Прямая интеграция с ресторанным ПО iiko" },
];

const CATEGORIES = [
  { id: "payments", name: "Платежные системы", items: ["payme", "click"] },
  { id: "sales", name: "Каналы продаж", items: ["telegram", "app"] },
  { id: "pos", name: "Учетные системы", items: ["poster", "iiko"] },
  { id: "marketing", name: "Маркетинг", items: ["instagram"] },
];

export function IntegrationsContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Toolbar */}
      <div className="h-16 shrink-0 flex items-center justify-between px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Settings2 className="size-4" />
          </div>
          <span className="text-[14px] font-semibold tracking-tight">Маркетплейс интеграций</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-[24px] px-3 text-[10px] font-semibold bg-green-500/10 border-0 text-green-600 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
             <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
             Все системы в норме
          </Badge>
          <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none">
            <Plus className="size-4 mr-1.5" /> Подключить
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-5 md:p-6 pb-24">
        <div className="max-w-[1200px] mx-auto space-y-12">
          
          {CATEGORIES.map(category => (
            <div key={category.id} className="space-y-6">
               <div className="flex items-center gap-4 px-2">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/40">{category.name}</h2>
                  <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {INTEGRATIONS_DATA.filter(int => category.items.includes(int.id)).map(item => (
                    <div key={item.id} className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-5 border border-black/5 dark:border-white/10 flex flex-col group hover:border-primary/20 transition-all duration-310 relative text-left">
                       <div className="flex items-center justify-between mb-5">
                          <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0 border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]", item.color)}>
                             <item.icon className={cn("size-5", item.status === 'not_available' && 'opacity-20')} />
                          </div>
                          <Switch 
                            checked={item.status === "connected"} 
                            disabled={item.status === "not_available"}
                            className="scale-75 origin-right"
                          />
                       </div>

                       <div className="flex-1 mb-5">
                          <h3 className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
                             {item.name}
                             {item.status === "connected" && (
                                <span className="size-1.5 rounded-full bg-green-500" />
                             )}
                          </h3>
                          <p className="text-[11px] text-muted-foreground/50 mt-1 lines-clamp-2 leading-relaxed">
                             {item.desc}
                          </p>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={item.status === 'not_available'}
                            className="h-8 -ml-2 rounded-lg text-[11px] font-semibold text-primary/70 hover:text-primary hover:bg-primary/5 gap-1.5 transition-all"
                          >
                             {item.status === 'connected' ? 'Настроить' : 'Подключить'}
                             <ChevronRight className="size-3 opacity-40" />
                          </Button>
                          
                          {item.status === 'not_available' && (
                            <Badge className="h-[20px] bg-black/5 dark:bg-white/5 text-[9px] font-bold text-muted-foreground/30 border-0 rounded-md">
                               SOON
                            </Badge>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}

          {/* Developer API Section */}
          <div className="rounded-[2.5rem] bg-white dark:bg-[#1c1c1e] p-10 border border-black/5 dark:border-white/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-primary overflow-hidden">
                <Power className="size-48 opacity-[0.02] rotate-12 -mr-16 -mt-16 group-hover:rotate-0 transition-transform duration-1000" />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="size-16 rounded-[1.75rem] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                   <Power className="size-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h4 className="text-[18px] font-semibold tracking-tight">API & Webhooks</h4>
                   <p className="text-[13px] text-muted-foreground/50 mt-2 leading-relaxed max-w-[550px]">
                      Разработайте собственную интеграцию. Наше API позволяет синхронизировать заказы, меню и клиентов с любой сторонней CRM или POS-системой.
                   </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                   <Button variant="ghost" className="h-11 px-8 rounded-2xl text-[13px] font-semibold hover:bg-black/5 transition-all w-full sm:w-auto">Документация</Button>
                   <Button className="h-11 px-8 rounded-2xl text-[13px] font-semibold shadow-none bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto shrink-0">Сгенерировать ключ</Button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
