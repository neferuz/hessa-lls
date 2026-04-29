"use client";

import { useState, useEffect, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, getImageUrl } from "@/lib/utils";
import {
    Check,
    Plus,
    Trash2,
    Loader2,
    SquareStack,
    Layers,
    Image as ImageIconAlt,
    Upload,
    Type
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";

// Import Quill dynamically
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="h-[150px] w-full bg-black/[0.02] animate-pulse rounded-xl border border-black/[0.05]" />
});
import "react-quill-new/dist/quill.snow.css";

type Language = "RU" | "UZ" | "EN";

interface StaticPageFormProps {
    lang: Language;
    pageKey: string;
    title: string;
}

// Memoized Section Component for performance
const FormSection = memo(({ 
    idx, 
    section, 
    lang, 
    updateSection, 
    handleFileUpload, 
    removeSection,
    quillModules 
}: any) => {
    const getFieldForLang = (b: string, l: Language) => l === 'RU' ? b : `${b}_${l.toLowerCase()}`;
    
    return (
        <Card className="rounded-[2rem] border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#1c1c1e] overflow-hidden shadow-none group relative transition-all hover:border-primary/20">
            <button 
                onClick={() => removeSection(idx)}
                className="absolute top-4 right-4 size-8 rounded-full bg-red-500/5 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="size-3.5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-8 space-y-6 border-r border-black/[0.05] dark:border-white/[0.05] text-left">
                    <div className="space-y-1.5 text-left">
                        <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 ml-1">Заголовок блока ({lang})</Label>
                        <Input 
                            value={section[getFieldForLang('title', lang)] || ''} 
                            onChange={(e) => updateSection(idx, getFieldForLang('title', lang), e.target.value)} 
                            className="h-10 bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-xl text-[14px] font-bold shadow-none focus-visible:ring-1 focus-visible:ring-primary/20" 
                        />
                    </div>
                    <div className="space-y-1.5 text-left">
                        <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 ml-1">Контент ({lang})</Label>
                        <div className="rounded-2xl overflow-hidden border border-black/[0.05] dark:border-white/[0.05]">
                            <ReactQuill 
                                theme="snow" 
                                value={section[getFieldForLang('content', lang)] || ''} 
                                onChange={(val) => updateSection(idx, getFieldForLang('content', lang), val)} 
                                modules={quillModules} 
                            />
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col items-center justify-center gap-5">
                    <div className="relative group/img w-full aspect-[16/10] rounded-[1.75rem] overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
                        {section.image ? (
                            <img src={getImageUrl(section.image)} className="w-full h-full object-cover transition-transform group-hover/img:scale-105 duration-700" alt="Section image" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/20">
                                <ImageIconAlt className="size-10 mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Нет изображения</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center">
                            <input type="file" id={`s-img-${idx}`} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, idx)} />
                            <Button 
                                onClick={() => document.getElementById(`s-img-${idx}`)?.click()} 
                                size="sm" 
                                className="rounded-full bg-white text-black font-black text-[11px] uppercase tracking-wider px-6 h-9 shadow-xl active:scale-95 transition-all"
                            >
                                <Upload className="size-3.5 mr-2" /> Загрузить фото
                            </Button>
                        </div>
                    </div>
                    <div className="w-full space-y-1 text-left">
                        <Label className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 ml-1 text-left">Путь к файлу</Label>
                        <Input 
                            value={section.image || "Файл не выбран"} 
                            readOnly 
                            className="h-8 text-[10px] font-mono bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg text-muted-foreground/40 px-3 truncate shadow-none" 
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
});

FormSection.displayName = "FormSection";

export function StaticPageForm({ lang, pageKey, title }: StaticPageFormProps) {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [pageKey]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/content`);
            if (res.ok) {
                const data = await res.json();
                if (data[pageKey]) setPageData(data[pageKey]);
                else setPageData({ title: "", subtitle: "", sections: [] });
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    const getFieldForLang = (b: string, l: Language) => l === 'RU' ? b : `${b}_${l.toLowerCase()}`;
    const updateField = (f: string, v: any) => setPageData((p: any) => ({ ...p, [f]: v }));
    
    const updateSection = (idx: number, f: string, v: any) => {
        setPageData((p: any) => {
            const s = [...(p.sections || [])];
            s[idx] = { ...s[idx], [f]: v };
            return { ...p, sections: s };
        });
    };

    const addSection = () => {
        const n = { 
            title: "Новый заголовок", title_uz: "", title_en: "", 
            content: "Ваш текст здесь...", content_uz: "", content_en: "", 
            image: null 
        };
        setPageData((p: any) => ({ ...p, sections: [...(p.sections || []), n] }));
        toast.info("Раздел добавлен");
    };

    const removeSection = (idx: number) => {
        setPageData((p: any) => ({ ...p, sections: p.sections.filter((_: any, i: number) => i !== idx) }));
        toast.info("Раздел удален");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                updateSection(idx, 'image', data.url);
                toast.success("Изображение загружено");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const currentRes = await fetch(`${API_BASE_URL}/api/content`);
            const currentContent = await currentRes.json();
            const updatedContent = { ...currentContent, [pageKey]: pageData };
            const res = await fetch(`${API_BASE_URL}/api/content`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedContent),
            });
            if (res.ok) {
                toast.success("Изменения успешно сохранены");
            } else throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сохранения контента");
        } finally {
            setSaving(false);
        }
    };

    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'bullet' }],
            ['clean']
        ],
    }), []);

    if (loading) return (
        <div className="w-full h-[400px] flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary/20" />
        </div>
    );

    return (
        <div className="w-full flex flex-col bg-transparent text-left">
            <style jsx global>{`
                .quill { background: transparent; border: none !important; }
                .ql-toolbar { border: none !important; border-bottom: 1px solid rgba(0,0,0,0.05) !important; padding: 12px !important; }
                .ql-container { border: none !important; min-height: 140px; font-family: inherit; font-size: 14px; }
                .ql-editor { min-height: 140px; padding: 16px !important; line-height: 1.6; }
                .dark .ql-editor { color: #fff; }
                .dark .ql-toolbar .ql-stroke { stroke: #fff; }
                .dark .ql-toolbar .ql-fill { fill: #fff; }
                .dark .ql-toolbar .ql-picker { color: #fff; }
            `}</style>

            <div className="flex-1 p-3 sm:p-5">
                <div className="w-full space-y-8 pb-32">
                    
                    {/* Page Meta */}
                    <Card className="rounded-[2.5rem] border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#1c1c1e] p-8 space-y-6 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] dark:border-white/[0.05] pb-5">
                            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Type className="size-4 text-primary" />
                            </div>
                            <span className="text-[15px] font-black uppercase tracking-tight">Глобальные заголовки страницы</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="space-y-1.5 text-left">
                                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 ml-1">Главный заголовок ({lang})</Label>
                                <Input 
                                    value={pageData?.[getFieldForLang('title', lang)] || ''} 
                                    onChange={(e) => updateField(getFieldForLang('title', lang), e.target.value)} 
                                    className="h-11 bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-xl text-[16px] font-black shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" 
                                />
                            </div>
                            <div className="space-y-1.5 text-left">
                                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 ml-1">Подзаголовок ({lang})</Label>
                                <Input 
                                    value={pageData?.[getFieldForLang('subtitle', lang)] || ''} 
                                    onChange={(e) => updateField(getFieldForLang('subtitle', lang), e.target.value)} 
                                    className="h-11 bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-xl text-[13px] font-bold shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all" 
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Sections List */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3 text-left">
                                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Layers className="size-4 text-primary" />
                                </div>
                                <span className="text-[15px] font-black uppercase tracking-tight">Контентные блоки ({pageData?.sections?.length || 0})</span>
                            </div>
                            <Button 
                                onClick={addSection} 
                                className="h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-wider px-6 shadow-xl active:scale-95 transition-all"
                            >
                                <Plus className="size-4 mr-2 stroke-[2.5]" /> Добавить блок
                            </Button>
                        </div>

                        <div className="space-y-5">
                            <AnimatePresence initial={false}>
                                {(pageData?.sections || []).map((section: any, idx: number) => (
                                    <motion.div 
                                        key={idx} 
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                        transition={{ duration: 0.3, ease: "circOut" }}
                                    >
                                        <FormSection 
                                            idx={idx} 
                                            section={section} 
                                            lang={lang} 
                                            updateSection={updateSection} 
                                            handleFileUpload={handleFileUpload} 
                                            removeSection={removeSection}
                                            quillModules={quillModules}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flat Action Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[320px]">
                <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border border-black/[0.05] dark:border-white/[0.1] rounded-full p-2 flex items-center gap-2 shadow-2xl shadow-black/10">
                    <div className="flex-1 px-4 flex items-center gap-3">
                        <div className={cn("size-2 rounded-full", saving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                            {saving ? "ПРОЦЕСС..." : "ГОТОВО"}
                        </span>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="h-10 px-6 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-[0.1em] hover:opacity-90 active:scale-95 transition-all gap-2 shrink-0 shadow-xl"
                    >
                        {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-4 stroke-[3]" />}
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
}
