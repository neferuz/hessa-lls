"use client";

import { useState, useEffect } from "react";
import { 
    Plus, 
    Sparkles, 
    Loader2, 
    Trash2, 
    Pencil, 
    RefreshCw, 
    Search,
    ChevronRight,
    X,
    CreditCard,
    Clock,
    Star,
    Archive,
    Eye,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { API_BASE_URL } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface Plan {
    id?: number;
    title: string;
    duration: string;
    price: number;
    old_price: number;
    items: string;
    is_recommended: boolean;
    is_active: boolean;
}

export default function PlansPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Тарифные планы</h1>
            </div>
        ),
        description: "Управление подписками, ценами и привилегиями пользователей"
    });
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState<Partial<Plan>>({});

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/plans`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setPlans(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Не удалось загрузить планы");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const filteredPlans = plans.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.duration.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenDrawer = (plan: Plan | null = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({ ...plan });
        } else {
            setEditingPlan(null);
            setFormData({
                title: "",
                duration: "",
                price: 0,
                old_price: 0,
                items: "",
                is_recommended: false,
                is_active: true
            });
        }
        setIsDrawerOpen(true);
    };

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat('ru-RU').format(val);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.duration) {
            toast.warning("Заполните название и длительность");
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingPlan
                ? `${API_BASE_URL}/api/plans/${editingPlan.id}`
                : `${API_BASE_URL}/api/plans`;

            const method = editingPlan ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsDrawerOpen(false);
                fetchPlans();
                toast.success(editingPlan ? "План обновлен" : "План создан");
            } else {
                const err = await res.json();
                toast.error(err.detail || "Ошибка при сохранении");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сети");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!planToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/plans/${planToDelete.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("План удален");
                fetchPlans();
                setIsDeleteDialogOpen(false);
            } else {
                const err = await res.json();
                toast.error(err.detail || "Ошибка при удалении");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сети");
        } finally {
            setIsDeleting(false);
            setPlanToDelete(null);
        }
    };

    const stats = [
        { label: "Всего планов", value: plans.length, icon: CreditCard, color: "text-[#007aff]" },
        { label: "Активные тарифы", value: plans.filter(p => p.is_active).length, icon: Eye, color: "text-green-500" },
        { label: "Рекомендуемые", value: plans.filter(p => p.is_recommended).length, icon: Star, color: "text-amber-500" },
    ];

    return (
        <>

            {/* Toolbar - Command Center Style */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <Sparkles className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Тарифные планы</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {plans.length}
                            </Badge>
                        </div>
                        
                        <div className="sm:hidden flex items-center gap-2">
                            <Button onClick={() => handleOpenDrawer()} size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                                <Plus className="size-4" strokeWidth={2.5} />
                            </Button>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0">
                        <div className="relative group flex-1 sm:w-[260px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск планов..."
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
                        onClick={fetchPlans}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-none"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Button onClick={() => handleOpenDrawer()} size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none active:scale-95">
                        <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Создать тариф
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {stats.map((s) => (
                            <div key={s.label} className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left shadow-none hover:border-black/10 dark:hover:border-white/20">
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className={cn("size-8 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5", s.color)}>
                                        <s.icon className="size-4" />
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
                    <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 shadow-none">
                        <div className="hidden sm:block">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                                    <tr>
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Название плана</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Длительность</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Стоимость</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Статус</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                    {loading ? (
                                        [...Array(4)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-24 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-32 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-16 bg-black/5 dark:bg-white/5 rounded-full mx-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredPlans.map((plan) => (
                                        <tr 
                                            key={plan.id} 
                                            onClick={() => handleOpenDrawer(plan)}
                                            className={cn(
                                                "h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer",
                                                !plan.is_active && "opacity-60 grayscale-[0.5]"
                                            )}
                                        >
                                            <td className="py-2.5 px-5 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "size-10 rounded-xl flex items-center justify-center border transition-all duration-300",
                                                        plan.is_recommended 
                                                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5 scale-105" 
                                                            : "bg-primary/10 text-primary border-primary/10"
                                                    )}>
                                                        {plan.is_recommended ? <Star className="size-5 fill-current" /> : <CreditCard className="size-5" />}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[14px] font-bold text-foreground group-hover/row:text-primary transition-colors">{plan.title}</span>
                                                        {plan.is_recommended && (
                                                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest mt-0.5 italic">Рекомендуемый</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 text-left">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-3.5 text-muted-foreground/40" />
                                                    <span className="text-[12px] font-bold text-foreground/70">{plan.duration}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[15px] font-black tabular-nums tracking-tight">
                                                        {formatPrice(plan.price)} <span className="text-[10px] text-muted-foreground/60 uppercase font-bold">UZS</span>
                                                    </span>
                                                    {plan.old_price > 0 && (
                                                        <span className="text-[10px] font-bold text-muted-foreground/40 line-through tabular-nums -mt-1">
                                                            {formatPrice(plan.old_price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <Badge variant="outline" className={cn(
                                                    "h-5 px-2.5 text-[9px] font-black uppercase tracking-widest border-0 rounded-full",
                                                    plan.is_active ? "bg-green-500/10 text-green-600" : "bg-black/5 dark:bg-white/10 text-muted-foreground/40"
                                                )}>
                                                    {plan.is_active ? "Активен" : "Скрыт"}
                                                </Badge>
                                            </td>
                                            <td className="pr-5 text-right">
                                                <ChevronRight className="size-4 opacity-20 group-hover/row:opacity-100 transition-all" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10 text-left">
                            {filteredPlans.map((plan) => (
                                <div key={plan.id} className="p-4 flex flex-col gap-4 active:bg-black/5 transition-colors" onClick={() => handleOpenDrawer(plan)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "size-10 rounded-xl flex items-center justify-center border",
                                                plan.is_recommended ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/10"
                                            )}>
                                                {plan.is_recommended ? <Star className="size-5 fill-current" /> : <CreditCard className="size-5" />}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-[14px] font-bold">{plan.title}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground/40">{plan.duration}</span>
                                            </div>
                                        </div>
                                        <div className="text-[14px] font-black tabular-nums">
                                            {formatPrice(plan.price)} <span className="text-[9px] opacity-40 font-bold">UZS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredPlans.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Archive className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-semibold tracking-tight mb-2 text-left">Планы не найдены</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed text-left">
                                    По вашему запросу ничего не найдено.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Detail Drawer */}
            <AnimatePresence mode="wait">
                {isDrawerOpen && (
                    <>
                        <motion.div
                            key="drawer-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            key="drawer-content"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-[#1c1c1e] z-[101] shadow-2xl flex flex-col text-left border-l border-black/5 dark:border-white/5"
                        >
                            {/* Compact Header */}
                            <div className="p-4 px-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-xl sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                        {editingPlan ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-bold tracking-tight">
                                            {editingPlan ? "Конфигурация" : "Новый тариф"}
                                        </h2>
                                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                            {editingPlan ? `СИСТЕМА БИЛЛИНГА` : "Подписочная система"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="rounded-full size-8 hover:bg-black/5 dark:hover:bg-white/5"
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 py-5 space-y-6 scrollbar-none">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Название тарифа</Label>
                                        <Input
                                            value={formData.title || ""}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Например: Премиум"
                                            className="h-10 px-4 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[13px] font-bold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Длительность</Label>
                                            <Input
                                                value={formData.duration || ""}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                placeholder="30 дней"
                                                className="h-10 px-4 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[12px] font-bold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Цена (UZS)</Label>
                                            <Input
                                                type="number"
                                                value={formData.price || 0}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                className="h-10 px-4 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[12px] font-black focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all tabular-nums"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Старая цена</Label>
                                        <Input
                                            type="number"
                                            value={formData.old_price || 0}
                                            onChange={(e) => setFormData({ ...formData, old_price: Number(e.target.value) })}
                                            className="h-10 px-4 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[12px] font-bold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all tabular-nums"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Преимущества (список)</Label>
                                        <Textarea
                                            value={formData.items || ""}
                                            onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                                            placeholder="Перечислите преимущества..."
                                            className="min-h-[100px] p-3.5 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[12px] font-semibold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_recommended: !formData.is_recommended })}
                                            className={cn(
                                                "flex flex-col items-start p-3 rounded-2xl border transition-all text-left group/btn",
                                                formData.is_recommended 
                                                    ? "border-amber-500/30 bg-amber-500/5 shadow-inner" 
                                                    : "border-black/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/10"
                                            )}
                                        >
                                            <Star className={cn("size-3.5 mb-2 transition-transform group-active/btn:scale-90", formData.is_recommended ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30")} />
                                            <span className="text-[9px] font-black uppercase tracking-wider mb-0.5">Recommended</span>
                                            <span className="text-[8px] text-muted-foreground/60 leading-tight uppercase font-bold tracking-widest">Топ тариф</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={cn(
                                                "flex flex-col items-start p-3 rounded-2xl border transition-all text-left group/btn",
                                                formData.is_active 
                                                    ? "border-green-500/30 bg-green-500/5 shadow-inner" 
                                                    : "border-black/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/10"
                                            )}
                                        >
                                            <div className={cn("size-2 rounded-full mb-3", formData.is_active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-muted-foreground/30")} />
                                            <span className="text-[9px] font-black uppercase tracking-wider mb-0.5">Status</span>
                                            <span className="text-[8px] text-muted-foreground/60 leading-tight uppercase font-bold tracking-widest">{formData.is_active ? "Visible" : "Hidden"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 px-6 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-xl shrink-0">
                                <div className="flex gap-2">
                                    {editingPlan && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setPlanToDelete(editingPlan);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                            className="h-11 w-11 shrink-0 rounded-full text-red-500 hover:bg-red-500/5 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 h-11 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-[13px] shadow-xl shadow-black/5 active:scale-[0.98] transition-all gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                        {editingPlan ? "Сохранить" : "Создать план"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Удалить план?"
                description={`Вы собираетесь удалить тариф "${planToDelete?.title}". Это действие необратимо.`}
            />
        </>
    );
}
