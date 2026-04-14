"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<number | null>(null);

    const [formData, setFormData] = useState<Plan>({
        title: "",
        duration: "",
        price: 0,
        old_price: 0,
        items: "",
        is_recommended: false,
        is_active: true
    });

    const formatPrice = (value: number | string) => {
        if (value === 0 || value === "0") return "0";
        if (!value) return "";
        const num = String(value).replace(/\D/g, "");
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const parsePrice = (value: string) => {
        return parseInt(value.replace(/\D/g, "") || "0", 10);
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (err) {
            console.error("Failed to fetch plans", err);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.duration) {
            toast.error("Заполните обязательные поля");
            return;
        }

        try {
            const url = isEditing && editingPlan?.id
                ? `http://localhost:8000/api/plans/${editingPlan.id}`
                : 'http://localhost:8000/api/plans';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(isEditing ? "План обновлен" : "План создан");
                fetchPlans();
                resetForm();
            } else {
                toast.error("Ошибка сохранения плана");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сохранения плана");
        }
    };

    const handleDelete = async () => {
        if (!planToDelete) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/plans/${planToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("План удален");
                fetchPlans();
                setShowDeleteDialog(false);
                setPlanToDelete(null);
            } else {
                toast.error("Ошибка удаления плана");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка удаления плана");
        }
    };

    const toggleActive = async (plan: Plan) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/plans/${plan.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...plan, is_active: !plan.is_active })
            });

            if (res.ok) {
                toast.success("Статус обновлен");
                fetchPlans();
            } else {
                toast.error("Ошибка обновления плана");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка обновления плана");
        }
    };

    const startEdit = (plan: Plan) => {
        setIsEditing(true);
        setEditingPlan(plan);
        setFormData(plan);
        setShowDialog(true);
    };

    const openCreateDialog = () => {
        resetForm();
        setShowDialog(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            duration: "",
            price: 0,
            old_price: 0,
            items: "",
            is_recommended: false,
            is_active: true
        });
        setIsEditing(false);
        setEditingPlan(null);
        setShowDialog(false);
    };

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-stretch justify-start bg-container h-full w-full bg-background">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-3">
                                <Sparkles className="size-5 text-muted-foreground" />
                                <h1 className="text-base font-medium tracking-tight">Планы подписки</h1>
                            </div>
                        }
                        actions={
                            <Button
                                onClick={openCreateDialog}
                                size="sm"
                                className="h-9 px-5 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-95"
                            >
                                <Plus className="size-4 mr-2 stroke-[2.5]" />
                                Добавить план
                            </Button>
                        }
                    />

                    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                        <div className="w-full">
                            {plans.length === 0 ? (
                                <div className="text-center py-24">
                                    <div className="inline-flex p-6 rounded-2xl bg-primary/5 mb-6">
                                        <Sparkles className="size-16 text-primary/40" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Планы не созданы</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Создайте первый тарифный план для ваших клиентов
                                    </p>
                                    <Button onClick={openCreateDialog} className="gap-2 shrink-0 h-11 px-8 rounded-full font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all">
                                        <Plus className="size-5 mr-1 stroke-[2.5]" />
                                        Создать первый план
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={cn(
                                                "relative group rounded-[2rem] border transition-all duration-300",
                                                plan.is_recommended
                                                    ? "border-primary/20 bg-primary/[0.01] shadow-lg shadow-primary/5"
                                                    : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50",
                                                !plan.is_active && "opacity-60 grayscale-[0.2]"
                                            )}
                                        >
                                            {/* Minimal Badge */}
                                            {plan.is_recommended && (
                                                <div className="absolute top-5 right-5 animate-in fade-in zoom-in duration-500">
                                                    <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                                        <Star className="size-3 fill-current" />
                                                        <span className="text-[9px] font-black uppercase tracking-wider">Выбор редакции</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6 flex flex-col h-full gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "h-2 w-2 rounded-full",
                                                            plan.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300"
                                                        )} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                            {plan.duration}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                                                        {plan.title}
                                                    </h3>
                                                </div>

                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-3xl font-black tracking-tighter text-slate-900">
                                                        {formatPrice(plan.price)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">сум</span>
                                                    {plan.old_price > 0 && (
                                                        <span className="text-xs font-medium text-slate-300 line-through ml-1">
                                                            {formatPrice(plan.old_price)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[2.5rem] bg-slate-50/50 rounded-xl p-3 border border-slate-50">
                                                    {plan.items}
                                                </div>

                                                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleActive(plan)}
                                                        className={cn(
                                                            "flex-1 h-10 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all",
                                                            plan.is_active
                                                                ? "text-emerald-600 hover:bg-emerald-50"
                                                                : "text-slate-400 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        {plan.is_active ? (
                                                            <><ToggleRight className="size-4 mr-2" /> Активен</>
                                                        ) : (
                                                            <><ToggleLeft className="size-4 mr-2" /> Скрыт</>
                                                        )}
                                                    </Button>
                                                    <div className="h-4 w-px bg-slate-100" />
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => startEdit(plan)}
                                                            className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                                                        >
                                                            <Edit2 className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => { setPlanToDelete(plan.id!); setShowDeleteDialog(true); }}
                                                            className="h-10 w-10 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Create/Edit Dialog */}
                    <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                            <div className="p-8 space-y-8">
                                <DialogHeader className="space-y-2 text-left">
                                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                                        {isEditing ? "Редактировать план" : "Новый тарифный план"}
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                        Заполните информацию о тарифе. Эти данные будут отображаться пользователям на странице рекомендаций.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                            Название тарифа
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Например: Оптимальный"
                                            className="h-12 px-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="duration" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                                Длительность
                                            </Label>
                                            <Input
                                                id="duration"
                                                placeholder="1 месяц"
                                                className="h-12 px-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                                Стоимость (сум)
                                            </Label>
                                            <Input
                                                id="price"
                                                placeholder="0"
                                                className="h-12 px-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-bold"
                                                value={formatPrice(formData.price)}
                                                onChange={(e) => setFormData({ ...formData, price: parsePrice(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="old_price" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                            Старая цена (для скидки)
                                        </Label>
                                        <Input
                                            id="old_price"
                                            placeholder="0"
                                            className="h-12 px-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                                            value={formatPrice(formData.old_price)}
                                            onChange={(e) => setFormData({ ...formData, old_price: parsePrice(e.target.value) })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="items" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                            Что входит в план
                                        </Label>
                                        <Textarea
                                            id="items"
                                            placeholder="Опишите преимущества или состав плана..."
                                            className="min-h-[100px] p-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all resize-none"
                                            value={formData.items}
                                            onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_recommended: !formData.is_recommended })}
                                            className={cn(
                                                "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left",
                                                formData.is_recommended 
                                                    ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                                                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                                            )}
                                        >
                                            <Star className={cn("size-4 mb-2", formData.is_recommended ? "text-primary fill-primary" : "text-slate-400")} />
                                            <span className="text-[11px] font-bold uppercase tracking-wider mb-0.5">Рекомендуем</span>
                                            <span className="text-[10px] text-muted-foreground leading-tight">Выбор редакции</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={cn(
                                                "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left",
                                                formData.is_active 
                                                    ? "border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/5" 
                                                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                                            )}
                                        >
                                            <div className={cn("size-2 rounded-full mb-3", formData.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                                            <span className="text-[11px] font-bold uppercase tracking-wider mb-0.5">Статус</span>
                                            <span className="text-[10px] text-muted-foreground leading-tight">{formData.is_active ? "Отображается" : "Скрыт"}</span>
                                        </button>
                                    </div>
                                </div>

                                <footer className="flex items-center gap-3 pt-4">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setShowDialog(false)}
                                        className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                                    >
                                        Отмена
                                    </Button>
                                    <Button 
                                        onClick={handleSubmit} 
                                        disabled={!formData.title}
                                        className="flex-[2] h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                    >
                                        {isEditing ? "Сохранить изменения" : "Создать план"}
                                    </Button>
                                </footer>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Удалить план?</DialogTitle>
                                <DialogDescription>
                                    Вы уверены, что хотите удалить этот план? Это действие нельзя отменить.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3 mt-4">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                    Отмена
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Удалить
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </SidebarProvider>
    );
}
