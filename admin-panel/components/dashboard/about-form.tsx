"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn, getImageUrl } from "@/lib/utils";
import {
    ImageIcon,
    Save,
    RefreshCw,
    BarChart3,
    ShieldCheck,
    Check,
    LayoutTemplate,
    Upload,
    Loader2,
    Info,
    Activity,
    Star,
    Layers,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import React, { memo } from "react";

type Language = "RU" | "UZ" | "EN";
type Section = "hero" | "metrics" | "values";

interface AboutFormProps {
    lang: Language;
}

export function AboutForm({ lang }: AboutFormProps) {
    const [activeSection, setActiveSection] = useState<Section>("hero");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/about`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/about`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) toast.success("Изменения сохранены");
            else throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при сохранении");
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
            const resData = await res.json();
            if (resData.url) {
                updateHeroField('image', resData.url);
                toast.success("Изображение загружено");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setUploading(false);
        }
    };

    const getFieldForLang = (b: string, l: Language) => l === 'RU' ? b : `${b}_${l.toLowerCase()}`;
    const updateHeroField = (f: string, v: any) => setData({ ...data, hero: { ...data.hero, [f]: v } });
    const updateMetric = (idx: number, f: string, v: any) => {
        const n = [...data.metrics]; n[idx] = { ...n[idx], [f]: v }; setData({ ...data, metrics: n });
    };
    const updateValue = (idx: number, f: string, v: any) => {
        const n = [...data.values]; n[idx] = { ...n[idx], [f]: v }; setData({ ...data, values: n });
    };

    if (loading || !data) return (
        <div className="w-full h-[400px] flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary/30" />
        </div>
    );

    const sections = [
        { id: 'hero', label: 'История', icon: LayoutTemplate },
        { id: 'metrics', label: 'Показатели', icon: Activity },
        { id: 'values', label: 'Ценности', icon: Layers },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-[#f8f8f9] dark:bg-[#000000] text-left">
            {/* Minimal Section Tabs */}
            <div className="h-14 shrink-0 flex items-center justify-center px-5 bg-white/50 dark:bg-black/50 backdrop-blur-xl z-20 sticky top-0 border-b border-black/[0.05]">
                <div className="flex items-center gap-1 p-1 bg-black/[0.03] dark:bg-white/[0.03] rounded-xl">
                    {sections.map((sec) => {
                        const isActive = activeSection === sec.id;
                        return (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSection(sec.id as Section)}
                                className={cn(
                                    "px-5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 outline-none whitespace-nowrap",
                                    isActive ? "bg-white dark:bg-[#1c1c1e] text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                                )}
                            >
                                <sec.icon className="size-3.5" />
                                <span>{sec.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5">
                <div className="max-w-4xl mx-auto space-y-6 pb-32">
                    
                    <AnimatePresence mode="wait">
                        {/* HERO / HISTORY */}
                        {activeSection === 'hero' && (
                            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] overflow-hidden shadow-none">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="p-6 space-y-4 border-r border-black/[0.05]">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Главный заголовок ({lang})</Label>
                                                <Input value={data.hero[getFieldForLang('heading', lang)] || ''} onChange={(e) => updateHeroField(getFieldForLang('heading', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Описание слева ({lang})</Label>
                                                <Textarea value={data.hero[getFieldForLang('desc_left', lang)] || ''} onChange={(e) => updateHeroField(getFieldForLang('desc_left', lang), e.target.value)} className="min-h-[100px] bg-black/[0.02] border-0 rounded-lg text-[12px] font-medium resize-none shadow-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Описание справа ({lang})</Label>
                                                <Textarea value={data.hero[getFieldForLang('desc_right', lang)] || ''} onChange={(e) => updateHeroField(getFieldForLang('desc_right', lang), e.target.value)} className="min-h-[100px] bg-black/[0.02] border-0 rounded-lg text-[12px] font-medium resize-none shadow-none" />
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col items-center justify-center gap-4 bg-black/[0.01]">
                                            <div className="relative group w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/[0.02] border border-black/[0.05]">
                                                {data.hero.image ? <img src={getImageUrl(data.hero.image)} className="w-full h-full object-cover" /> : <ImageIconAlt className="size-8 text-muted-foreground/20 m-auto mt-12" />}
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <input type="file" id="up-hero" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                                                    <Button onClick={() => document.getElementById('up-hero')?.click()} size="sm" className="rounded-lg bg-white text-black font-bold text-[11px] shadow-none">Изменить</Button>
                                                </div>
                                            </div>
                                            <Input value={data.hero.image || ""} readOnly className="h-8 text-[9px] font-mono bg-black/[0.02] border-0 rounded-lg text-muted-foreground/40 text-center shadow-none" />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* METRICS */}
                        {activeSection === 'metrics' && (
                            <motion.div key="metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                {data.metrics.map((item: any, idx: number) => (
                                    <Card key={idx} className="rounded-xl border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-4 flex items-center gap-5 shadow-none group">
                                        <div className="size-8 rounded-lg bg-primary/5 text-primary/40 flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0">#{idx + 1}</div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Показатель ({lang})</Label>
                                                <Input value={item[getFieldForLang('title', lang)] || ''} onChange={(e) => updateMetric(idx, getFieldForLang('title', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Описание ({lang})</Label>
                                                <Input value={item[getFieldForLang('text', lang)] || ''} onChange={(e) => updateMetric(idx, getFieldForLang('text', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[12px] font-medium shadow-none" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>
                        )}

                        {/* VALUES */}
                        {activeSection === 'values' && (
                            <motion.div key="values" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {data.values.map((item: any, idx: number) => (
                                    <Card key={idx} className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-5 space-y-4 shadow-none">
                                        <div className="flex justify-between items-center">
                                            <div className="size-7 rounded-lg bg-primary/5 text-primary/30 flex items-center justify-center text-[10px] font-black">#{idx + 1}</div>
                                            <div className="px-2 py-1 bg-black/[0.03] rounded-md text-[9px] font-mono text-muted-foreground/60">{item.icon}</div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок ({lang})</Label>
                                                <Input value={item[getFieldForLang('title', lang)] || ''} onChange={(e) => updateValue(idx, getFieldForLang('title', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Суть ({lang})</Label>
                                                <Textarea value={item[getFieldForLang('desc', lang)] || ''} onChange={(e) => updateValue(idx, getFieldForLang('desc', lang), e.target.value)} className="min-h-[80px] bg-black/[0.02] border-0 rounded-lg text-[12px] font-medium resize-none shadow-none" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Flat Action Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[280px]">
                <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.1] rounded-full p-1.5 flex items-center gap-1">
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
