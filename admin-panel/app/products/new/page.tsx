"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { 
    ArrowLeft, Save, Calculator, DollarSign, Package, FileText, 
    Image as ImageIcon, X, Plus, Sparkles, Upload, Loader2,
    ChevronRight, Tag, Box, Activity, ShieldCheck, ShoppingCart,
    CreditCard, Layout, Layers, Info, Trash2, Edit2, CheckCircle2,
    Zap, Target, Heart, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn, getImageUrl as utilsGetImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/config";

const formatNumber = (value: number | string) => {
    if (!value) return "";
    const num = String(value).replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parseNumber = (value: string) => {
    return parseInt(value.replace(/\s/g, "") || "0", 10);
};

function NewProductForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const cloneId = searchParams.get('clone');
    const isEditing = !!editId;

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">
                    {isEditing ? "Редактировать товар" : "Создать товар"}
                </h1>
            </div>
        ),
        description: "Управление параметрами и характеристиками продукта"
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [newImage, setNewImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getImageUrl = (url: string) => {
        return utilsGetImageUrl(url);
    };

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category_id: "",
        stock: 0,
        description_short: "",
        description_full: "",
        size_volume: "",
        details: "",
        usage: "",
        delivery_info: "",
        cost_price: 0,
        customs_percent: 0,
        tax_percent: 0,
        sale_price: 0,
        images: [] as string[],
        plans: [] as any[],
        composition: {} as Record<string, { image: string, ingredients: any[] }>,
        is_active: true
    });

    const handlePriceChange = (field: string, value: string) => {
        if (field === 'sale_price') {
            const num = parseNumber(value);
            setFormData(prev => ({ ...prev, [field]: num }));
        } else {
            setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
        }
    };

    const EXCHANGE_RATE = 12800;

    // Calculated Economics
    const totalCostUZS = formData.cost_price * EXCHANGE_RATE;
    const profit = formData.sale_price - totalCostUZS;
    const margin = formData.sale_price > 0 ? (profit / formData.sale_price) * 100 : 0;

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {}
        };
        fetchCats();
    }, []);

    useEffect(() => {
        const id = editId || cloneId;
        if (id) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        const formattedData = { ...data };
                        if (formattedData.category_id) formattedData.category_id = String(formattedData.category_id);
                        if (!formattedData.plans) formattedData.plans = [];
                        
                        // Composition normalization logic (simplified for rewrite)
                        if (!formattedData.composition) formattedData.composition = {};
                        else if (Array.isArray(formattedData.composition)) {
                            const asDict: any = {};
                            formattedData.composition.forEach((item: any, idx: number) => {
                                asDict[item.name || `Comp ${idx}`] = { image: item.image || "", ingredients: item.ingredients || [] };
                            });
                            formattedData.composition = asDict;
                        }

                        if (cloneId) {
                            formattedData.name = `${formattedData.name} (копия)`;
                            formattedData.sku = `${formattedData.sku}-COPY`;
                            delete formattedData.id;
                        }
                        setFormData(prev => ({ ...prev, ...formattedData }));
                    }
                } catch (err) {} finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [editId, cloneId]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddImage = () => {
        if (newImage.trim()) {
            setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }));
            setNewImage("");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: "POST", body: uploadFormData });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
                toast.success("Фото загружено");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category_id) {
            toast.error("Заполните название и категорию");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...formData,
                category_id: parseInt(formData.category_id),
                stock: parseInt(formData.stock as any) || 0,
                cost_price: parseFloat(formData.cost_price as any) || 0,
                sale_price: parseFloat(formData.sale_price as any) || 0,
            };
            const url = isEditing ? `${API_BASE_URL}/api/products/${editId}` : `${API_BASE_URL}/api/products`;
            const method = isEditing ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                toast.success("Сохранено!");
                router.push('/products');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-none bg-[#f2f2f7] dark:bg-[#000000] font-sans">
            <div className="flex flex-col h-full w-full bg-[#f2f2f7] dark:bg-[#000000] relative text-left">
                {/* Adaptive Toolbar */}
                <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="size-9 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold tracking-tight uppercase font-[family-name:var(--font-unbounded)]">
                                {isEditing ? "Редактировать товар" : "Создать товар"}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                <Package className="size-3" /> 
                                {formData.sku || "Без SKU"} 
                                <ChevronRight className="size-2.5" />
                                Hessa Supplements
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                            variant="ghost" 
                            onClick={() => router.back()}
                            className="flex-1 sm:flex-none h-9 px-4 rounded-xl text-[12px] font-bold hover:bg-black/5 dark:hover:bg-white/5 shadow-none uppercase"
                        >
                            Отмена
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 sm:flex-none h-9 px-6 rounded-full text-[12px] font-black bg-black dark:bg-white text-white dark:text-black shadow-none active:scale-95 transition-all uppercase"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                            Сохранить
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-4 pb-32 bg-[#f2f2f7] dark:bg-[#000000]">
                    <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                        
                        {/* Left Side: Main Data */}
                        <div className="lg:col-span-8 space-y-3.5">
                            
                            {/* 1. Base Information */}
                            <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[2rem] border border-black/5 dark:border-white/10 shadow-none space-y-4 text-left">
                                <div className="flex items-center gap-2 mb-0.5 border-b border-black/5 pb-1.5">
                                    <h3 className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">Базовые данные</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Название продукта</Label>
                                        <Input
                                            placeholder="Введите название..."
                                            value={formData.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                            className="h-9 text-[13px] font-semibold bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-black/5 shadow-none uppercase"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Артикул (SKU)</Label>
                                            <Input
                                                placeholder="HSA-001"
                                                value={formData.sku}
                                                onChange={e => handleChange('sku', e.target.value)}
                                                className="h-9 text-[12px] font-semibold bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg shadow-none uppercase"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Категория</Label>
                                            <Select value={formData.category_id} onValueChange={(val) => handleChange('category_id', val)}>
                                                <SelectTrigger className="h-9 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg text-[12px] font-semibold shadow-none uppercase">
                                                    <SelectValue placeholder="Выберите категорию" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-lg border-black/5 shadow-none">
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id} value={String(cat.id)} className="rounded-md text-[12px] font-semibold uppercase">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Остаток на складе</Label>
                                            <Input
                                                type="number"
                                                value={formData.stock}
                                                onChange={e => handleChange('stock', e.target.value)}
                                                className="h-9 text-[12px] font-semibold bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg shadow-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Объем / Фасовка</Label>
                                            <Input
                                                placeholder="60 капсул"
                                                value={formData.size_volume}
                                                onChange={e => handleChange('size_volume', e.target.value)}
                                                className="h-9 text-[12px] font-semibold bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg shadow-none uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Description Glass Card */}
                            <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[2rem] border border-black/5 dark:border-white/10 shadow-none space-y-4 text-left">
                                <div className="flex items-center gap-2 mb-0.5 border-b border-black/5 pb-1.5">
                                    <h3 className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">Текстовый контент</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Краткое описание</Label>
                                        <Textarea
                                            placeholder="Введите краткое описание..."
                                            value={formData.description_short}
                                            onChange={e => handleChange('description_short', e.target.value)}
                                            className="min-h-[60px] text-[12px] font-medium bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg focus-visible:ring-1 resize-none shadow-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Полное описание продукта</Label>
                                        <Textarea
                                            placeholder="Введите подробное описание..."
                                            value={formData.description_full}
                                            onChange={e => handleChange('description_full', e.target.value)}
                                            className="min-h-[120px] text-[12px] font-medium bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg focus-visible:ring-1 resize-none leading-relaxed shadow-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Multimedia Grid */}
                            <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[2rem] border border-black/5 dark:border-white/10 shadow-none space-y-4 text-left">
                                <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
                                    <h3 className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">Медиафайлы</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-6 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-black/[0.03] dark:bg-white/[0.03] shadow-none"
                                    >
                                        <Upload className="size-3 mr-1.5" /> Загрузить
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    <AnimatePresence>
                                        {formData.images.map((img, idx) => (
                                            <motion.div
                                                key={img}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="relative aspect-square group rounded-[1.25rem] overflow-hidden border border-black/5 bg-black/5"
                                            >
                                                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="size-8 rounded-full bg-white text-red-500 hover:bg-white/90"
                                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-[1.25rem] border-2 border-dashed border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-muted-foreground/30 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary transition-all"
                                    >
                                        <Plus className="size-6 mb-1" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Добавить</span>
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </div>
                        </div>

                        {/* Right Side: Economics & Visibility */}
                        <div className="lg:col-span-4 space-y-3.5">
                            
                            {/* Status Card */}
                            <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[2rem] border border-black/5 dark:border-white/10 shadow-none text-left">
                                <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-1.5">
                                    <h3 className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">Статус</h3>
                                    <Badge variant="outline" className={cn(
                                        "h-5 px-2 text-[9px] font-bold uppercase border-0 rounded-md shadow-none",
                                        formData.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                                    )}>
                                        {formData.is_active ? "Активен" : "Черновик"}
                                    </Badge>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => handleChange('is_active', !formData.is_active)}
                                    className={cn(
                                        "w-full h-9 rounded-lg border-0 text-[10px] font-bold uppercase tracking-widest transition-all shadow-none",
                                        formData.is_active ? "bg-black/[0.03] text-black dark:text-white dark:bg-white/[0.03]" : "bg-green-500/5 text-green-500 hover:bg-green-500/10"
                                    )}
                                >
                                    {formData.is_active ? <EyeOff className="size-3.5 mr-2" /> : <Eye className="size-3.5 mr-2" />}
                                    {formData.is_active ? "В черновик" : "Опубликовать"}
                                </Button>
                            </div>

                            {/* Economics Widget */}
                            <div className="p-5 bg-white dark:bg-[#1c1c1e] rounded-[2rem] border border-black/5 dark:border-white/10 shadow-none space-y-4 text-left">
                                <div className="flex items-center gap-2 mb-0.5 border-b border-black/5 pb-1.5">
                                    <h3 className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">Экономика</h3>
                                </div>

                                <div className="space-y-3.5">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Себестоимость ($)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-black/20" />
                                            <Input
                                                type="number"
                                                value={formData.cost_price}
                                                onChange={e => handlePriceChange('cost_price', e.target.value)}
                                                className="h-9 pl-7 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg text-[13px] font-semibold focus-visible:ring-1 focus-visible:ring-black/5 shadow-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest ml-0.5">Цена (UZS)</Label>
                                        <Input
                                            value={formatNumber(formData.sale_price)}
                                            onChange={e => handlePriceChange('sale_price', e.target.value)}
                                            className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg text-[16px] font-bold focus-visible:ring-1 focus-visible:ring-black/5 shadow-none"
                                        />
                                    </div>

                                    <div className="pt-3 border-t border-black/5 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-black/20 dark:text-white/20 uppercase tracking-tight">Прибыль</span>
                                            <span className="text-[13px] font-bold tabular-nums text-green-600 dark:text-green-400">
                                                {formatNumber(profit.toFixed(0))} <span className="text-[9px] font-medium opacity-40 italic">UZS</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-black/20 dark:text-white/20 uppercase tracking-tight">Маржа</span>
                                            <Badge variant="outline" className={cn(
                                                "h-5 px-2 text-[9px] font-bold border-0 rounded-md shadow-none",
                                                margin > 30 ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                                            )}>
                                                {margin.toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Loyalty & Quick Info */}
                            <div className="p-5 bg-white dark:bg-[#1c1c1e] rounded-[1.75rem] border border-black/5 dark:border-white/10 shadow-none space-y-4 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <ShieldCheck className="size-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Проверка данных</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl">
                                    <Zap className="size-3.5 text-amber-500" />
                                    <span className="text-[10px] font-bold text-muted-foreground/60 leading-tight">
                                        SKU должен быть уникальным для синхронизации склада.
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewProductWrapper() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#f2f2f7]"><Loader2 className="animate-spin text-primary" /></div>}>
            <NewProductForm />
        </Suspense>
    );
}
