"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Save,
    RefreshCw,
    Type,
    Phone,
    Mail,
    Instagram,
    Send,
    MapPin,
    Check,
    Globe,
    X,
    Plus,
    Paperclip,
    Shield,
    Loader2,
    LayoutPanelTop,
    Link as LinkIcon,
    Copyright
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import React, { memo } from "react";

type Language = "RU" | "UZ" | "EN";

interface FooterFormProps {
    lang: Language;
}

export function FooterForm({ lang }: FooterFormProps) {
    const [footer, setFooter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/content`);
            if (res.ok) {
                const data = await res.json();
                if (data.footer) setFooter(data.footer);
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
                body: JSON.stringify({ ...currentContent, footer }),
            });
            if (res.ok) toast.success("Сохранено");
            else throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при сохранении");
        } finally {
            setSaving(false);
        }
    };

    const updateField = (f: string, v: string) => setFooter((prev: any) => ({ ...prev, [f]: v }));
    const getFieldForLang = (b: string, l: Language) => l === 'RU' ? b : `${b}_${l.toLowerCase()}`;

    const addLink = (colKey: string) => {
        const n = { label: "Новая ссылка", label_uz: "", label_en: "", url: "#" };
        setFooter((p: any) => ({ ...p, [colKey]: [...(p[colKey] || []), n] }));
    };

    const removeLink = (colKey: string, idx: number) => {
        setFooter((p: any) => ({ ...p, [colKey]: p[colKey].filter((_: any, i: number) => i !== idx) }));
    };

    const updateLink = (colKey: string, idx: number, f: string, v: string) => {
        setFooter((p: any) => {
            const l = [...(p[colKey] || [])];
            l[idx] = { ...l[idx], [f]: v };
            return { ...p, [colKey]: l };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, colKey: string, idx: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                updateLink(colKey, idx, 'url', data.url);
                toast.success("Файл загружен");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        }
    };

    if (loading || !footer) return (
        <div className="w-full h-[400px] flex items-center justify-center p-20">
            <Loader2 className="size-6 animate-spin text-primary/30" />
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col bg-[#f8f8f9] dark:bg-[#000000] text-left">
            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5">
                <div className="max-w-4xl mx-auto space-y-6 pb-32">
                    
                    {/* Branding & Slogan */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <LayoutPanelTop className="size-4 text-primary" />
                            <span className="text-[14px] font-bold">Брендинг и слоган</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Слоган компании ({lang})</Label>
                                <Textarea 
                                    value={footer?.[getFieldForLang('slogan', lang)] || ''} 
                                    onChange={(e) => updateField(getFieldForLang('slogan', lang), e.target.value)} 
                                    className="min-h-[80px] bg-black/[0.02] border-0 rounded-xl text-[13px] font-medium resize-none shadow-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Текст копирайта</Label>
                                <div className="relative">
                                    <Copyright className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/30" />
                                    <Input value={footer?.copyright_text || ''} onChange={(e) => updateField('copyright_text', e.target.value)} className="h-9 pl-9 bg-black/[0.02] border-0 rounded-lg text-[12px] font-bold shadow-none" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Contacts */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-5 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <Phone className="size-4 text-green-500" />
                            <span className="text-[14px] font-bold">Контактные данные</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Телефон</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/30" />
                                    <Input value={footer?.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="h-9 pl-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/30" />
                                    <Input value={footer?.email || ''} onChange={(e) => updateField('email', e.target.value)} className="h-9 pl-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Физический адрес ({lang})</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/30" />
                                <Input value={footer?.[getFieldForLang('location', lang)] || ''} onChange={(e) => updateField(getFieldForLang('location', lang), e.target.value)} className="h-9 pl-9 bg-black/[0.02] border-0 rounded-lg text-[12px] font-bold shadow-none" />
                            </div>
                        </div>
                    </Card>

                    {/* Legal Links */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Shield className="size-4 text-slate-400" />
                                <span className="text-[13px] font-bold">Юридические документы</span>
                            </div>
                            <Button onClick={() => addLink('legal_links')} variant="outline" className="h-8 rounded-lg border-dashed border-primary/20 text-primary text-[11px] font-bold hover:bg-primary/5">
                                <Plus className="size-3.5 mr-1.5" /> Добавить ссылку
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(footer?.legal_links || []).map((link: any, idx: number) => (
                                <Card key={idx} className="rounded-xl border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-4 space-y-3 shadow-none relative group">
                                    <button 
                                        onClick={() => removeLink('legal_links', idx)}
                                        className="absolute top-3 right-3 size-6 rounded-lg bg-red-500/5 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X className="size-3" />
                                    </button>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-semibold text-muted-foreground/40">Название ({lang})</Label>
                                        <Input value={link[getFieldForLang('label', lang)] || ''} onChange={(e) => updateLink('legal_links', idx, getFieldForLang('label', lang), e.target.value)} className="h-8 bg-black/[0.01] border-0 rounded-lg text-[12px] font-bold shadow-none px-0" />
                                    </div>
                                    <div className="flex items-center gap-2 pt-1 border-t border-black/[0.03]">
                                        <div className="flex-1 relative">
                                            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/30" />
                                            <Input value={link.url || ''} onChange={(e) => updateLink('legal_links', idx, 'url', e.target.value)} className="h-8 pl-8 bg-black/[0.01] border-0 rounded-lg text-[10px] font-mono text-muted-foreground shadow-none" />
                                        </div>
                                        <Button 
                                            variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-black/[0.03] text-muted-foreground hover:text-primary transition-colors"
                                            onClick={() => document.getElementById(`f-legal-${idx}`)?.click()}
                                        >
                                            <Paperclip className="size-3.5" />
                                        </Button>
                                        <input type="file" id={`f-legal-${idx}`} className="hidden" onChange={(e) => handleFileUpload(e, 'legal_links', idx)} />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
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
