"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn, getImageUrl } from "@/lib/utils";
import {
    Save,
    RefreshCw,
    Layout,
    List,
    Trophy,
    Target,
    Users,
    Activity,
    BarChart,
    Phone,
    Upload,
    ImageIcon,
    Loader2,
    Check,
    Layers,
    ChevronRight,
    ArrowRight,
    Image as ImageIconAlt
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import React, { memo } from "react";

type Language = "RU" | "UZ" | "EN";

interface CompaniesFormProps {
    lang: Language;
}

export function CompaniesForm({ lang }: CompaniesFormProps) {
    const [companies, setCompanies] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/content`);
            if (res.ok) {
                const data = await res.json();
                if (data.companies) setCompanies(data.companies);
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const resGet = await fetch(`${API_BASE_URL}/api/content`);
            const currentContent = await resGet.json();
            const res = await fetch(`${API_BASE_URL}/api/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...currentContent, companies }),
            });
            if (res.ok) toast.success("Данные сохранены");
            else throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    const updateField = (f: string, v: any) => setCompanies((p: any) => ({ ...p, [f]: v }));
    const getFieldForLang = (b: string, l: Language) => l === 'RU' ? b : `${b}_${l.toLowerCase()}`;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(field);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            updateField(field, data.url);
            toast.success("Готово");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setUploading(null);
        }
    };

    const renderImageInput = (field: string, label?: string) => (
        <div className="space-y-2">
            {label && <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">{label}</Label>}
            <div className="flex items-center gap-4 p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] rounded-xl">
                <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-black/[0.05] bg-background">
                    {companies?.[field] ? (
                        <img src={getImageUrl(companies[field])} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIconAlt className="size-5 text-muted-foreground/20 m-auto mt-5" />
                    )}
                    {uploading === field && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="size-4 animate-spin text-white" />
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <Input 
                        value={companies?.[field] || ""} 
                        onChange={(e) => updateField(field, e.target.value)} 
                        className="h-8 text-[10px] font-mono bg-white dark:bg-black/20 border-0 shadow-none" 
                        placeholder="Ссылка или загрузка..."
                    />
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" size="sm" className="h-7 px-3 rounded-md text-[10px] font-bold border-black/[0.1] shadow-none"
                            onClick={() => document.getElementById(`up-${field}`)?.click()}
                        >
                            <Upload className="size-3 mr-1.5" /> Выбрать файл
                        </Button>
                        <input type="file" id={`up-${field}`} className="hidden" onChange={(e) => handleFileUpload(e, field)} />
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading || !companies) return (
        <div className="w-full h-[400px] flex items-center justify-center p-20">
            <Loader2 className="size-6 animate-spin text-primary/30" />
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col bg-[#f8f8f9] dark:bg-[#000000] text-left">
            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5">
                <div className="max-w-4xl mx-auto space-y-8 pb-32">
                    
                    {/* 1. HERO */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <Layout className="size-4 text-blue-500" />
                            <span className="text-[14px] font-bold">1. Главный экран (Hero)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Бейдж ({lang})</Label><Input value={companies?.[getFieldForLang('hero_badge', lang)] || ''} onChange={(e) => updateField(getFieldForLang('hero_badge', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" /></div>
                            <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Текст кнопки ({lang})</Label><Input value={companies?.[getFieldForLang('button_text', lang)] || ''} onChange={(e) => updateField(getFieldForLang('button_text', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" /></div>
                        </div>
                        <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок ({lang})</Label><Textarea value={companies?.[getFieldForLang('hero_title', lang)] || ''} onChange={(e) => updateField(getFieldForLang('hero_title', lang), e.target.value)} className="min-h-[80px] bg-black/[0.02] border-0 rounded-xl text-[18px] font-black tracking-tight resize-none shadow-none" /></div>
                        <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Описание ({lang})</Label><Textarea value={companies?.[getFieldForLang('hero_desc', lang)] || ''} onChange={(e) => updateField(getFieldForLang('hero_desc', lang), e.target.value)} className="min-h-[80px] bg-black/[0.02] border-0 rounded-xl text-[13px] font-medium resize-none shadow-none" /></div>
                        {renderImageInput('hero_image', 'Фоновое изображение')}
                    </Card>

                    {/* 2. BENEFITS */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <List className="size-4 text-green-500" />
                            <span className="text-[14px] font-bold">2. Преимущества</span>
                        </div>
                        <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок секции ({lang})</Label><Input value={companies?.[getFieldForLang('benefits_title', lang)] || ''} onChange={(e) => updateField(getFieldForLang('benefits_title', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg font-bold shadow-none" /></div>
                        <div className="grid grid-cols-1 gap-3">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="p-4 rounded-xl bg-black/[0.01] border border-black/[0.05] grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/40 ml-1">Преимущество {num}</Label><Input value={companies?.[getFieldForLang(`benefit_${num}_title`, lang)] || ''} onChange={(e) => updateField(getFieldForLang(`benefit_${num}_title`, lang), e.target.value)} className="h-8 bg-white border-black/[0.05] rounded-lg text-[12px] font-bold shadow-none" /></div>
                                    <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/40 ml-1">Описание {num}</Label><Input value={companies?.[getFieldForLang(`benefit_${num}_text`, lang)] || ''} onChange={(e) => updateField(getFieldForLang(`benefit_${num}_text`, lang), e.target.value)} className="h-8 bg-white border-black/[0.05] rounded-lg text-[11px] font-medium shadow-none" /></div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* 3. CASE */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <Trophy className="size-4 text-purple-500" />
                            <span className="text-[14px] font-bold">3. Кейс (История успеха)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Бейдж ({lang})</Label><Input value={companies?.[getFieldForLang('case_badge', lang)] || ''} onChange={(e) => updateField(getFieldForLang('case_badge', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg shadow-none" /></div>
                            <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок ({lang})</Label><Input value={companies?.[getFieldForLang('case_title', lang)] || ''} onChange={(e) => updateField(getFieldForLang('case_title', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg font-bold shadow-none" /></div>
                        </div>
                        {renderImageInput('case_image', 'Обложка кейса')}
                    </Card>

                    {/* 4. PRODUCTS */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <Target className="size-4 text-orange-500" />
                            <span className="text-[14px] font-bold">4. Продукты</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <div key={num} className="p-4 rounded-xl bg-black/[0.01] border border-black/[0.05] space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-bold text-orange-500/40">Продукт #{num}</Label>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-[9px] font-semibold text-muted-foreground/40 ml-1">Название ({lang})</Label>
                                            <Input value={companies?.[getFieldForLang(`product_${num}_name`, lang)] || ''} onChange={(e) => updateField(getFieldForLang(`product_${num}_name`, lang), e.target.value)} className="h-8 bg-white text-[12px] font-bold border-black/[0.05] shadow-none" placeholder="Напр: Антистресс-набор" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] font-semibold text-muted-foreground/40 ml-1">Цель ({lang})</Label>
                                            <Input value={companies?.[getFieldForLang(`product_${num}_goal`, lang)] || ''} onChange={(e) => updateField(getFieldForLang(`product_${num}_goal`, lang), e.target.value)} className="h-8 bg-white text-[11px] font-medium border-black/[0.05] shadow-none" placeholder="Напр: Снятие напряжения" />
                                        </div>
                                    </div>
                                    {renderImageInput(`product_${num}_image`, "Изображение продукта")}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* 7. STATS */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <BarChart className="size-4 text-pink-500" />
                            <span className="text-[14px] font-bold">5. Статистика</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((num) => (
                                <div key={num} className="p-4 rounded-xl bg-black/[0.01] border border-black/[0.05] text-center space-y-2">
                                    <Input value={companies?.[`stat_${num}_val`] || ''} onChange={(e) => updateField(`stat_${num}_val`, e.target.value)} className="h-8 bg-transparent text-center text-[18px] font-black border-0 shadow-none px-0" placeholder="0" />
                                    <Input value={companies?.[getFieldForLang(`stat_${num}_label`, lang)] || ''} onChange={(e) => updateField(getFieldForLang(`stat_${num}_label`, lang), e.target.value)} className="h-7 bg-transparent text-center text-[10px] font-bold text-muted-foreground/60 border-0 shadow-none px-0" placeholder="Подпись" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* 8. CONTACTS */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <Phone className="size-4 text-indigo-500" />
                            <span className="text-[14px] font-bold">6. Контакты</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок ({lang})</Label><Input value={companies?.[getFieldForLang('contact_title', lang)] || ''} onChange={(e) => updateField(getFieldForLang('contact_title', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg font-bold shadow-none" /></div>
                            <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Описание ({lang})</Label><Input value={companies?.[getFieldForLang('contact_desc', lang)] || ''} onChange={(e) => updateField(getFieldForLang('contact_desc', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[12px] font-medium shadow-none" /></div>
                        </div>
                    </Card>

                </div>
            </div>

            {/* Flat Action Bar - Compact & Shadow-free */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[280px]">
                <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.1] rounded-full p-1.5 flex items-center gap-1 shadow-none">
                    <div className="flex-1 px-3 flex items-center gap-2">
                        <div className={cn("size-2 rounded-full", saving ? "bg-amber-500 animate-pulse" : "bg-green-500")} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/50">
                            {saving ? "Сохранение" : "Готово"}
                        </span>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="h-8 px-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-[10px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all gap-1.5 shrink-0 shadow-none border-0"
                    >
                        {saving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3.5" />}
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
}
