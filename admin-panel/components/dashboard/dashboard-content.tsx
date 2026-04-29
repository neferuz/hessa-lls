"use client";

import { useState, useEffect } from "react";
import { 
  Clipboard, 
  Wallet, 
  FileText, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Download,
  ChevronRight,
  Flame,
  LayoutDashboard,
  Clock as ClockIcon,
  Search,
  Bell,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useDashboardStore } from "@/store/dashboard-store";
import { API_BASE_URL } from "@/lib/config";
import { StatCard } from "./stat-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const STATUS_MAP = {
  new:        { label: "Новый",      dot: "bg-blue-500",   bg: "bg-blue-500/10 text-blue-600" },
  pending:    { label: "Ожидает",    dot: "bg-orange-500", bg: "bg-orange-500/10 text-orange-600" },
  completed:  { label: "Завершен",   dot: "bg-green-500",  bg: "bg-green-500/10 text-green-600" },
  cancelled:  { label: "Отменен",    dot: "bg-red-500",    bg: "bg-red-500/10 text-red-500" },
} as const;

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as keyof typeof STATUS_MAP] || STATUS_MAP.new;
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
  const { chartData, recentOrders, setChartData, setRecentOrders, setRecentAnalysis, setPeople } = useDashboardStore();
  
  const [stats, setStats] = useState([
    { id: 1, title: "Клиенты", value: "0", trend: "+5%", isUp: true, icon: "users" as const },
    { id: 2, title: "Заказы", value: "0", trend: "+2%", isUp: true, icon: "clipboard-list" as const },
    { id: 3, title: "Анализы", value: "0", trend: "-1%", isUp: false, icon: "invoice" as const },
    { id: 4, title: "Выручка", value: "0", trend: "+12%", isUp: true, icon: "wallet" as const },
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        date: now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats([
            { id: 1, title: "Клиенты", value: data.users_count?.toString() || "0", trend: data.trends?.users || "+3%", isUp: true, icon: "users" },
            { id: 2, title: "Заказы", value: data.pending_orders?.toString() || "0", trend: data.trends?.orders || "+5%", isUp: true, icon: "clipboard-list" },
            { id: 3, title: "Анализы", value: data.pending_analysis?.toString() || "0", trend: data.trends?.analysis || "-2%", isUp: false, icon: "invoice" },
            { id: 4, title: "Выручка", value: (data.revenue || 0).toLocaleString(), trend: data.trends?.revenue || "+15%", isUp: true, icon: "wallet" },
          ]);

          if (data.chart_data && setChartData) setChartData(data.chart_data);
          if (data.recent_orders && setRecentOrders) setRecentOrders(data.recent_orders);
          if (data.recent_analysis && setRecentAnalysis) setRecentAnalysis(data.recent_analysis);
          if (data.recent_users && setPeople) setPeople(data.recent_users);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, [setChartData, setRecentOrders, setRecentAnalysis, setPeople]);

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      <div className={cn(
        "flex-1 overflow-y-auto transition-all duration-300 bg-[#f2f2f7] dark:bg-[#000000] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none",
        isUpdating ? "opacity-50 pointer-events-none" : "opacity-100"
      )}>
        <DashboardHeader />
        
        {/* Mini Toolbar - Reference Style */}
        <div className="h-auto py-2.5 sm:h-14 sm:py-0 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-14 border-b border-black/5 dark:border-white/10 gap-2 sm:gap-0">
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
              <PeriodFilter isCompact onPeriodChange={() => { setIsUpdating(true); setTimeout(() => setIsUpdating(false), 500); }} />
            </div>
            <Button variant="ghost" size="sm" className="h-[36px] w-[36px] sm:w-auto sm:px-3 rounded-full sm:rounded-[12px] text-[11px] font-bold border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors shadow-none shrink-0 flex items-center justify-center p-0 sm:p-auto group">
              <Download className="size-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Экспорт</span>
            </Button>
          </div>
        </div>

        <div className="w-full space-y-4 p-3 sm:p-5">

          {/* Compact Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                trend={{ value: stat.trend, isUp: stat.isUp }}
                icon={stat.icon}
                chartData={[
                  { value: 400 }, { value: 300 }, { value: 500 }, 
                  { value: 400 }, { value: 600 }, { value: 500 }, { value: 700 }
                ]}
                color={i === 0 ? "#10b981" : i === 1 ? "#3b82f6" : i === 2 ? "#f59e0b" : "#8b5cf6"}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div className="lg:col-span-2 rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] p-5 border border-border/40 flex flex-col shadow-none">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground/60 tracking-tight">Аналитика потока</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-foreground/30 font-medium tracking-tight">Обновление в реальном времени</p>
                  </div>
                </div>
                <div className="h-6 px-3 flex items-center bg-[#007aff]/5 rounded-full border border-[#007aff]/10 shadow-none">
                   <span className="text-[10px] font-bold text-[#007aff] uppercase tracking-widest">Live System</span>
                </div>
              </div>

              <div className="h-[180px] w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart 
                    data={chartData.length > 0 ? chartData : [
                      { name: "09:00", value: 450 }, { name: "12:00", value: 850 },
                      { name: "15:00", value: 700 }, { name: "18:00", value: 1200 },
                      { name: "21:00", value: 950 },
                    ]} 
                    margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorFlowHessa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#007aff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/10" />
                    <XAxis 
                      dataKey={chartData[0]?.month ? "month" : "name"} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 700 }} 
                      dy={10} 
                      className="text-muted-foreground/30" 
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 500 }} className="text-muted-foreground/30" />
                    <Tooltip 
                      cursor={{ stroke: 'rgba(0,0,0,0.05)' }} 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', padding: '8px 12px', boxShadow: 'none' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={chartData[0]?.analysis !== undefined ? "analysis" : "value"} 
                      stroke="#007aff" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorFlowHessa)"
                      isAnimationActive={false}
                    />
                    <Bar 
                      dataKey={chartData[0]?.analysis !== undefined ? "analysis" : "value"} 
                      barSize={10} 
                      radius={[3, 3, 0, 0]} 
                      fill="currentColor" 
                      className="text-[#007aff]/10"
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40 mt-auto">
                <div className="space-y-0.5">
                   <p className="text-[10px] font-semibold text-foreground/30 tracking-tight">Пик</p>
                   <div className="flex items-baseline gap-1.5">
                     <span className="text-[15px] font-semibold tracking-tight text-foreground">18:30</span>
                     <span className="text-[10px] font-semibold text-emerald-500">+14%</span>
                   </div>
                </div>
                <div className="space-y-0.5 border-x border-border/40 px-4">
                   <p className="text-[10px] font-semibold text-foreground/30 tracking-tight">Среднее</p>
                   <p className="text-[15px] font-semibold tracking-tight text-foreground">24 мин</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[10px] font-semibold text-foreground/30 tracking-tight">Конверсия</p>
                   <div className="flex items-center gap-2">
                     <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden shadow-none">
                       <div className="h-full bg-primary w-[68%]" />
                     </div>
                     <span className="text-[11px] font-semibold text-primary">68%</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Redesigned Popular Sidebar - Ultra Compact Grey Style */}
            <div className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 border border-border/40 flex flex-col shadow-none">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-foreground uppercase tracking-tight">Популярное</h3>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] font-bold text-primary rounded-full hover:bg-primary/5 shadow-none">Все</Button>
              </div>
              <div className="space-y-1.5 flex-1">
                {[
                  { name: "Анализ крови", count: 145 },
                  { name: "УЗИ брюшной", count: 89 },
                  { name: "Терапевт", count: 64 },
                  { name: "МРТ суставов", count: 42 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all cursor-pointer group shadow-none">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 flex items-center justify-center shadow-none shrink-0 group-hover:scale-105 transition-transform">
                        <User className="size-3.5 text-foreground/40" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-foreground truncate leading-tight">{item.name}</p>
                        <p className="text-[9px] font-semibold text-foreground/30 uppercase tracking-tighter">{item.count} операций</p>
                      </div>
                    </div>
                    <ChevronRight className="size-3 text-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ultra-Tight Orders Table */}
          <div className="rounded-[2.25rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-border/40 shadow-none">
              <div className="p-4 border-b border-border/40 flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground/60 tracking-tight">Последние записи</h3>
                </div>
                <Button variant="ghost" className="h-7.5 px-3 text-[10px] font-semibold text-foreground/40 hover:text-primary rounded-lg flex items-center gap-2 border border-transparent hover:border-border/40 transition-all shadow-none">
                  Смотреть все <ChevronRight className="size-3" />
                </Button>
              </div>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border/40">
                        <th className="py-2.5 px-5 text-[10px] font-semibold text-foreground/30 text-left">ID</th>
                        <th className="py-2.5 px-5 text-[10px] font-semibold text-foreground/30 text-left">Клиент</th>
                        <th className="py-2.5 px-5 text-[10px] font-semibold text-foreground/30 text-left">Статус</th>
                        <th className="py-2.5 px-5 text-[10px] font-semibold text-foreground/30 text-right">Сумма</th>
                        <th className="py-2.5 px-5 text-[10px] font-semibold text-foreground/30 text-right">Время</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {(recentOrders.length > 0 ? recentOrders : Array(6).fill({})).map((order, i) => (
                        <tr key={i} className="group hover:bg-muted/20 transition-all cursor-pointer">
                          <td className="py-2.5 px-5 text-[11px] font-semibold text-primary tabular-nums tracking-tight">#{order.id || "1024"}</td>
                          <td className="py-2.5 px-5">
                             <div className="flex items-center gap-2.5">
                               <div className="size-7 rounded-full bg-muted border border-border/40 flex items-center justify-center text-[9px] font-semibold text-foreground/50 shadow-none">
                                 {order.customer_name?.charAt(0) || "C"}
                               </div>
                               <div>
                                 <p className="text-[12px] font-semibold text-foreground tracking-tight leading-none">{order.customer_name || "Клиент"}</p>
                                 <p className="text-[10px] font-medium text-foreground/20 mt-1">{order.customer_phone || "Нет телефона"}</p>
                               </div>
                             </div>
                          </td>
                          <td className="py-2.5 px-5">
                             <StatusBadge status={order.status || "new"} />
                          </td>
                          <td className="py-2.5 px-5 text-right text-[11px] font-semibold tabular-nums text-foreground">{(order.total_amount || 0).toLocaleString()} сум</td>
                          <td className="py-2.5 px-5 text-right">
                             <span className="text-[10px] font-medium text-foreground/20">{order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "14:20"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
