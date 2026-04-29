"use client";

import { useState, useEffect } from "react";
import { 
    Plus, 
    Layers, 
    MoreHorizontal, 
    Loader2, 
    Trash2, 
    Pencil, 
    Package, 
    RefreshCw, 
    Search,
    ChevronRight,
    Folder,
    Archive,
    CheckCircle2,
    X,
    FileText,
    Layers as LayersIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { API_BASE_URL } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";

export default function CategoriesPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Layers className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Категории товаров</h1>
            </div>
        ),
        description: "Управление структурой каталога и группировкой продуктов"
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", description_short: "", description: "" });

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [catToDelete, setCatToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/categories`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Не удалось загрузить категории");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description_short && c.description_short.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleOpenDrawer = (cat: any = null) => {
        if (cat) {
            setEditingCategory(cat);
            setFormData({
                name: cat.name,
                description_short: cat.description_short || "",
                description: cat.description || ""
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", description_short: "", description: "" });
        }
        setIsDrawerOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.warning("Введите название категории");
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingCategory
                ? `${API_BASE_URL}/api/categories/${editingCategory.id}`
                : `${API_BASE_URL}/api/categories`;

            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsDrawerOpen(false);
                fetchCategories();
                toast.success(editingCategory ? "Категория обновлена" : "Категория создана");
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
        if (!catToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/categories/${catToDelete.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Категория удалена");
                fetchCategories();
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
            setCatToDelete(null);
        }
    };

    const stats = [
        { label: "Всего категорий", value: categories.length, icon: Layers, color: "text-[#007aff]", trend: "Структура", isUp: true },
        { label: "С товарами", value: categories.filter(c => (c.products_count || 0) > 0).length, icon: CheckCircle2, color: "text-green-500", trend: "Активные", isUp: true },
        { label: "Пустые", value: categories.filter(c => (c.products_count || 0) === 0).length, icon: Archive, color: "text-amber-500", trend: "Без товаров", isUp: false },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5 text-left">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <LayersIcon className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Категории</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {categories.length}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0">
                        <div className="relative group flex-1 sm:w-[260px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск категорий..."
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
                        onClick={fetchCategories}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-none"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Button onClick={() => handleOpenDrawer()} size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none active:scale-95">
                        <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Создать
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
                        {stats.map((s) => (
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
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Категория</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Описание</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Товаров</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center w-32">ID</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                    {loading ? (
                                        [...Array(6)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-40 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-16 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredCategories.map((cat) => (
                                        <tr 
                                            key={cat.id} 
                                            onClick={() => handleOpenDrawer(cat)}
                                            className="h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
                                        >
                                            <td className="py-2.5 px-5">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                                        <LayersIcon className="size-5" />
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[13px] font-bold text-foreground group-hover/row:text-primary transition-colors">{cat.name}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 uppercase tracking-widest tabular-nums">#{cat.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4">
                                                <div className="flex items-center gap-2.5 text-left">
                                                    <div className="size-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 shrink-0">
                                                        <FileText className="size-3 text-muted-foreground/60" />
                                                    </div>
                                                    <span className="text-[12px] font-bold text-foreground/80 truncate max-w-[300px]">
                                                        {cat.description_short || "Нет описания"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] text-[12px] font-black tabular-nums">
                                                    <Package className="size-3 opacity-40" />
                                                    {cat.products_count || 0}
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <span className="text-[11px] font-black opacity-30 tabular-nums">ID: {cat.id}</span>
                                            </td>
                                            <td className="pr-5 text-right">
                                                <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-20 group-hover/row:opacity-100 transition-all ml-auto">
                                                    <ChevronRight className="size-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10 text-left">
                            {filteredCategories.map((cat) => (
                                <div key={cat.id} className="p-4 flex flex-col gap-4 active:bg-black/5 transition-colors" onClick={() => handleOpenDrawer(cat)}>
                                    <div className="flex items-center justify-between text-left">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                                <LayersIcon className="size-5" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-[14px] font-bold">{cat.name}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground/40">ID: {cat.id}</span>
                                            </div>
                                        </div>
                                        <div className="px-2.5 py-1 rounded-full bg-black/[0.03] text-[11px] font-black tabular-nums">
                                            {cat.products_count || 0} товаров
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredCategories.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Archive className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-semibold tracking-tight mb-2">Категорий нет</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed">
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
                                <div className="flex items-center gap-3 text-left">
                                    <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                        {editingCategory ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-[15px] font-bold tracking-tight">
                                            {editingCategory ? "Редактировать" : "Новая категория"}
                                        </h2>
                                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                            {editingCategory ? `ID: #${editingCategory.id}` : "Коллекция"}
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

                            <div className="flex-1 overflow-y-auto p-6 py-5 space-y-5 scrollbar-none text-left">
                                <div className="space-y-4 text-left">
                                    <div className="space-y-1.5 text-left">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Название</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Витамины..."
                                            className="h-10 px-4 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[13px] font-bold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5 text-left">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Краткое описание</Label>
                                        <Textarea
                                            value={formData.description_short}
                                            onChange={(e) => setFormData({ ...formData, description_short: e.target.value })}
                                            placeholder="Коротко о категории..."
                                            className="min-h-[80px] p-3.5 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[13px] font-semibold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5 text-left">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Полное описание</Label>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Детальная информация..."
                                            className="min-h-[140px] p-3.5 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[13px] font-semibold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 px-6 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-xl shrink-0">
                                <div className="flex gap-2">
                                    {editingCategory && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setCatToDelete(editingCategory);
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
                                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Folder className="size-4" />}
                                        {editingCategory ? "Сохранить изменения" : "Создать категорию"}
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
                title="Удалить категорию?"
                description={`Вы собираетесь удалить "${catToDelete?.name}". Все товары в этой категории останутся без категории. Это действие необратимо.`}
            />
        </div>
    );
}
