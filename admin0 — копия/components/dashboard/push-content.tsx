"use client";

import { useState, useEffect } from "react";
import { 
  Bell, Send, Search, Filter, MoreHorizontal, 
  Trash2, MessageSquare, Smartphone, History,
  TrendingUp, Users, Clock, CheckCircle2, AlertCircle, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

const MOCK_PUSH_HISTORY = [
  { id: "1", title: "🍱 Ваш подарок ждет!", body: "Закажите любой сет сегодня и получите Филадельфию Лайт в подарок. Успейте!", type: "Акция", status: "sent", sentAt: "Сегодня, 10:00", reads: "82%", delivered: 1240 },
  { id: "2", title: "🍣 Соскучились по роллам?", body: "Дарим скидку 15% на весь заказ по промокоду MISSYOU. Только 3 дня!", type: "Ретаргетинг", status: "sent", sentAt: "Вчера, 18:30", reads: "64%", delivered: 850 },
  { id: "3", title: "📢 Мы открылись на Чиланзаре", body: "Ждем вас в новом филиале! Скидка 20% на самовывоз.", type: "Новость", status: "scheduled", sentAt: "21.04, 12:00", reads: "—", delivered: 0 },
];

export function PushContent() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans text-left">
      
      {/* Toolbar — adaptive layout (Categories/StopList Style) */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
                <Bell className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Уведомления</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                {MOCK_PUSH_HISTORY.length}
              </Badge>
            </div>
            
            <div className="sm:hidden">
               <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                 <Plus className="size-4" strokeWidth={2.5} />
               </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="relative group w-full sm:w-[260px] px-0.5 sm:px-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Поиск по рассылкам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
            />
          </div>
        </div>
        
        <div className="hidden sm:block">
          <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none">
            <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Создать
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 md:p-5 pb-20">
        <div className="w-full space-y-6">
          
          {/* Compact Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { label: "Всего отправлено", value: 12500, icon: Send, color: "text-[#007aff]", trend: "+12%", isUp: true },
              { label: "Ср. открываемость", value: 74, icon: TrendingUp, color: "text-[#34c759]", trend: "+8%", isUp: true, suffix: "%" },
              { label: "База в приложении", value: 3420, icon: Smartphone, color: "text-[#af52de]", trend: "+24%", isUp: true },
              { label: "Активная аудитория", value: 2180, icon: Users, color: "text-[#ff9500]", trend: "-5%", isUp: false },
            ].map((stat, i) => (
              <div key={i} className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("size-8 rounded-xl flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5", stat.color)}>
                    <stat.icon className="size-4" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black",
                    stat.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  )}>
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground/60 font-semibold tracking-tight mb-0.5">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                     <AnimatedNumber value={stat.value} className="text-[18px] font-bold tracking-tight" />
                     {stat.suffix && <span className="text-[11px] font-bold text-muted-foreground/40">{stat.suffix}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* New Push Form Preview (Visual) */}
             <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                   <h2 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/40">Новое уведомление</h2>
                   <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                </div>
                <div className="rounded-[2rem] bg-white dark:bg-[#1c1c1e] p-6 border border-black/5 dark:border-white/10 space-y-5">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest px-1">Заголовок сообщения</label>
                      <Input placeholder="Напр: Дарим Филадельфию!" className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium placeholder:text-muted-foreground/30" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest px-1">Текст пуша</label>
                      <textarea placeholder="Введите текст сообщения..." className="w-full min-h-[90px] rounded-[1.25rem] bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium p-3.5 resize-none scrollbar-none placeholder:text-muted-foreground/30" />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 px-4 rounded-xl bg-black/5 dark:bg-white/5 border-0 flex flex-col gap-0.5">
                         <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-tight">Аудитория</span>
                         <span className="text-[12px] font-semibold">Все пользователи</span>
                      </div>
                      <div className="p-3 px-4 rounded-xl bg-black/5 dark:bg-white/5 border-0 flex flex-col gap-0.5">
                         <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-tight">Время</span>
                         <span className="text-[12px] font-semibold italic text-primary">Сейчас</span>
                      </div>
                   </div>
                   <Button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] shadow-none hover:opacity-90 active:scale-95 transition-all">
                      Отправить рассылку
                   </Button>
                </div>
             </div>

             {/* History */}
             <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                   <h2 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/40">История рассылок</h2>
                   <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                </div>
                <div className="space-y-2.5">
                   {MOCK_PUSH_HISTORY.map(item => (
                      <div key={item.id} className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] p-4 border border-black/5 dark:border-white/10 group hover:border-primary/20 transition-all cursor-pointer">
                         <div className="flex items-start justify-between mb-2.5">
                            <Badge variant="outline" className="h-[18px] px-1.5 text-[8px] font-bold border-0 bg-primary/5 text-primary rounded-md uppercase tracking-wider">
                               {item.type}
                            </Badge>
                            <span className="text-[9px] text-muted-foreground/40 font-semibold tabular-nums">{item.sentAt}</span>
                         </div>
                         <h4 className="text-[13px] font-semibold mb-1 group-hover:text-primary transition-colors tracking-tight">{item.title}</h4>
                         <p className="text-[11px] text-muted-foreground/50 leading-relaxed lines-clamp-2 mb-3 px-0.5">{item.body}</p>
                         <div className="flex items-center gap-5 pt-3 border-t border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-1.5">
                               <CheckCircle2 className="size-3 text-green-500/70" />
                               <span className="text-[10px] font-bold tabular-nums text-muted-foreground/70">{item.delivered} доств.</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                               <TrendingUp className="size-3 text-blue-500/70" />
                               <span className="text-[10px] font-bold tabular-nums text-muted-foreground/70">{item.reads} прочт.</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                               <span className={cn(
                                 "text-[8px] font-black uppercase tracking-widest",
                                 item.status === 'sent' ? 'text-green-500/60' : 'text-orange-500/60'
                               )}>
                                 {item.status === 'sent' ? 'SENT' : 'PLAN'}
                               </span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
