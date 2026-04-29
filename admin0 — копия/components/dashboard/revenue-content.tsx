"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, CreditCard, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Wallet, Banknote, 
  Filter, Calendar, Download, Search, ChevronRight, Activity, 
  PieChart as PieChartIcon, BarChart3, Star, Heart, Clock
} from "lucide-react";
import { 
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, 
  CartesianGrid, Bar, BarChart, Cell, ComposedChart, Pie, PieChart
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { PeriodFilter } from "@/components/ui/period-filter";

const MOCK_REVENUE = {
   today: {
      stats: [
         { label: "Выручка", value: 4850000, trend: "+12.4%", isUp: true, icon: Banknote, color: "text-green-500" },
         { label: "Средний чек", value: 85200, trend: "-2.1%", isUp: false, icon: CreditCard, color: "text-blue-500" },
         { label: "Заказы", value: 58, trend: "+14%", isUp: true, icon: ShoppingBag, color: "text-orange-500" },
         { label: "Прибыль", value: 3120000, trend: "+9.2%", isUp: true, icon: Wallet, color: "text-primary" },
      ],
      chart: [
         { name: "08:00", revenue: 420000, count: 5 }, { name: "10:00", revenue: 850000, count: 12 },
         { name: "12:00", revenue: 1450000, count: 18 }, { name: "14:00", revenue: 980000, count: 14 },
         { name: "16:00", revenue: 1120000, count: 16 }, { name: "18:00", revenue: 1850000, count: 24 },
         { name: "20:00", revenue: 2100000, count: 28 }, { name: "22:00", revenue: 1200000, count: 15 },
      ]
   },
   week: {
      stats: [
         { label: "Выручка", value: 32450000, trend: "+8.1%", isUp: true, icon: Banknote, color: "text-green-500" },
         { label: "Средний чек", value: 92400, trend: "+4.5%", isUp: true, icon: CreditCard, color: "text-blue-500" },
         { label: "Заказы", value: 352, trend: "-2.4%", isUp: false, icon: ShoppingBag, color: "text-orange-500" },
         { label: "Прибыль", value: 21100000, trend: "+6.8%", isUp: true, icon: Wallet, color: "text-primary" },
      ],
      chart: [
         { name: "Пн", revenue: 4200000, count: 45 }, { name: "Вт", revenue: 3800000, count: 42 },
         { name: "Ср", revenue: 4500000, count: 48 }, { name: "Чт", revenue: 4100000, count: 44 },
         { name: "Пт", revenue: 5800000, count: 62 }, { name: "Сб", revenue: 7200000, count: 78 },
         { name: "Вс", revenue: 6500000, count: 72 },
      ]
   },
   month: {
      stats: [
         { label: "Выручка", value: 142800000, trend: "+15.2%", isUp: true, icon: Banknote, color: "text-green-500" },
         { label: "Средний чек", value: 88600, trend: "+1.2%", isUp: true, icon: CreditCard, color: "text-blue-500" },
         { label: "Заказы", value: 1420, trend: "+11%", isUp: true, icon: ShoppingBag, color: "text-orange-500" },
         { label: "Прибыль", value: 92400000, trend: "+12.5%", isUp: true, icon: Wallet, color: "text-primary" },
      ],
      chart: [
         { name: "Нед 1", revenue: 32000000, count: 340 }, { name: "Нед 2", revenue: 35000000, count: 380 },
         { name: "Нед 3", revenue: 31000000, count: 320 }, { name: "Нед 4", revenue: 44800000, count: 480 },
      ]
   }
};

const CATEGORY_REVENUE = [
  { name: "Роллы", value: 45, color: "#007aff" },
  { name: "Сеты", value: 30, color: "#34c759" },
  { name: "Суши", value: 15, color: "#ff9500" },
  { name: "Напитки", value: 10, color: "#af52de" },
];

const RECENT_HISTORY = [
  { id: "#8241", customer: "Алишер М.", amount: 245000, method: "Payme", time: "14:20", status: "success" },
  { id: "#8240", customer: "Мадина К.", amount: 185000, method: "Click", time: "13:55", status: "success" },
  { id: "#8239", customer: "Олег И.", amount: 420000, method: "Наличные", time: "13:42", status: "refunded" },
  { id: "#8238", customer: "Джасур Т.", amount: 125000, method: "Картой", time: "13:15", status: "success" },
];

export function RevenueContent() {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<string>("Сегодня");

  const getActiveKey = (p: string) => {
    if (p === "Сегодня") return "today";
    if (p === "Неделя") return "week";
    return "month";
  };

  const currentData = MOCK_REVENUE[getActiveKey(period)];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Toolbar — adaptive layout (Command Center Style) */}
      <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 shrink-0">
                <Banknote className="size-4" />
              </div>
              <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Учет выручки</span>
              <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground ml-1">
                LIVE
              </Badge>
            </div>
            
            <div className="sm:hidden flex items-center gap-2">
               <PeriodFilter value={period} onChange={setPeriod} isCompact />
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 border-0">
                 <Download className="size-4" />
               </Button>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />
          
          <div className="hidden sm:flex items-center gap-2">
            <PeriodFilter value={period} onChange={setPeriod} />
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border-0">
            <Download className="size-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border-0 text-primary">
            <Activity className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-5 md:p-6 pb-20 sm:pb-6">
        <div className="max-w-[1300px] mx-auto space-y-5 sm:space-y-6">

          {/* Stats Grid — Adaptive & Compact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {currentData.stats.map((s) => (
              <div key={s.label} className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 group hover:border-green-500/20 transition-all duration-300 relative overflow-hidden flex flex-col items-start text-left">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={cn("size-8 rounded-[11px] flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5", s.color)}>
                    <s.icon className="size-4" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black tabular-nums",
                    s.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  )}>
                    {s.isUp ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
                    {s.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground/60 font-bold tracking-tight mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full">{s.label}</p>
                  <div className="flex items-baseline gap-1">
                    <AnimatedNumber value={s.value} className="text-[18px] sm:text-[20px] font-black tracking-tight tabular-nums" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Main Area Chart */}
            <div className="lg:col-span-8 rounded-[2rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden flex flex-col min-h-[220px]">
              <div className="px-6 h-14 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
                <div className="flex items-center gap-2">
                   <TrendingUp className="size-4 text-green-500" />
                   <p className="text-[14px] font-semibold text-foreground/80">График выручки</p>
                </div>
                <Badge variant="secondary" className="bg-black/5 dark:bg-white/10 text-[10px] font-bold rounded-full border-0">
                  {period}
                </Badge>
              </div>
              <div className="flex-1 p-4 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentData.chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.05]" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 10, fontWeight: 700}} 
                       className="text-muted-foreground/40"
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 10, fontWeight: 700}} 
                       className="text-muted-foreground/40"
                       tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                      cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            {/* Category Analysis */}
            <div className="lg:col-span-4 rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden flex flex-col min-h-[280px] lg:h-auto text-left">
              <div className="px-6 sm:px-8 h-16 border-b border-black/5 dark:border-white/10 flex items-center gap-3 bg-black/[0.01] dark:bg-white/[0.01]">
                 <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <PieChartIcon className="size-4" />
                 </div>
                 <p className="text-[14px] font-semibold text-foreground/80">По категориям</p>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col items-center justify-center gap-4 sm:gap-2">
                <div className="relative w-full h-[150px] sm:h-[150px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                           data={CATEGORY_REVENUE}
                           cx="50%"
                           cy="50%"
                           innerRadius={45}
                           outerRadius={60}
                           paddingAngle={5}
                           dataKey="value"
                         >
                            {CATEGORY_REVENUE.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                         </Pie>
                         <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                         />
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[20px] font-black tracking-tight">100%</span>
                      <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Total</span>
                   </div>
                </div>
                
                <div className="w-full divide-y divide-black/5 dark:divide-white/5 border-t border-black/5 dark:border-white/5">
                  {CATEGORY_REVENUE.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between py-3 sm:py-2.5 transition-all group cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="size-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-125" style={{ backgroundColor: cat.color }} />
                        <span className="text-[13px] font-bold opacity-70 group-hover:opacity-100 transition-opacity">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                         <div className="w-20 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full rounded-full opacity-60" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                         </div>
                         <span className="text-[13px] font-black tabular-nums">{cat.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent History Table */}
          <div className="rounded-[2.25rem] border border-black/5 dark:border-white/10 bg-white dark:bg-[#1c1c1e] overflow-hidden">
            <div className="px-5 sm:px-8 h-16 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <div className="size-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Activity className="size-4" />
                 </div>
                 <p className="text-[14px] font-semibold text-foreground/80">Последние операции</p>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/5 border-0 text-primary group/btn">
                <ChevronRight className="size-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </div>
            
            {/* Desktop View Table */}
            <div className="hidden sm:block overflow-x-auto text-left">
               <table className="w-full">
                  <thead className="bg-[#f2f2f7]/50 dark:bg-black/20 border-b border-black/5 dark:border-white/10">
                    <tr className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">
                       <th className="h-10 pl-6 text-left">Заказ</th>
                       <th className="h-10 text-left">Клиент</th>
                       <th className="h-10 text-left">Метод</th>
                       <th className="h-10 text-right">Время</th>
                       <th className="h-10 pr-6 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {RECENT_HISTORY.map((op) => (
                      <tr key={op.id} className="h-12 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <td className="pl-6 text-[12px] font-bold tabular-nums opacity-40">{op.id}</td>
                        <td className="text-[13px] font-bold">{op.customer}</td>
                        <td className="text-[12px] font-medium opacity-60">{op.method}</td>
                        <td className="text-right text-[12px] font-bold tabular-nums">{op.time}</td>
                        <td className="pr-6 text-right">
                           <span className={cn(
                             "text-[14px] font-black tabular-nums",
                             op.status === 'refunded' ? "text-red-500" : "text-foreground"
                           )}>
                             {op.status === 'refunded' ? '-' : ''}{op.amount.toLocaleString()} <span className="text-[10px] opacity-40 uppercase">sum</span>
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            {/* Mobile View Cards — High Density */}
            <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10">
               {RECENT_HISTORY.map((op) => (
                 <div key={op.id} className="p-3.5 px-5 flex items-center justify-between gap-4 active:bg-black/5 transition-colors">
                    <div className="min-w-0 text-left">
                       <p className="text-[13px] font-bold mb-0.5 leading-tight">{op.customer}</p>
                       <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest tabular-nums">{op.id} · {op.time}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                       <p className={cn(
                         "text-[14px] font-black tabular-nums tracking-tight",
                         op.status === 'refunded' ? "text-red-500" : "text-foreground"
                       )}>
                         {op.amount.toLocaleString()}
                       </p>
                       <Badge variant="outline" className="text-[8px] font-black h-[14px] px-1 rounded-[4px] border-black/5 text-muted-foreground/50">
                         {op.method}
                       </Badge>
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
