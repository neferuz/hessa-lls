"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    ArrowLeft, 
    Save, 
    Library, 
    FileText, 
    Image as ImageIcon, 
    X, 
    Plus, 
    Upload, 
    Loader2,
    FlaskConical,
    DollarSign,
    Activity,
    Calculator,
    Sparkles,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn, getImageUrl as utilsGetImageUrl } from "@/lib/utils";

const formatNumber = (value: number | string) => {
    if (!value) return "";
    const num = String(value).replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parseNumber = (value: string) => {
    return parseInt(value.replace(/\s/g, "") || "0", 10);
};

function SachetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditing = !!editId;

    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        dosage: "",
        benefits: [] as string[],
        description_short: "",
        description_long: "",
        image_url: "",
        // Economics
        cost_price: 0,
        customs_percent: 0,
        tax_percent: 0,
        sale_price: 0,
        // Composition
        composition: {
            ingredients: [] as { 
                name: string, 
                dosage: string, 
                daily_value: string,
                photo_url?: string,
                cert_url?: string
            }[]
        },
        is_active: true
    });

    const [uploadingTarget, setUploadingTarget] = useState<{ idx: number, field: 'photo_url' | 'cert_url' } | null>(null);
    const ingredientFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editId) {
            const fetchSachet = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`http://127.0.0.1:8000/api/sachets/${editId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (typeof data.benefits === 'string') {
                            data.benefits = data.benefits.split(',').map((s: string) => s.trim());
                        }

                        // Robust composition normalization
                        let normalizedComposition = { ingredients: [] };
                        if (data.composition) {
                            if (Array.isArray(data.composition)) {
                                normalizedComposition = { ingredients: data.composition };
                            } else if (data.composition.ingredients && Array.isArray(data.composition.ingredients)) {
                                normalizedComposition = { ingredients: data.composition.ingredients };
                            } else if (data.composition.items && Array.isArray(data.composition.items)) {
                                // Fallback for legacy 'items' format
                                normalizedComposition = { 
                                    ingredients: data.composition.items.map((it: any) => ({
                                        name: it.name || "",
                                        dosage: it.dosage || "",
                                        daily_value: it.daily_value || ""
                                    })) 
                                };
                            }
                        }
                        
                        data.composition = normalizedComposition;
                        setFormData(prev => ({ ...prev, ...data }));
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("Ошибка загрузки данных");
                } finally {
                    setLoading(false);
                }
            };
            fetchSachet();
        }
    }, [editId]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePriceChange = (field: string, rawValue: string) => {
        const numValue = parseNumber(rawValue);
        setFormData(prev => ({ ...prev, [field]: numValue }));
    };

    const handleAddIngredient = () => {
        setFormData(prev => ({
            ...prev,
            composition: {
                ...prev.composition,
                ingredients: [
                    ...prev.composition.ingredients,
                    { name: "", dosage: "", daily_value: "", photo_url: "", cert_url: "" }
                ]
            }
        }));
    };

    const handleUpdateIngredient = (idx: number, field: string, value: string) => {
        setFormData(prev => {
            const newIngs = [...prev.composition.ingredients];
            newIngs[idx] = { ...newIngs[idx], [field]: value };
            return {
                ...prev,
                composition: {
                    ...prev.composition,
                    ingredients: newIngs
                }
            };
        });
    };

    const handleRemoveIngredient = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            composition: {
                ...prev.composition,
                ingredients: prev.composition.ingredients.filter((_, i) => i !== idx)
            }
        }));
    };

    const handleIngredientFileClick = (idx: number, field: 'photo_url' | 'cert_url') => {
        setUploadingTarget({ idx, field });
        ingredientFileInputRef.current?.click();
    };

    const handleIngredientFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingTarget) return;

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/upload", {
                method: "POST",
                body: uploadFormData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            
            handleUpdateIngredient(uploadingTarget.idx, uploadingTarget.field, data.url);
            toast.success("Файл загружен");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setIsUploading(false);
            setUploadingTarget(null);
            if (e.target) e.target.value = "";
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/upload", {
                method: "POST",
                body: uploadFormData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setFormData(prev => ({ ...prev, image_url: data.url }));
            toast.success("Изображение загружено");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error("Название обязательно");
            return;
        }

        setLoading(true);
        try {
            const url = isEditing 
                ? `http://127.0.0.1:8000/api/sachets/${editId}` 
                : 'http://127.0.0.1:8000/api/sachets';
            const method = isEditing ? 'PATCH' : 'POST';

            // Slug generation if empty
            if (!formData.slug && !isEditing) {
                formData.slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(isEditing ? "Обновлено" : "Создано");
                router.push('/sachets');
            } else {
                const errData = await res.json();
                toast.error(`Ошибка: ${errData.detail || "неизвестно"}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сети");
        } finally {
            setLoading(false);
        }
    };

    // Calculated Economics
    const customsFee = (formData.cost_price * formData.customs_percent) / 100;
    const taxFee = (formData.cost_price * formData.tax_percent) / 100;
    const totalCost = formData.cost_price + customsFee + taxFee;
    const profit = formData.sale_price - totalCost;
    const margin = formData.sale_price > 0 ? (profit / formData.sale_price) * 100 : 0;

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col bg-container h-full w-full bg-background">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" onClick={() => router.back()} className="size-8 rounded-full">
                                    <ArrowLeft className="size-4" />
                                </Button>
                                <div className="h-4 w-px bg-border mx-1" />
                                <h1 className="text-base font-medium">
                                    {isEditing ? "Редактирование компонента" : "Новый компонент"}
                                </h1>
                            </div>
                        }
                        actions={
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => router.back()}>Отмена</Button>
                                <Button size="sm" onClick={handleSubmit} disabled={loading} className="gap-2 bg-primary">
                                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                    Сохранить
                                </Button>
                            </div>
                        }
                    />

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-elegant">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* LEFT COLUMN */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* 1. Basic Info */}
                                <Card className="rounded-xl border-border/60 shadow-none">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                                            <Library className="size-4" /> Основная информация
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Название набора (Саше) *</Label>
                                                <Input 
                                                    value={formData.name || ""} 
                                                    onChange={e => handleChange('name', e.target.value)}
                                                    placeholder="Например: Магний Биглицинат"
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Slug (URL)</Label>
                                                <Input 
                                                    value={formData.slug || ""} 
                                                    onChange={e => handleChange('slug', e.target.value)}
                                                    placeholder="magnesium-biglycinate"
                                                    className="h-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Дозировка</Label>
                                                <Input 
                                                    value={formData.dosage || ""} 
                                                    onChange={e => handleChange('dosage', e.target.value)}
                                                    placeholder="400 мг"
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="space-y-2 flex flex-col justify-end">
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
                                                    <input 
                                                        type="checkbox" 
                                                        id="is_active" 
                                                        checked={formData.is_active}
                                                        onChange={e => handleChange('is_active', e.target.checked)}
                                                        className="size-4 rounded border-border text-primary focus:ring-primary"
                                                    />
                                                    <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">Активен для конструктора</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 2. Composition (Ingredients) */}
                                <Card className="rounded-xl border-border/60 shadow-none">
                                    <CardHeader className="pb-4 flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                                            <FlaskConical className="size-4" /> Состав / Компоненты набора
                                        </CardTitle>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={handleAddIngredient}
                                            className="h-8 gap-1 text-[10px] font-bold uppercase"
                                        >
                                            <Plus className="size-3" /> Добавить компонент
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {(formData.composition?.ingredients?.length ?? 0) > 0 ? (
                                            <div className="space-y-4">
                                                {formData.composition.ingredients.map((ing, idx) => (
                                                    <div key={idx} className="p-4 rounded-xl bg-muted/20 border border-border/40 group space-y-4">
                                                        <div className="grid grid-cols-12 gap-3">
                                                            <div className="col-span-4 space-y-1">
                                                                <Label className="text-[9px] font-bold uppercase text-muted-foreground/60">Вещество</Label>
                                                                <Input 
                                                                    value={ing.name}
                                                                    onChange={e => handleUpdateIngredient(idx, 'name', e.target.value)}
                                                                    placeholder="Название"
                                                                    className="h-9 text-xs"
                                                                />
                                                            </div>
                                                            <div className="col-span-3 space-y-1">
                                                                <Label className="text-[9px] font-bold uppercase text-muted-foreground/60">Дозировка</Label>
                                                                <Input 
                                                                    value={ing.dosage}
                                                                    onChange={e => handleUpdateIngredient(idx, 'dosage', e.target.value)}
                                                                    placeholder="мг/мкг"
                                                                    className="h-9 text-xs"
                                                                />
                                                            </div>
                                                            <div className="col-span-3 space-y-1">
                                                                <Label className="text-[9px] font-bold uppercase text-muted-foreground/60">% От нормы</Label>
                                                                <Input 
                                                                    value={ing.daily_value}
                                                                    onChange={e => handleUpdateIngredient(idx, 'daily_value', e.target.value)}
                                                                    placeholder="100%"
                                                                    className="h-9 text-xs"
                                                                />
                                                            </div>
                                                            <div className="col-span-2 flex items-end justify-end gap-2">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    onClick={() => handleRemoveIngredient(idx)}
                                                                    className="size-9 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                                                >
                                                                    <X className="size-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/20">
                                                            {/* Photo Upload */}
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[8px] font-bold uppercase text-muted-foreground/50">Фото капсулы</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm" 
                                                                        onClick={() => handleIngredientFileClick(idx, 'photo_url')}
                                                                        className={cn(
                                                                            "h-8 text-[10px] gap-2 grow justify-start font-medium",
                                                                            ing.photo_url ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600" : ""
                                                                        )}
                                                                    >
                                                                        {ing.photo_url ? <Check className="size-3" /> : <Upload className="size-3" />}
                                                                        {ing.photo_url ? "Фото загружено" : "Загрузить фото"}
                                                                    </Button>
                                                                    {ing.photo_url && (
                                                                        <div className="size-8 rounded border border-border/40 overflow-hidden shrink-0">
                                                                            <img src={utilsGetImageUrl(ing.photo_url)} className="size-full object-cover" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Certificate Upload */}
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[8px] font-bold uppercase text-muted-foreground/50">Сертификат (DOC/PDF)</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm" 
                                                                        onClick={() => handleIngredientFileClick(idx, 'cert_url')}
                                                                        className={cn(
                                                                            "h-8 text-[10px] gap-2 grow justify-start font-medium",
                                                                            ing.cert_url ? "border-blue-500/30 bg-blue-500/5 text-blue-600" : ""
                                                                        )}
                                                                    >
                                                                        {ing.cert_url ? <Check className="size-3" /> : <Plus className="size-3" />}
                                                                        {ing.cert_url ? "Документ добавлен" : "Добавить документ"}
                                                                    </Button>
                                                                    {ing.cert_url && (
                                                                        <a href={utilsGetImageUrl(ing.cert_url)} target="_blank" className="size-8 rounded bg-blue-100 flex items-center justify-center shrink-0">
                                                                            <FileText className="size-4 text-blue-600" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <input 
                                                    type="file" 
                                                    ref={ingredientFileInputRef} 
                                                    className="hidden" 
                                                    onChange={handleIngredientFileUpload}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                                                <p className="text-xs text-muted-foreground">Состав не указан. Нажмите «Добавить компонент», чтобы детализировать формулу.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* 3. Descriptions */}
                                <Card className="rounded-xl border-border/60 shadow-none">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                                            <FileText className="size-4" /> Описание и свойства
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Преимущества (через запятую)</Label>
                                            <Input 
                                                value={Array.isArray(formData.benefits) ? formData.benefits.join(', ') : ""} 
                                                onChange={e => handleChange('benefits', e.target.value.split(',').map(s => s.trim()))}
                                                placeholder="Энергия, Сон, Иммунитет"
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Короткое описание (AI контекст)</Label>
                                                <Textarea 
                                                    value={formData.description_short || ""} 
                                                    onChange={e => handleChange('description_short', e.target.value)}
                                                    rows={4}
                                                    placeholder="Для AI-ассистента..."
                                                    className="resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Полное описание (для пользователя)</Label>
                                                <Textarea 
                                                    value={formData.description_long || ""} 
                                                    onChange={e => handleChange('description_long', e.target.value)}
                                                    rows={4}
                                                    placeholder="Подробности о компоненте..."
                                                    className="resize-none"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6">
                                
                                {/* 4. Media */}
                                <Card className="rounded-xl border-border/60 shadow-none overflow-hidden">
                                    <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                                            <ImageIcon className="size-4" /> Фото бокса
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="aspect-square rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center overflow-hidden bg-muted/20 relative group transition-colors hover:border-primary/30">
                                            {formData.image_url ? (
                                                <img 
                                                    src={utilsGetImageUrl(formData.image_url)} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center text-muted-foreground/40 p-6 text-center">
                                                    <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
                                                        <Plus className="size-8 opacity-20" />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Кликните для загрузки</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="rounded-full shadow-none"
                                                >
                                                    {isUploading ? <Loader2 className="animate-spin size-4" /> : "Сменить фото"}
                                                </Button>
                                            </div>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                className="hidden" 
                                                onChange={handleFileUpload} 
                                                accept="image/*"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] font-bold uppercase text-muted-foreground/60 ml-1">URL изображения</Label>
                                            <Input 
                                                placeholder="https://..."
                                                value={formData.image_url || ""}
                                                onChange={e => handleChange('image_url', e.target.value)}
                                                className="h-8 text-[11px]"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 5. Economics / Pricing */}
                                <Card className="rounded-xl border-border/60 shadow-none overflow-hidden border-teal-500/20">
                                    <CardHeader className="pb-4 bg-teal-500/5 border-b border-border/50">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-teal-600">
                                            <Calculator className="size-4" /> Ценообразование
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4 bg-teal-500/[0.02]">
                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Себестоимость</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <Input 
                                                        type="text"
                                                        className="pl-9 h-10 font-medium"
                                                        value={formatNumber(formData.cost_price)} 
                                                        onChange={e => handlePriceChange('cost_price', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Таможня %</Label>
                                                    <Input 
                                                        type="number"
                                                        value={formData.customs_percent}
                                                        onChange={e => handleChange('customs_percent', parseFloat(e.target.value) || 0)}
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Налог %</Label>
                                                    <Input 
                                                        type="number"
                                                        value={formData.tax_percent}
                                                        onChange={e => handleChange('tax_percent', parseFloat(e.target.value) || 0)}
                                                        className="h-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Итого Cost:</span>
                                                <span className="font-bold">{formatNumber(totalCost)} UZS</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Маржа:</span>
                                                <span className={cn("font-bold px-1.5 py-0.5 rounded", margin > 50 ? "bg-emerald-500/10 text-emerald-600" : "bg-orange-500/10 text-orange-600")}>
                                                    {margin.toFixed(0)}% ({formatNumber(profit)} UZS)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Цена продажи</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                                                <Input 
                                                    type="text"
                                                    className="pl-9 h-12 text-lg font-bold border-primary/30 focus-visible:ring-primary shadow-none"
                                                    value={formatNumber(formData.sale_price)} 
                                                    onChange={e => handlePriceChange('sale_price', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default function NewSachetPage() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <SachetForm />
        </Suspense>
    );
}
