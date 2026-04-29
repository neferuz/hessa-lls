"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Plus, Search, MoreHorizontal, Edit2, Trash2, Mail, Phone, 
    Briefcase, Activity, Star, ShieldBan, RefreshCw, Archive,
    ChevronRight, Wallet, Clock, CheckCircle2, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface Employee {
    id: number;
    username: string;
    email: string;
    phone: string | null;
    full_name: string | null;
    position: string | null;
    is_active: boolean;
    created_at: string;
    tokens?: number;
}

const STATUS_CONFIG = {
    Active: { label: "Активен", color: "text-green-600", bg: "bg-green-500/10", dot: "bg-green-500" },
    Suspended: { label: "Отстранен", color: "text-red-500", bg: "bg-red-500/10", dot: "bg-red-500" },
};

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Briefcase className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Штат сотрудников</h1>
            </div>
        ),
        description: "Управление командой и правами доступа"
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/employees`);
            if (res.ok) {
                const data = await res.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(e => 
        (e.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.username || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = employees.filter(e => e.is_active).length;
    const suspendedCount = employees.length - activeCount;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5 text-left">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <Briefcase className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Штат</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {employees.length}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0 text-left">
                        <div className="relative group flex-1 sm:w-[260px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск по штату..."
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
                        onClick={fetchEmployees}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-black bg-black dark:bg-white text-white dark:text-black shadow-none active:scale-95 transition-all">
                        <Plus className="size-4 mr-1.5 stroke-[2.5]" /> Добавить
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
                        {[
                            { label: "Всего штата", value: employees.length, icon: Briefcase, color: "text-[#007aff]", trend: "Команда", isUp: true },
                            { label: "На смене", value: activeCount, icon: Activity, color: "text-green-500", trend: "Активны", isUp: true },
                            { label: "Должности", value: Array.from(new Set(employees.map(e => e.position))).length, icon: Star, color: "text-orange-500", trend: "Разные", isUp: true },
                            { label: "Отстранены", value: suspendedCount, icon: ShieldBan, color: "text-red-500", trend: "0", isUp: false },
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

                    {/* Table */}
                    <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 shadow-none text-left">
                        <div className="hidden sm:block">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                                    <tr>
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Сотрудник</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Должность</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Контакт</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Стаж</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center w-28">Статус</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-32 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-32 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-16 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-full mx-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredEmployees.map((emp) => (
                                        <tr key={emp.id} className="h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left" onClick={() => router.push(`/employees/${emp.id}`)}>
                                            <td className="py-2.5 px-5">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black border border-primary/10 uppercase tabular-nums">
                                                        {emp.full_name?.[0] || emp.username[0]}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[13px] font-bold text-foreground group-hover/row:text-primary transition-colors">{emp.full_name || emp.username}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 tabular-nums uppercase tracking-widest">#{emp.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[13px] font-bold text-foreground/80">{emp.position || "Сотрудник"}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider">Hessa Staff</span>
                                                </div>
                                            </td>
                                            <td className="px-4">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[13px] font-bold text-foreground/80 tabular-nums">{emp.phone || "—"}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground/40">{emp.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <div className="flex items-center justify-center gap-2 text-foreground/80 font-bold text-[13px] tabular-nums">
                                                    <Clock className="size-3.5 opacity-40" />
                                                    {Math.floor((Date.now() - new Date(emp.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30))} м.
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <Badge variant="outline" className={cn(
                                                    "h-[22px] px-2.5 text-[9px] font-black border-0 rounded-md uppercase tracking-wider",
                                                    emp.is_active ? STATUS_CONFIG.Active.bg + " " + STATUS_CONFIG.Active.color : STATUS_CONFIG.Suspended.bg + " " + STATUS_CONFIG.Suspended.color
                                                )}>
                                                    <span className={cn("size-1.5 rounded-full mr-1.5", emp.is_active ? STATUS_CONFIG.Active.dot : STATUS_CONFIG.Suspended.dot)} />
                                                    {emp.is_active ? STATUS_CONFIG.Active.label : STATUS_CONFIG.Suspended.label}
                                                </Badge>
                                            </td>
                                            <td className="pr-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-40 hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl p-1 shadow-2xl border-black/5">
                                                        <DropdownMenuItem className="rounded-xl py-2 px-3 text-[12px] font-medium gap-2">
                                                            <Edit2 className="size-4 opacity-40" /> Изменить
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl py-2 px-3 text-[12px] font-medium gap-2 text-red-500">
                                                            <Trash2 className="size-4" /> Удалить
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10 text-left">
                            {filteredEmployees.map((emp) => (
                                <div key={emp.id} className="p-4 flex flex-col gap-4 active:bg-black/5 transition-colors" onClick={() => router.push(`/employees/${emp.id}`)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black">
                                                {emp.full_name?.[0] || emp.username[0]}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-[14px] font-bold">{emp.full_name || emp.username}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground/40">{emp.position}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn(
                                            "h-[20px] px-2 text-[9px] font-black border-0 rounded-md uppercase tracking-wider",
                                            emp.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {emp.is_active ? "Активен" : "Отстранен"}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredEmployees.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Search className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-black tracking-tight mb-2">Сотрудники не найдены</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px]">
                                    По запросу <span className="text-foreground font-bold italic">«{searchQuery}»</span> ничего не найдено.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
