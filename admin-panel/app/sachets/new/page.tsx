"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    ArrowLeft, 
    Save, 
    Image as ImageIcon, 
    X, 
    Plus, 
    Upload, 
    Loader2,
    FlaskConical,
    DollarSign,
    Check,
    ChevronRight,
    Eye,
    EyeOff,
    ShieldCheck,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn, getImageUrl as utilsGetImageUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

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

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <FlaskConical className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight uppercase">
                    {isEditing ? "Редактировать Саше" : "Создать Саше"}
                </h1>
            </div>
        ),
        description: "Управление параметрами и составом биологически активной добавки"
    });

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
        cost_price: 0,
        sale_price: 0,
        image_url: "",
        is_active: true,
        composition: {
            capsules: [] as { 
                name: string, 
                ingredients: {
                    name: string,
                    dosage: string,
                    daily_value: string
                }[]
            }[]
        }
    });

    const [uploadingTarget, setUploadingTarget] = useState<{ capIdx: number, ingIdx: number, field: 'photo_url' | 'cert_url' } | null>(null);
    const ingredientFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editId) {
            const fetchSachet = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${API_BASE_URL}/api/sachets/${editId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (typeof data.benefits === 'string') {
                            data.benefits = data.benefits.split(',').map((s: string) => s.trim());
                        }

                        let normalizedComposition = { capsules: [] };
                        if (data.composition) {
                            if (data.composition.capsules) {
                                normalizedComposition = data.composition;
                            } else if (data.composition.ingredients) {
                                // Migrate old flat structure to nested
                                normalizedComposition = {
                                    capsules: [{
                                        name: "Основная капсула",
                                        ingredients: data.composition.ingredients
                                    }]
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

    const handlePriceChange = (field: string, value: string) => {
        if (field === 'sale_price') {
            const num = parseNumber(value);
            setFormData(prev => ({ ...prev, [field]: num }));
        } else {
            setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
        }
    };

    const EXCHANGE_RATE = 12800;
    const totalCostUZS = formData.cost_price * EXCHANGE_RATE;
    const profit = formData.sale_price - totalCostUZS;
    const margin = formData.sale_price > 0 ? (profit / formData.sale_price) * 100 : 0;

    const handleAddCapsule = () => {
        setFormData(prev => ({
            ...prev,
            composition: {
                ...prev.composition,
                capsules: [
                    ...prev.composition.capsules,
                    { name: "", ingredients: [] }
                ]
            }
        }));
    };

    const handleUpdateCapsule = (capIdx: number, name: string) => {
        setFormData(prev => {
            const newCaps = [...prev.composition.capsules];
            newCaps[capIdx] = { ...newCaps[capIdx], name };
            return { ...prev, composition: { ...prev.composition, capsules: newCaps } };
        });
    };

    const handleRemoveCapsule = (capIdx: number) => {
        setFormData(prev => ({
            ...prev,
            composition: {
                ...prev.composition,
                capsules: prev.composition.capsules.filter((_, i) => i !== capIdx)
            }
        }));
    };

    const handleAddIngredient = (capIdx: number) => {
        setFormData(prev => {
            const newCaps = [...prev.composition.capsules];
            newCaps[capIdx] = {
                ...newCaps[capIdx],
                ingredients: [
                    ...newCaps[capIdx].ingredients,
                    { name: "", dosage: "", daily_value: "", photo_url: "", cert_url: "" }
                ]
            };
            return { ...prev, composition: { ...prev.composition, capsules: newCaps } };
        });
    };

    const handleUpdateIngredient = (capIdx: number, ingIdx: number, field: string, value: string) => {
        setFormData(prev => {
            const newCaps = [...prev.composition.capsules];
            const newIngs = [...newCaps[capIdx].ingredients];
            newIngs[ingIdx] = { ...newIngs[ingIdx], [field]: value };
            newCaps[capIdx] = { ...newCaps[capIdx], ingredients: newIngs };
            return {
                ...prev,
                composition: {
                    ...prev.composition,
                    capsules: newCaps
                }
            };
        });
    };

    const handleRemoveIngredient = (capIdx: number, ingIdx: number) => {
        setFormData(prev => {
            const newCaps = [...prev.composition.capsules];
            newCaps[capIdx] = {
                ...newCaps[capIdx],
                ingredients: newCaps[capIdx].ingredients.filter((_, i) => i !== ingIdx)
            };
            return { ...prev, composition: { ...prev.composition, capsules: newCaps } };
        });
    };

    const handleIngredientFileClick = (capIdx: number, ingIdx: number, field: 'photo_url' | 'cert_url') => {
        setUploadingTarget({ capIdx, ingIdx, field });
        ingredientFileInputRef.current?.click();
    };

    const handleIngredientFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingTarget) return;

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: "POST",
                body: uploadFormData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            
            handleUpdateIngredient(uploadingTarget.capIdx, uploadingTarget.ingIdx, uploadingTarget.field, data.url);
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
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
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
                ? `${API_BASE_URL}/api/sachets/${editId}` 
                : `${API_BASE_URL}/api/sachets`;
            const method = isEditing ? 'PATCH' : 'POST';

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

    return (
        <>

            {/* Adaptive Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-12 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-transparent z-20 sticky top-0 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="size-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors"
                    >
                        <ArrowLeft className="size-3.5" />
                    </Button>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-medium tracking-tight text-black dark:text-white">
                            {isEditing ? "Редактирование данных" : "Новый прототип"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] font-medium text-black/30 dark:text-white/30">
                            <FlaskConical className="size-3" /> 
                            {formData.dosage || "Без дозировки"} 
                            <ChevronRight className="size-2.5" />
                            Панель управления
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.back()}
                        className="flex-1 sm:flex-none h-8 px-4 rounded-xl text-[11px] font-medium hover:bg-black/5 dark:hover:bg-white/5 shadow-none"
                    >
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 sm:flex-none h-8 px-5 rounded-full text-[11px] font-medium bg-black dark:bg-white text-white dark:text-black shadow-none active:scale-95 transition-all"
                    >
                        {loading ? <Loader2 className="size-3.5 animate-spin mr-2" /> : <Save className="size-3.5 mr-2" />}
                        Сохранить саше
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-4 pb-32 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                    
                    {/* Left Side: Main Data */}
                    <div className="lg:col-span-8 space-y-3">
                        
                        {/* 1. Base Information */}
                        <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-none space-y-3.5 text-left">
                            <div className="flex items-center gap-2 mb-0.5 border-b border-black/5 pb-2">
                                <h3 className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Основные параметры</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Наименование прототипа</Label>
                                    <Input
                                        placeholder="Напр: FEMALE COMPLEX"
                                        value={formData.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        className="h-8 text-[12px] font-medium bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg shadow-none text-black dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Идентификатор (Slug)</Label>
                                    <Input
                                        placeholder="female-complex-set"
                                        value={formData.slug}
                                        onChange={e => handleChange('slug', e.target.value)}
                                        className="h-8 text-[11px] font-medium bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg shadow-none text-black dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Форм-фактор / Доза</Label>
                                    <Input
                                        placeholder="5 капсул в саше"
                                        value={formData.dosage}
                                        onChange={e => handleChange('dosage', e.target.value)}
                                        className="h-8 text-[11px] font-medium bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg shadow-none text-black dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Метки (Benefits)</Label>
                                    <Input
                                        placeholder="Beauty, Skin, Energy"
                                        value={formData.benefits.join(', ')}
                                        onChange={e => handleChange('benefits', e.target.value.split(',').map(s => s.trim()))}
                                        className="h-8 text-[11px] font-medium bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg shadow-none text-black dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Composition (Box inside Box) */}
                        <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-none space-y-3.5 text-left">
                            <div className="flex items-center justify-between border-b border-black/5 pb-2">
                                <h3 className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Архитектура состава (Вложенность)</h3>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleAddCapsule}
                                    className="h-6 px-3 rounded-lg text-[8px] font-medium uppercase tracking-widest bg-black/[0.03] dark:bg-white/[0.03] shadow-none"
                                >
                                    <Plus className="size-3 mr-1" /> Добавить блок
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.composition.capsules.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01]">
                                        <div className="size-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-2">
                                            <Plus className="size-4 text-black/40 dark:text-white/40" />
                                        </div>
                                        <p className="text-[10px] font-medium text-black/60 dark:text-white/60 uppercase tracking-widest text-center">
                                            Состав пуст. Добавьте первую капсулу.
                                        </p>
                                    </div>
                                )}
                                {formData.composition.capsules.map((capsule, capIdx) => (
                                    <div key={capIdx} className="p-3 bg-black/[0.01] dark:bg-white/[0.01] rounded-2xl border border-black/5 dark:border-white/5 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-[8px] font-medium text-black/50 dark:text-white/50 ml-1">Заголовок капсулы / объекта</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input 
                                                        value={capsule.name}
                                                        placeholder="Напр: Витамин D3 + K2"
                                                        onChange={e => handleUpdateCapsule(capIdx, e.target.value)}
                                                        className="h-7 text-[11px] font-medium bg-white dark:bg-black/20 border-0 shadow-none text-black dark:text-white"
                                                    />
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCapsule(capIdx)} className="size-7 rounded-lg hover:bg-red-500/5 text-black/10 hover:text-red-500 transition-colors">
                                                        <X className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-3 border-l-[1px] border-black/5 space-y-1.5">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[8px] font-medium text-black/40">Нутриенты в блоке</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => handleAddIngredient(capIdx)}
                                                    className="h-5 px-3 rounded-md text-[8px] font-medium uppercase tracking-tight bg-black/[0.03] text-black/60 hover:bg-black/[0.05]"
                                                >
                                                    + Добавить
                                                </Button>
                                            </div>

                                            {capsule.ingredients.map((ing, ingIdx) => (
                                                <div key={ingIdx} className="p-2 bg-white dark:bg-white/5 rounded-xl border border-black/[0.03] space-y-2">
                                                    <div className="grid grid-cols-12 gap-2">
                                                        <div className="col-span-5 space-y-1">
                                                            <Label className="text-[7px] font-medium text-black/60 ml-1">Вещество</Label>
                                                            <Input 
                                                                value={ing.name}
                                                                onChange={e => handleUpdateIngredient(capIdx, ingIdx, 'name', e.target.value)}
                                                                className="h-6 text-[10px] font-medium bg-black/[0.01] border-0 shadow-none text-black dark:text-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-3 space-y-1">
                                                            <Label className="text-[7px] font-medium text-black/60 ml-1">Доза</Label>
                                                            <Input 
                                                                value={ing.dosage}
                                                                onChange={e => handleUpdateIngredient(capIdx, ingIdx, 'dosage', e.target.value)}
                                                                className="h-6 text-[10px] font-medium bg-black/[0.01] border-0 shadow-none text-center text-black dark:text-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-3 space-y-1">
                                                            <Label className="text-[7px] font-medium text-black/60 ml-1">% DV</Label>
                                                            <Input 
                                                                value={ing.daily_value}
                                                                onChange={e => handleUpdateIngredient(capIdx, ingIdx, 'daily_value', e.target.value)}
                                                                className="h-6 text-[10px] font-medium bg-black/[0.01] border-0 shadow-none text-center text-black dark:text-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex items-end justify-end pb-0.5">
                                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(capIdx, ingIdx)} className="size-5 rounded-md hover:bg-red-500/5 text-black/10 hover:text-red-500">
                                                                <X className="size-2.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <input type="file" ref={ingredientFileInputRef} className="hidden" onChange={handleIngredientFileUpload} />
                            </div>
                        </div>

                        {/* 3. Text Content */}
                        <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-none space-y-3.5 text-left">
                            <div className="flex items-center gap-2 mb-0.5 border-b border-black/5 pb-2">
                                <h3 className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Описательный контент</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Краткая аннотация (Card Preview)</Label>
                                    <Textarea
                                        placeholder="Для карточки и превью..."
                                        value={formData.description_short}
                                        onChange={e => handleChange('description_short', e.target.value)}
                                        className="min-h-[60px] text-[11px] bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-xl resize-none shadow-none font-medium text-black dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Полная спецификация</Label>
                                    <Textarea
                                        placeholder="Детальное описание состава и свойств..."
                                        value={formData.description_long}
                                        onChange={e => handleChange('description_long', e.target.value)}
                                        className="min-h-[100px] text-[11px] bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-xl resize-none shadow-none font-medium text-black dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Economics & Media */}
                    <div className="lg:col-span-4 space-y-3">
                        
                        {/* Status & Visibility */}
                        <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-none space-y-3 text-left">
                            <div className="flex items-center justify-between border-b border-black/5 pb-2">
                                <span className="text-[9px] font-medium text-black/40">Статус</span>
                                <Badge className={cn("h-4 px-2 text-[8px] font-medium uppercase border-0 rounded-md shadow-none", formData.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500")}>
                                    {formData.is_active ? "Активен" : "Черновик"}
                                </Badge>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => handleChange('is_active', !formData.is_active)}
                                className={cn(
                                    "w-full h-8 rounded-lg border-0 text-[9px] font-medium uppercase tracking-widest transition-all shadow-none",
                                    formData.is_active ? "bg-black/[0.03] text-black dark:text-white dark:bg-white/[0.03]" : "bg-green-500/5 text-green-500"
                                )}
                            >
                                {formData.is_active ? <EyeOff className="size-3.5 mr-2" /> : <Eye className="size-3.5 mr-2" />}
                                {formData.is_active ? "Скрыть из системы" : "Опубликовать"}
                            </Button>
                        </div>

                        {/* Economics Widget */}
                        <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-none space-y-3 text-left">
                            <div className="flex items-center gap-2 mb-0.5 border-b border-black/5 pb-2">
                                <h3 className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Коммерческий блок</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Себестоимость ($)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-black/40" />
                                        <Input
                                            type="number"
                                            value={formData.cost_price}
                                            onChange={e => handlePriceChange('cost_price', e.target.value)}
                                            className="h-8 pl-7 bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg text-[12px] font-medium shadow-none text-black dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Розничная цена (UZS)</Label>
                                    <Input
                                        value={formatNumber(formData.sale_price)}
                                        onChange={e => handlePriceChange('sale_price', e.target.value)}
                                        className="h-9 bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg text-[15px] font-medium shadow-none text-center text-black dark:text-white"
                                    />
                                </div>

                                <div className="pt-2 border-t border-black/5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-medium text-black/40">Профит (Net)</span>
                                        <span className="text-[12px] font-medium tabular-nums text-green-600">
                                            {formatNumber(profit.toFixed(0))} <span className="text-[8px] opacity-30 italic">UZS</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-medium text-black/40">Маржа</span>
                                        <Badge variant="outline" className={cn(
                                            "h-4 px-2 text-[8px] font-medium border-0 rounded-md shadow-none",
                                            margin > 30 ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                                        )}>
                                            {margin.toFixed(1)}%
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-none space-y-3 text-left">
                            <div className="flex items-center justify-between border-b border-black/5 pb-2">
                                <h3 className="text-[9px] font-medium text-black/60 dark:text-white/60 ml-1">Медиа</h3>
                                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="h-5 px-2 rounded-md text-[8px] font-medium uppercase tracking-widest bg-black/[0.03] dark:bg-white/[0.03]">
                                    <Upload className="size-3 mr-1" /> Load
                                </Button>
                            </div>

                            <div className="aspect-[4/3] rounded-[1rem] border border-black/5 bg-black/5 dark:bg-white/5 overflow-hidden relative group">
                                {formData.image_url ? (
                                    <img src={utilsGetImageUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-black/10">
                                        <ImageIcon className="size-8 mb-1" />
                                        <span className="text-[8px] font-medium">Empty</span>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </div>
                        </div>

                        {/* Data Integrity Card */}
                        <div className="p-5 bg-white dark:bg-[#1c1c1e] rounded-[1.75rem] border border-black/5 dark:border-white/10 shadow-none space-y-4 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="size-3.5 text-primary" />
                                <span className="text-[10px] font-medium text-black/40">Верификация</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl">
                                <Zap className="size-3.5 text-amber-500" />
                                <span className="text-[10px] font-medium text-black/60 leading-tight">
                                    Убедитесь в корректности данных перед сохранением.
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default function NewSachetWrapper() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#f2f2f7]"><Loader2 className="animate-spin text-primary" /></div>}>
            <SachetForm />
        </Suspense>
    );
}
