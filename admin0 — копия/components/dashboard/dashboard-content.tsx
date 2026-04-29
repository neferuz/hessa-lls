"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Clipboard, 
  Wallet, 
  FileText, 
  Users, 
  ShoppingBag, 
  XCircle, 
  Flame, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Download,
  ArrowRight,
  Filter,
  Package,
  Activity,
  Truck,
  ChevronRight,
  User,
  Phone,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PeriodFilter } from "@/components/ui/period-filter";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

const STATS_DATA = [
  { title: "Заказы", value: 42, icon: Clipboard, trend: "+12%", isUp: true, color: "text-[#007aff]" },
  { title: "Выручка", value: 2840000, icon: Wallet, trend: "+8%", isUp: true, color: "text-[#34c759]", suffix: " сум" },
  { title: "Средний чек", value: 68000, icon: FileText, trend: "-2%", isUp: false, color: "text-[#5856d6]", suffix: " сум" },
  { title: "Клиенты", value: 1248, icon: Users, trend: "+24%", isUp: true, color: "text-[#af52de]" },
];

const CHART_DATA = [
  { name: "09:00", revenue: 450000, orders: 5 },
  { name: "12:00", revenue: 850000, orders: 12 },
  { name: "15:00", revenue: 700000, orders: 8 },
  { name: "18:00", revenue: 1200000, orders: 18 },
  { name: "21:00", revenue: 950000, orders: 11 },
];

const RECENT_ORDERS = [
  { id: "1024", customer: "Алексей И.", phone: "+998 90 123 45 67", items: "Филадельфия Лайт × 2", total: "72 000", date: "14:20", status: "cooking", statusText: "Готовится" },
  { id: "1023", customer: "Марина К.", phone: "+998 93 444 22 11", items: "Сет Самурай × 1", total: "128 000", date: "13:50", status: "delivering", statusText: "В пути" },
  { id: "1022", customer: "Джамшид У.", phone: "+998 97 777 00 00", items: "Калифорния × 3", total: "105 000", date: "13:10", status: "done", statusText: "Доставлен" },
  { id: "1021", customer: "Лола С.", phone: "+998 90 999 88 77", items: "Ролл Дракон × 1", total: "54 000", date: "12:45", status: "new", statusText: "Новый" },
];

const TOP_ITEMS = [
  { name: "Филадельфия", orders: 12, growth: "+15%", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=100" },
  { name: "Калифорния", orders: 8, growth: "+5%", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=100" },
  { name: "Сяке Маки", orders: 6, growth: "-2%", image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&q=80&w=100" },
  { name: "Эби Темпура", orders: 4, growth: "+12%", image: "https://images.unsplash.com/photo-1562158074-67fd0673d324?auto=format&fit=crop&q=80&w=100" },
];

const STATUS_MAP = {
  new:        { label: "Новый",      dot: "bg-blue-500",   bg: "bg-blue-500/10 text-blue-600" },
  cooking:    { label: "Готовится",   dot: "bg-orange-500", bg: "bg-orange-500/10 text-orange-600" },
  ready:      { label: "Готов",       dot: "bg-purple-500", bg: "bg-purple-500/10 text-purple-600" },
  delivering: { label: "Доставка",   dot: "bg-yellow-500", bg: "bg-yellow-500/10 text-yellow-600" },
  done:       { label: "Завершён",   dot: "bg-green-500",  bg: "bg-green-500/10 text-green-600" },
  cancelled:  { label: "Отменён",    dot: "bg-red-500",    bg: "bg-red-500/10 text-red-500" },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS_MAP }) {
  const s = STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-tight border-0", s.bg)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function DashboardContent() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [dateTime, setDateTime] = useState({ time: "", date: "" });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime({
        time: new Intl.DateTimeFormat('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        }).format(now),
        date: new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(now)
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Mini Toolbar - True Adaptive Two-Row on Mobile */}
      <div className="h-auto py-2.5 sm:h-14 sm:py-0 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-2 sm:gap-0">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2 pr-3 sm:border-r border-black/10 dark:border-white/10">
            <Activity className="size-4 text-[#007aff]" />
            <span className="text-[13px] font-semibold tracking-tight uppercase hidden sm:block">Центр управления</span>
            <span className="text-[12px] font-bold tracking-tight uppercase sm:hidden">Control</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#007aff]/5 border border-[#007aff]/10 group/time">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="absolute size-1.5 rounded-full bg-[#007aff] animate-ping opacity-40" />
              <span className="relative size-1.5 rounded-full bg-[#007aff]" />
            </div>
            <div className="w-px h-2.5 bg-[#007aff]/20 mx-0.5" />
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[11px] font-medium text-[#007aff] tabular-nums tracking-tight whitespace-nowrap">{dateTime.time}</span>
              <div className="w-px h-2 bg-[#007aff]/10" />
              <span className="text-[10px] font-medium text-muted-foreground/40 tabular-nums uppercase whitespace-nowrap">{dateTime.date}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
          <div className="flex-1 sm:flex-none">
            <PeriodFilter onPeriodChange={() => { setIsUpdating(true); setTimeout(() => setIsUpdating(false), 500); }} />
          </div>
          <Button variant="outline" size="sm" className="h-[36px] w-[36px] sm:w-auto sm:px-3 rounded-full sm:rounded-[12px] text-[11px] font-bold border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors shadow-none shrink-0 flex items-center justify-center p-0 sm:p-auto group">
            <Download className="size-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Экспорт</span>
          </Button>
        </div>
      </div>

      {/* Tighter Content */}
      <div className={cn(
        "flex-1 overflow-y-auto scrollbar-none p-4 md:p-5 transition-all duration-500",
        isUpdating ? "opacity-40 scale-[0.99] pointer-events-none" : "opacity-100 scale-100"
      )}>
        <div className="max-w-[1400px] mx-auto space-y-4">

          {/* Compact Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS_DATA.map((stat, i) => (
              <div 
                key={i}
                className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden text-left shadow-none"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("size-8 rounded-2xl flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5", stat.color)}>
                    <stat.icon className="size-4" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    stat.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  )}>
                    {stat.isUp ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground/60 font-medium tracking-tight mb-0.5">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <AnimatedNumber value={stat.value} className="text-[18px] font-semibold tracking-tight" />
                    {stat.suffix && <span className="text-[11px] font-medium text-muted-foreground/40">{stat.suffix}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* Integrated Dashboard Block (Analytics + Live Intel) */}
            <div className="lg:col-span-2 rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] p-5 border border-black/5 dark:border-white/10 flex flex-col text-left transition-all shadow-none">
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h3 className="text-[14px] font-semibold tracking-tight text-muted-foreground/80">Интеллект-панель</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] text-muted-foreground/50 font-medium tracking-tight">Живая статистика и аналитика</p>
                  </div>
                </div>
                <div className="h-6 px-3 flex items-center bg-[#007aff]/5 dark:bg-[#007aff]/10 rounded-full border border-[#007aff]/10">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[#007aff]">LIVE SYSTEM</span>
                </div>
              </div>

              {/* Chart Section */}
              <div className="h-[180px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevBest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#007aff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-black/5 dark:text-white/5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} dy={10} className="text-muted-foreground/30" />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 500 }} 
                      tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${value/1000}k` : value}
                      className="text-muted-foreground/30" 
                    />
                    <Tooltip cursor={{ stroke: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', padding: '8px 12px' }} itemStyle={{ fontSize: '11px', fontWeight: 900 }} labelStyle={{ fontSize: '10px', color: '#999', marginBottom: '4px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#007aff" strokeWidth={3} fillOpacity={1} fill="url(#colorRevBest)" />
                    <Bar dataKey="orders" barSize={10} radius={[3, 3, 0, 0]} fill="currentColor" className="text-[#007aff]/10" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Integrated Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
                <div className="space-y-1">
                   <p className="text-[10px] font-medium text-muted-foreground/40 tracking-tight">Кухня (Время)</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-[16px] font-semibold tabular-nums tracking-tight">14:20</span>
                     <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5">
                       <TrendingDown className="size-2.5" /> -2.4м
                     </span>
                   </div>
                </div>
                <div className="space-y-1 border-x border-black/5 dark:border-white/5 px-4 text-center">
                   <p className="text-[10px] font-medium text-muted-foreground/40 tracking-tight text-center">Стоп-лист</p>
                   <p className="text-[16px] font-semibold tabular-nums text-center">2 позиции</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[10px] font-medium text-muted-foreground/40 tracking-tight text-right">Нагрузка</p>
                   <div className="flex items-center justify-end gap-2">
                     <div className="w-16 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500 w-[74%]" />
                     </div>
                     <span className="text-[13px] font-semibold text-orange-600">74%</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="flex flex-col gap-4">
              <div className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] p-5 border border-black/5 dark:border-white/10 flex-col flex h-full shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold tracking-tight text-muted-foreground/80 flex items-center gap-1.5">
                    <Flame className="size-3.5 text-orange-500" />
                    Топ позиций
                  </h3>
                  <Button variant="ghost" size="sm" className="h-6 p-0 px-2 text-[10px] font-semibold text-muted-foreground/40 hover:text-primary transition-colors">Все</Button>
                </div>
                <div className="space-y-1 flex-1">
                  {TOP_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 group cursor-pointer hover:bg-black/[0.04] transition-all duration-300">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl overflow-hidden border border-black/5 dark:border-white/10 shrink-0">
                          <img src={item.image} alt={item.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold truncate leading-tight mb-0.5">{item.name}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-tight">Роллы</span>
                             <span className={cn("text-[9px] font-semibold", item.growth.startsWith('+') ? "text-green-500" : "text-red-400")}>{item.growth}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-[12px] font-semibold tabular-nums leading-none">1.2 млн</span>
                        <span className="text-[9px] font-semibold text-[#007aff] mt-1 pr-0.5">{item.orders} шт.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders - Adaptive */}
          <div className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 text-left shadow-none">
              <div className="p-4 border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20 flex items-center justify-between">
                <h3 className="text-[14px] font-semibold tracking-tight text-muted-foreground/80">Последние заказы</h3>
                <Button variant="ghost" className="h-6 px-2 text-[10px] font-medium text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1">
                  Смотреть все <ChevronRight className="size-3" />
                </Button>
              </div>

              {/* Desktop Table View */}
              <table className="hidden sm:table w-full border-collapse">
                  <thead className="bg-black/[0.01] dark:bg-white/[0.01]">
                    <tr>
                      <th className="py-2.5 px-5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 w-24">№ Заказа</th>
                      <th className="py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 text-left">Клиент</th>
                      <th className="py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 text-right">Сумма</th>
                      <th className="py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 text-left w-28">Статус</th>
                      <th className="py-2.5 pr-6 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 text-right w-24">Время</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {RECENT_ORDERS.map((order, i) => (
                      <tr key={i} className="group cursor-pointer hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-5 text-[12px] font-semibold text-[#007aff] tabular-nums">#{order.id}</td>
                        <td className="py-2.5 px-4">
                           <p className="text-[12px] font-semibold leading-none">{order.customer}</p>
                           <p className="text-[10px] text-muted-foreground/50 font-medium mt-0.5">{order.phone}</p>
                        </td>
                        <td className="py-2.5 px-4 text-right text-[12px] font-semibold tabular-nums">{order.total} сум</td>
                        <td className="py-2.5 px-4">
                           <StatusBadge status={order.status as any} />
                        </td>
                        <td className="py-2.5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <span className="text-[10px] font-medium text-muted-foreground/40">{order.date}</span>
                             <ChevronRight className="size-3 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
                {RECENT_ORDERS.map((order, i) => (
                  <div key={i} className="p-4 flex flex-col gap-3 active:bg-black/5 transition-colors">
                    <div className="flex items-center justify-between">
                       <span className="text-[13px] font-semibold text-[#007aff]">#{order.id}</span>
                       <StatusBadge status={order.status as any} />
                    </div>
                    <div className="flex items-end justify-between gap-3">
                       <div className="space-y-0.5 max-w-[200px]">
                          <p className="text-[13px] font-semibold">{order.customer}</p>
                          <p className="text-[11px] font-medium text-muted-foreground/40 truncate">{order.items}</p>
                       </div>
                       <div className="text-right shrink-0">
                          <p className="text-[13px] font-semibold tabular-nums">{order.total} сум</p>
                          <p className="text-[10px] font-medium text-muted-foreground/30">{order.date}</p>
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
