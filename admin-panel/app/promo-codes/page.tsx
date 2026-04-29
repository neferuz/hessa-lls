"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Ticket, Calendar as CalendarIcon, Package, Hash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { API_BASE_URL } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: number;
    name: string;
}

interface PromoCode {
    id?: number;
    code: string;
    discount_percent: number;
    valid_from?: string;
    valid_until?: string;
    is_active: boolean;
    usage_limit?: number;
    usage_count?: number;
    product_ids: number[];
}

export default function PromoCodesPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2 text-left">
                <Ticket className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Промокоды</h1>
            </div>
        ),
        description: "Управление скидочными кодами и акциями"
    });
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

    const [formData, setFormData] = useState<PromoCode>({
        code: "",
        discount_percent: 0,
        is_active: true,
        product_ids: []
    });

    useEffect(() => {
        fetchPromoCodes();
        fetchProducts();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/promo-codes`);
            if (res.ok) {
                const data = await res.json();
                setPromoCodes(data);
            }
        } catch (err) {
            console.error("Failed to fetch promo codes", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const handleSubmit = async () => {
        if (!formData.code || formData.discount_percent <= 0) {
            toast.error("Заполните обязательные поля");
            return;
        }

        try {
            const url = isEditing && editingPromo?.id
                ? `${API_BASE_URL}/api/promo-codes/${editingPromo.id}`
                : `${API_BASE_URL}/api/promo-codes`;

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(isEditing ? "Промокод обновлен" : "Промокод создан");
                fetchPromoCodes();
                resetForm();
            } else {
                toast.error("Ошибка сохранения промокода");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сохранения промокода");
        }
    };

    const handleDelete = async () => {
        if (!promoToDelete) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/promo-codes/${promoToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("Промокод удален");
                fetchPromoCodes();
                setShowDeleteDialog(false);
                setPromoToDelete(null);
            } else {
                toast.error("Ошибка удаления промокода");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка удаления промокода");
        }
    };

    const resetForm = () => {
        setFormData({
            code: "",
            discount_percent: 0,
            is_active: true,
            product_ids: []
        });
        setIsEditing(false);
        setEditingPromo(null);
        setShowDialog(false);
    };

    const startEdit = (promo: PromoCode) => {
        setIsEditing(true);
        setEditingPromo(promo);
        const formattedPromo = { ...promo };
        if (formattedPromo.valid_until) {
            formattedPromo.valid_until = formattedPromo.valid_until.split('T')[0];
        }
        setFormData(formattedPromo);
        setShowDialog(true);
    };

    const toggleActive = async (promo: PromoCode) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/promo-codes/${promo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...promo, is_active: !promo.is_active })
            });

            if (res.ok) {
                toast.success("Статус обновлен");
                fetchPromoCodes();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5 text-left">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <Ticket className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Промокоды</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {promoCodes.length}
                            </Badge>
                        </div>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={fetchPromoCodes}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-none"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Button onClick={() => setShowDialog(true)} size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none active:scale-95">
                        <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Создать
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full text-left">
                    {promoCodes.length === 0 && !loading ? (
                        <div className="text-center py-24">
                            <div className="inline-flex p-6 rounded-2xl bg-primary/5 mb-6">
                                <Megaphone className="size-16 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Промокоды не найдены</h3>
                            <p className="text-muted-foreground mb-6">
                                Создайте свой первый промокод для акций или специальных предложений
                            </p>
                            <Button onClick={() => setShowDialog(true)} className="gap-2 rounded-full px-6">
                                <Plus className="size-4" />
                                Создать промокод
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {promoCodes.map((promo) => (
                                <div key={promo.id} className={cn(
                                    "relative group rounded-[2rem] border border-black/5 dark:border-white/10 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 bg-white dark:bg-[#1c1c1e] p-6 space-y-4 shadow-none",
                                    !promo.is_active && "opacity-50 grayscale-[0.5]"
                                )}>
                                    <div className="flex justify-between items-start">
                                        <div className="text-left">
                                            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest block mb-1">Код доступа</span>
                                            <h3 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                                                <Ticket className="size-5 text-primary" />
                                                {promo.code}
                                            </h3>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            promo.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                                        )}>
                                            {promo.is_active ? "Активен" : "Отключен"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 py-2 border-y border-black/5 dark:border-white/5">
                                        <div className="flex-1 text-left">
                                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase block mb-0.5">Размер скидки</span>
                                            <span className="text-xl font-black text-primary">-{promo.discount_percent}%</span>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase block mb-0.5">Использование</span>
                                            <span className="text-xl font-black text-foreground tabular-nums">{promo.usage_count}{promo.usage_limit ? ` / ${promo.usage_limit}` : ''}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 text-left">
                                            <CalendarIcon className="size-3.5 opacity-40" />
                                            <span>
                                                До: {promo.valid_until ? format(new Date(promo.valid_until), 'dd.MM.yyyy') : 'Бессрочно'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 text-left">
                                            <Package className="size-3.5 opacity-40" />
                                            <span>
                                                {promo.product_ids && promo.product_ids.length > 0
                                                    ? `Товары: ${promo.product_ids.length}`
                                                    : 'Все товары'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleActive(promo)}
                                            className="flex-1 h-10 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-all"
                                        >
                                            {promo.is_active ? <ToggleRight className="size-5" /> : <ToggleLeft className="size-5" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => startEdit(promo)}
                                            className="h-10 w-10 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { setPromoToDelete(promo.id!); setShowDeleteDialog(true); }}
                                            className="h-10 w-10 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-0 p-8 shadow-2xl bg-white dark:bg-[#1c1c1e] text-left">
                    <DialogHeader className="text-left">
                        <DialogTitle className="text-xl font-black tracking-tight text-left">{isEditing ? "Редактировать промокод" : "Новый промокод"}</DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium text-left">
                            Введите данные промокода и выберите условия.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4 text-left">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Код (Заглавные буквы)</Label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                <Input
                                    id="code"
                                    className="h-12 pl-11 bg-black/5 dark:bg-white/5 border-0 rounded-2xl font-mono uppercase font-black text-[15px] focus-visible:ring-1 focus-visible:ring-primary/20"
                                    placeholder="SUMMER20"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="discount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Скидка (%)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    className="h-12 bg-black/5 dark:bg-white/5 border-0 rounded-2xl font-black text-center"
                                    value={formData.discount_percent || ""}
                                    onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="limit" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Лимит (Раз)</Label>
                                <Input
                                    id="limit"
                                    type="number"
                                    className="h-12 bg-black/5 dark:bg-white/5 border-0 rounded-2xl font-black text-center"
                                    placeholder="∞"
                                    value={formData.usage_limit || ""}
                                    onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) || undefined })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="until" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Действует до</Label>
                            <Input
                                id="until"
                                type="date"
                                className="h-12 bg-black/5 dark:bg-white/5 border-0 rounded-2xl font-bold px-4"
                                value={formData.valid_until || ""}
                                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Выбор товаров</Label>
                            <div className="border border-black/5 dark:border-white/5 rounded-2xl p-4 max-h-40 overflow-y-auto space-y-2 bg-black/[0.02] dark:bg-white/[0.02] scrollbar-none text-left">
                                {products.length === 0 && <p className="text-[11px] text-muted-foreground text-center py-2">Загрузка товаров...</p>}
                                {products.map((p) => (
                                    <div key={p.id} className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-white dark:hover:bg-black/40 transition-all text-left">
                                        <Checkbox
                                            id={`p-${p.id}`}
                                            className="rounded-full size-4 border-black/10 dark:border-white/10"
                                            checked={formData.product_ids?.includes(p.id)}
                                            onCheckedChange={(checked) => {
                                                const currentIds = formData.product_ids || [];
                                                const ids = checked
                                                    ? [...currentIds, p.id]
                                                    : currentIds.filter(id => id !== p.id);
                                                setFormData({ ...formData, product_ids: ids });
                                            }}
                                        />
                                        <Label htmlFor={`p-${p.id}`} className="text-[12px] font-bold cursor-pointer truncate flex-1 text-left">
                                            {p.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[9px] text-muted-foreground/50 font-medium px-1 text-left">Если товары не выбраны, промокод будет действовать на все категории.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-6">
                        <Button variant="ghost" onClick={resetForm} className="flex-1 h-12 rounded-full font-bold">Отмена</Button>
                        <Button onClick={handleSubmit} disabled={!formData.code || formData.discount_percent <= 0} className="flex-1 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-black shadow-xl shadow-black/10">
                            {isEditing ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="rounded-[2rem] border-0 bg-white dark:bg-[#1c1c1e] p-8 text-left">
                    <DialogHeader className="text-left">
                        <DialogTitle className="text-xl font-black text-left">Удалить промокод?</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground text-left">
                            Это действие невозможно отменить. Акция будет мгновенно прекращена для всех клиентов.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 mt-6">
                        <Button variant="ghost" onClick={() => setShowDeleteDialog(false)} className="flex-1 h-12 rounded-full font-bold">Отмена</Button>
                        <Button variant="destructive" onClick={handleDelete} className="flex-1 h-12 rounded-full font-black shadow-xl shadow-red-500/20">Удалить</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
