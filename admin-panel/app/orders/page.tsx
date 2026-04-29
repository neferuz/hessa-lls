"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Search, Filter, ClipboardList, MoreHorizontal, Eye, 
    CheckCircle2, Clock, XCircle, Truck, ShoppingCart,
    Activity, Star, Wallet, RefreshCw, Archive, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

const STATUS_MAP: any = {
    new: { label: "Новый", color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock, dot: "bg-blue-500" },
    pending: { label: "В работе", color: "text-orange-500", bg: "bg-orange-500/10", icon: Truck, dot: "bg-orange-500" },
    completed: { label: "Завершен", color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2, dot: "bg-green-500" },
    cancelled: { label: "Отменен", color: "text-red-500", bg: "bg-red-500/10", icon: XCircle, dot: "bg-red-500" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Управление заказами</h1>
            </div>
        ),
        description: "Мониторинг и обработка входящих заказов"
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/orders`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(o => 
        o.id.toString().includes(searchQuery) ||
        o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_phone?.includes(searchQuery)
    );

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'new' || o.status === 'pending').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5 text-left">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <ShoppingCart className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Заказы</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {orders.length}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0 text-left">
                        <div className="relative group flex-1 sm:w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск по ID, имени или телефону..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={fetchOrders}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl text-[12px] font-bold gap-2">
                        <Filter className="size-4 opacity-40" /> Фильтры
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
                        {[
                            { label: "Всего заказов", value: orders.length, icon: ShoppingCart, color: "text-[#007aff]", trend: "Все время", isUp: true },
                            { label: "В ожидании", value: pendingCount, icon: Clock, color: "text-orange-500", trend: "Требуют внимания", isUp: true },
                            { label: "Выручка", value: totalRevenue, icon: Wallet, color: "text-green-500", trend: "сум", isUp: true },
                            { label: "Завершено", value: completedCount, icon: CheckCircle2, color: "text-emerald-500", trend: "Успешно", isUp: true },
                        ].map((s) => (
                            <div key={s.label} className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left shadow-none hover:border-black/10 dark:hover:border-white/20">
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className={cn("size-8 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5", s.color)}>
                                        <s.icon className="size-4" />
                                    </div>
                                    <div className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", s.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500")}>
                                        {s.trend}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-semibold tracking-tight mb-0.5 whitespace-nowrap text-left">{s.label}</p>
                                    <div className="flex items-baseline gap-1">
                                        <AnimatedNumber value={s.value} className="text-[18px] sm:text-[20px] font-black tracking-tight tabular-nums" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Container */}
                    <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 shadow-none text-left">
                        <div className="hidden sm:block">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                                    <tr>
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">ID</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Клиент</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Дата</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Сумма</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center w-28">Статус</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                    {loading ? (
                                        [...Array(8)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="h-8 w-12 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-32 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-24 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-full mx-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredOrders.map((order) => (
                                        <tr key={order.id} className="h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left" onClick={() => router.push(`/orders/${order.id}`)}>
                                            <td className="py-2.5 px-5 text-[13px] font-black tabular-nums text-primary/60">#{order.id}</td>
                                            <td className="py-2.5 px-4">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[13px] font-bold text-foreground group-hover/row:text-primary transition-colors">{order.customer_name || "Не указан"}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 tabular-nums uppercase tracking-widest">{order.customer_phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-4">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[12px] font-medium text-foreground/70">{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground/30">{new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <span className="text-[14px] font-black tabular-nums">
                                                    {order.total_amount?.toLocaleString()} <span className="text-[10px] font-medium opacity-30 ml-0.5">сум</span>
                                                </span>
                                            </td>
                                            <td className="px-4 text-center">
                                                {(() => {
                                                    const s = STATUS_MAP[order.status] || STATUS_MAP.new;
                                                    return (
                                                        <Badge variant="outline" className={cn(
                                                            "h-[22px] px-2.5 text-[9px] font-black border-0 rounded-md uppercase tracking-wider",
                                                            s.bg, s.color
                                                        )}>
                                                            <span className={cn("size-1.5 rounded-full mr-1.5", s.dot)} />
                                                            {s.label}
                                                        </Badge>
                                                    );
                                                })()}
                                            </td>
                                            <td className="pr-5 text-right">
                                                <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-40 hover:opacity-100 transition-opacity ml-auto">
                                                    <Eye className="size-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10 text-left">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="p-4 flex flex-col gap-3 active:bg-black/5 transition-colors" onClick={() => router.push(`/orders/${order.id}`)}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-black text-primary">#{order.id}</span>
                                        {(() => {
                                            const s = STATUS_MAP[order.status] || STATUS_MAP.new;
                                            return (
                                                <Badge variant="outline" className={cn("h-[20px] px-2 text-[9px] font-black border-0 rounded-md uppercase tracking-wider", s.bg, s.color)}>
                                                    {s.label}
                                                </Badge>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold">{order.customer_name || "Не указан"}</span>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[12px] font-black tabular-nums">{order.total_amount?.toLocaleString()} сум</span>
                                            <span className="text-[10px] font-medium text-muted-foreground/40">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredOrders.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Archive className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-black tracking-tight mb-2">Заказы не найдены</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px]">
                                    По вашему запросу ничего не найдено.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
