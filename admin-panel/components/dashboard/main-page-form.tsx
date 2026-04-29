"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn, getImageUrl } from "@/lib/utils";
import {
    Upload,
    ImageIcon,
    Save,
    RefreshCw,
    Megaphone,
    Sparkles,
    Check,
    ChevronRight,
    Type,
    ArrowRight,
    HelpCircle,
    Plus,
    Trash2,
    Layout,
    Layers,
    MessageSquare,
    Image as ImageIconAlt,
    Star,
    CheckCircle2,
    X,
    FileText,
    Activity,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import React, { memo } from "react";

type Language = "RU" | "UZ" | "EN";
type SlideIndex = 0 | 1 | 2;
type Section = "hero" | "ticker" | "benefits" | "difference" | "experts" | "reviews" | "faq";

interface MainPageFormProps {
    lang: Language;
}

export function MainPageForm({ lang }: MainPageFormProps) {
    const [activeSlide, setActiveSlide] = useState<SlideIndex>(0);
    const [activeSection, setActiveSection] = useState<Section>("hero");
    const [activeDiff, setActiveDiff] = useState(0);
    const [activeSpec, setActiveSpec] = useState(0);
    const [activeReview, setActiveReview] = useState(0);

    const [slides, setSlides] = useState<any[]>([]);
    const [ticker, setTicker] = useState<any[]>([]);
    const [benefits, setBenefits] = useState<any[]>([]);
    const [difference, setDifference] = useState<any[]>([]);
    const [specialists, setSpecialists] = useState<any[]>([]);
    const [expertsMeta, setExpertsMeta] = useState<any>({});
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsMeta, setReviewsMeta] = useState<any>({});
    const [faq, setFaq] = useState<any[]>([]);
    const [faqTitles, setFaqTitles] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<number | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [resHero, resContent] = await Promise.all([
                fetch(`${API_BASE_URL}/api/hero`),
                fetch(`${API_BASE_URL}/api/content`)
            ]);
            if (resHero.ok) {
                const dataHero = await resHero.json();
                if (dataHero.slides) setSlides(dataHero.slides);
            }
            if (resContent.ok) {
                const dataContent = await resContent.json();
                if (dataContent.ticker) setTicker(dataContent.ticker);
                if (dataContent.benefits) setBenefits(dataContent.benefits);
                if (dataContent.difference) setDifference(dataContent.difference);
                if (dataContent.specialists) setSpecialists(dataContent.specialists);
                setExpertsMeta({
                    experts_badge: dataContent.experts_badge || "",
                    experts_badge_uz: dataContent.experts_badge_uz || "",
                    experts_badge_en: dataContent.experts_badge_en || "",
                    experts_title: dataContent.experts_title || "",
                    experts_title_uz: dataContent.experts_title_uz || "",
                    experts_title_en: dataContent.experts_title_en || "",
                    experts_desc: dataContent.experts_desc || "",
                    experts_desc_uz: dataContent.experts_desc_uz || "",
                    experts_desc_en: dataContent.experts_desc_en || "",
                    experts_text: dataContent.experts_text || "",
                    experts_text_uz: dataContent.experts_text_uz || "",
                    experts_text_en: dataContent.experts_text_en || "",
                    experts_btn: dataContent.experts_btn || "",
                    experts_btn_uz: dataContent.experts_btn_uz || "",
                    experts_btn_en: dataContent.experts_btn_en || "",
                });
                if (dataContent.faq) setFaq(dataContent.faq);
                setFaqTitles({
                    faq_title: dataContent.faq_title || "",
                    faq_title_uz: dataContent.faq_title_uz || "",
                    faq_title_en: dataContent.faq_title_en || "",
                    faq_subtitle: dataContent.faq_subtitle || "",
                    faq_subtitle_uz: dataContent.faq_subtitle_uz || "",
                    faq_subtitle_en: dataContent.faq_subtitle_en || "",
                });
                if (dataContent.reviews_list) setReviews(dataContent.reviews_list);
                setReviewsMeta({
                    reviews_badge: dataContent.reviews_badge || "",
                    reviews_badge_uz: dataContent.reviews_badge_uz || "",
                    reviews_badge_en: dataContent.reviews_badge_en || "",
                    reviews_title: dataContent.reviews_title || "",
                    reviews_title_uz: dataContent.reviews_title_uz || "",
                    reviews_title_en: dataContent.reviews_title_en || "",
                    reviews_desc: dataContent.reviews_desc || "",
                    reviews_desc_uz: dataContent.reviews_desc_uz || "",
                    reviews_desc_en: dataContent.reviews_desc_en || "",
                });
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
            let res;
            if (activeSection === 'hero') {
                res = await fetch(`${API_BASE_URL}/api/hero`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slides }),
                });
            } else {
                const body: any = {};
                if (activeSection === 'ticker') body.ticker = ticker;
                if (activeSection === 'benefits') body.benefits = benefits;
                if (activeSection === 'difference') body.difference = difference;
                if (activeSection === 'experts') { body.specialists = specialists; Object.assign(body, expertsMeta); }
                if (activeSection === 'faq') { body.faq = faq; Object.assign(body, faqTitles); }
                if (activeSection === 'reviews') { body.reviews_list = reviews; Object.assign(body, reviewsMeta); }

                res = await fetch(`${API_BASE_URL}/api/content`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
            }
            if (res && res.ok) toast.success("Изменения сохранены");
            else throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при сохранении");
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = async (index: number, file: File) => {
        if (!file) return;
        setUploading(index);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                if (activeSection === 'hero') updateSlideField(index, 'image', data.url);
                else if (activeSection === 'difference') updateDifference(index, 'image', data.url);
                else if (activeSection === 'experts') updateSpecialist(index, 'image', data.url);
                toast.success("Готово");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setUploading(null);
        }
    };

    const updateSlideField = (idx: number, f: string, v: any) => { const n = [...slides]; n[idx] = { ...n[idx], [f]: v }; setSlides(n); };
    const updateTicker = (idx: number, f: string, v: any) => { const n = [...ticker]; n[idx] = { ...n[idx], [f]: v }; setTicker(n); };
    const updateBenefit = (idx: number, f: string, v: any) => { const n = [...benefits]; n[idx] = { ...n[idx], [f]: v }; setBenefits(n); };
    const updateDifference = (idx: number, f: string, v: any) => { const n = [...difference]; n[idx] = { ...n[idx], [f]: v }; setDifference(n); };
    const updateSpecialist = (idx: number, f: string, v: any) => { const n = [...specialists]; n[idx] = { ...n[idx], [f]: v }; setSpecialists(n); };
    const updateExpertsMeta = (f: string, v: any) => setExpertsMeta({ ...expertsMeta, [f]: v });
    const updateFaq = (idx: number, f: string, v: any) => { const n = [...faq]; n[idx] = { ...n[idx], [f]: v }; setFaq(n); };
    const updateFaqTitles = (f: string, v: any) => setFaqTitles({ ...faqTitles, [f]: v });
    const updateReview = (idx: number, f: string, v: any) => { const n = [...reviews]; n[idx] = { ...n[idx], [f]: v }; setReviews(n); };
    const updateReviewsMeta = (f: string, v: any) => setReviewsMeta({ ...reviewsMeta, [f]: v });

    const addReview = () => setReviews([...reviews, { id: Date.now(), user_name: "Имя", user_handle: "@handle", rating: 5.0, text: "", text_uz: "", text_en: "" }]);
    const addFaqItem = () => setFaq([...faq, { question: "", question_uz: "", question_en: "", answer: "", answer_uz: "", answer_en: "" }]);
    const addDifferenceCard = () => setDifference([...difference, { id: Date.now(), title: "", title_uz: "", title_en: "", desc: "", full_text: "", image: "", product_ids: [] }]);
    const addSpecialist = () => setSpecialists([...specialists, { id: Date.now(), name: "", role: "", image: "" }]);

    const getFieldForLang = (b: string, l: Language) => l === 'RU' ? b : `${b}_${l.toLowerCase()}`;

    if (loading) return (
        <div className="w-full h-full flex flex-col items-center justify-center p-20">
            <Loader2 className="size-6 animate-spin text-primary/30" />
        </div>
    );

    const sections = [
        { id: 'hero', label: 'Баннеры', icon: ImageIconAlt },
        { id: 'ticker', label: 'Строка', icon: Megaphone },
        { id: 'benefits', label: 'Плюсы', icon: Sparkles },
        { id: 'difference', label: 'Карточки', icon: Layers },
        { id: 'experts', label: 'Эксперты', icon: Activity },
        { id: 'reviews', label: 'Отзывы', icon: MessageSquare },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
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
                                    "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 whitespace-nowrap",
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
                <div className="max-w-4xl mx-auto space-y-8 pb-32">
                    
                    <AnimatePresence mode="wait">
                        {/* HERO */}
                        {activeSection === 'hero' && (
                            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="flex justify-center gap-2">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx} onClick={() => setActiveSlide(idx as SlideIndex)}
                                            className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold border transition-all", activeSlide === idx ? "bg-primary/5 border-primary/20 text-primary" : "bg-white dark:bg-white/5 border-transparent text-muted-foreground/40")}
                                        >
                                            #{idx + 1}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-4 shadow-none">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок ({lang})</Label>
                                                <Input value={slides[activeSlide]?.[getFieldForLang('headline', lang)] || ''} onChange={(e) => updateSlideField(activeSlide, getFieldForLang('headline', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Описание ({lang})</Label>
                                                <Textarea value={slides[activeSlide]?.[getFieldForLang('descriptionLeft', lang)] || ''} onChange={(e) => updateSlideField(activeSlide, getFieldForLang('descriptionLeft', lang), e.target.value)} className="min-h-[100px] bg-black/[0.02] border-0 rounded-lg text-[12px] font-medium resize-none shadow-none" />
                                            </div>
                                        </div>
                                    </Card>
                                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 flex flex-col items-center justify-center gap-4 shadow-none">
                                        <div className="relative group w-full aspect-video rounded-xl overflow-hidden bg-black/[0.02] border border-black/[0.05]">
                                            {slides[activeSlide]?.image ? <img src={getImageUrl(slides[activeSlide].image)} className="w-full h-full object-cover" /> : <ImageIconAlt className="size-8 text-muted-foreground/20 m-auto mt-10" />}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <input type="file" id={`h-${activeSlide}`} className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(activeSlide, e.target.files[0])} />
                                                <Button onClick={() => document.getElementById(`h-${activeSlide}`)?.click()} size="sm" className="rounded-lg bg-white text-black text-[11px] font-bold">Изменить</Button>
                                            </div>
                                        </div>
                                        <Input value={slides[activeSlide]?.image || ""} readOnly className="h-8 text-[9px] font-mono bg-black/[0.02] border-0 rounded-lg text-muted-foreground/40 text-center shadow-none" />
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {/* TICKER */}
                        {activeSection === 'ticker' && (
                            <motion.div key="ticker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto">
                                <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-4 shadow-none">
                                    <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                                        <Megaphone className="size-4 text-orange-500" />
                                        <span className="text-[13px] font-bold">Бегущая строка</span>
                                    </div>
                                    <div className="space-y-3">
                                        {ticker.map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Фраза {idx + 1} ({lang})</Label>
                                                <Input value={item[getFieldForLang('text', lang)] || ''} onChange={(e) => updateTicker(idx, getFieldForLang('text', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[12px] font-bold shadow-none" />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* BENEFITS - High Density & Shadow-free */}
                        {activeSection === 'benefits' && (
                            <motion.div key="benefits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
                                {benefits.map((item, idx) => (
                                    <Card key={idx} className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 space-y-3 shadow-none relative">
                                        <div className="text-[10px] font-bold text-primary/40 tabular-nums">#{idx + 1}</div>
                                        <div className="space-y-2.5">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок ({lang})</Label>
                                                <Input
                                                    value={item[getFieldForLang('title', lang)] || ''}
                                                    onChange={(e) => updateBenefit(idx, getFieldForLang('title', lang), e.target.value)}
                                                    className="h-8 bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg text-[14px] font-bold shadow-none"
                                                    placeholder="Напр: 4+ года"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Текст ({lang})</Label>
                                                <Input
                                                    value={item[getFieldForLang('text', lang)] || ''}
                                                    onChange={(e) => updateBenefit(idx, getFieldForLang('text', lang), e.target.value)}
                                                    className="h-8 bg-black/[0.02] dark:bg-white/[0.02] border-0 rounded-lg text-[11px] font-semibold shadow-none"
                                                    placeholder="Описание..."
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>
                        )}

                        {/* DIFFERENCE */}
                        {activeSection === 'difference' && (
                            <motion.div key="difference" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {difference.map((_, idx) => (
                                        <button key={idx} onClick={() => setActiveDiff(idx)} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold border transition-all", activeDiff === idx ? "bg-primary text-white border-primary" : "bg-white text-muted-foreground/40 border-transparent")}>#{idx + 1}</button>
                                    ))}
                                    <Button onClick={addDifferenceCard} variant="ghost" size="sm" className="h-8 rounded-lg border border-dashed border-primary/20 text-primary"><Plus className="size-3" /></Button>
                                </div>
                                <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 shadow-none flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Название ({lang})</Label><Input value={difference[activeDiff]?.[getFieldForLang('title', lang)] || ''} onChange={(e) => updateDifference(activeDiff, getFieldForLang('title', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold shadow-none" /></div>
                                        <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Кратко ({lang})</Label><Input value={difference[activeDiff]?.[getFieldForLang('desc', lang)] || ''} onChange={(e) => updateDifference(activeDiff, getFieldForLang('desc', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[12px] font-semibold shadow-none" /></div>
                                    </div>
                                    <div className="w-32 aspect-square rounded-xl bg-black/[0.02] border border-black/[0.05] flex-shrink-0 relative group">
                                        {difference[activeDiff]?.image ? <img src={getImageUrl(difference[activeDiff].image)} className="w-full h-full object-cover rounded-xl" /> : <ImageIconAlt className="size-6 text-muted-foreground/20 m-auto mt-10" />}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <input type="file" id={`d-${activeDiff}`} className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(activeDiff, e.target.files[0])} />
                                            <Button onClick={() => document.getElementById(`d-${activeDiff}`)?.click()} size="icon" className="size-8 rounded-lg bg-white text-black"><Upload className="size-3.5" /></Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* REVIEWS */}
                        {activeSection === 'reviews' && (
                            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок ({lang})</Label><Input value={reviewsMeta[getFieldForLang('reviews_title', lang)] || ''} onChange={(e) => updateReviewsMeta(getFieldForLang('reviews_title', lang), e.target.value)} className="h-9 bg-white border-black/[0.05] rounded-lg shadow-none" /></div>
                                    <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Описание ({lang})</Label><Input value={reviewsMeta[getFieldForLang('reviews_desc', lang)] || ''} onChange={(e) => updateReviewsMeta(getFieldForLang('reviews_desc', lang), e.target.value)} className="h-9 bg-white border-black/[0.05] rounded-lg shadow-none" /></div>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {reviews.map((_, idx) => (
                                        <button key={idx} onClick={() => setActiveReview(idx)} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold border transition-all", activeReview === idx ? "bg-primary text-white" : "bg-white text-muted-foreground/30")}>#{idx + 1}</button>
                                    ))}
                                    <Button onClick={addReview} variant="ghost" size="sm" className="h-8 rounded-lg border border-dashed border-primary/20"><Plus className="size-3" /></Button>
                                </div>
                                <Card className="rounded-[1.5rem] border-black/[0.05] bg-white p-6 space-y-4 shadow-none">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Имя</Label><Input value={reviews[activeReview]?.user_name || ''} onChange={(e) => updateReview(activeReview, 'user_name', e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg shadow-none" /></div>
                                        <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Никнейм</Label><Input value={reviews[activeReview]?.user_handle || ''} onChange={(e) => updateReview(activeReview, 'user_handle', e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-primary shadow-none" /></div>
                                    </div>
                                    <div className="space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Текст ({lang})</Label><Textarea value={reviews[activeReview]?.[getFieldForLang('text', lang)] || ''} onChange={(e) => updateReview(activeReview, getFieldForLang('text', lang), e.target.value)} className="min-h-[100px] bg-black/[0.02] border-0 rounded-xl resize-none shadow-none" /></div>
                                </Card>
                            </motion.div>
                        )}

                        {/* FAQ */}
                        {activeSection === 'faq' && (
                            <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <Card className="rounded-[1.5rem] border-black/[0.05] bg-white p-5 shadow-none flex gap-4">
                                    <div className="flex-1 space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Заголовок FAQ ({lang})</Label><Input value={faqTitles[getFieldForLang('faq_title', lang)] || ''} onChange={(e) => updateFaqTitles(getFieldForLang('faq_title', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg font-bold shadow-none" /></div>
                                    <div className="flex-1 space-y-1"><Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1">Подзаголовок FAQ ({lang})</Label><Input value={faqTitles[getFieldForLang('faq_subtitle', lang)] || ''} onChange={(e) => updateFaqTitles(getFieldForLang('faq_subtitle', lang), e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg shadow-none" /></div>
                                </Card>
                                <div className="space-y-2">
                                    {faq.map((item, idx) => (
                                        <Card key={idx} className="rounded-xl border-black/[0.05] bg-white p-4 space-y-2 shadow-none relative group">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold opacity-20">#{idx + 1}</span>
                                                <Input value={item[getFieldForLang('question', lang)] || ''} onChange={(e) => updateFaq(idx, getFieldForLang('question', lang), e.target.value)} className="h-8 bg-transparent border-0 p-0 text-[13px] font-bold shadow-none" placeholder="Вопрос..." />
                                            </div>
                                            <Textarea value={item[getFieldForLang('answer', lang)] || ''} onChange={(e) => updateFaq(idx, getFieldForLang('answer', lang), e.target.value)} className="min-h-[60px] bg-black/[0.01] border-0 rounded-lg text-[12px] font-medium resize-none shadow-none" placeholder="Ответ..." />
                                        </Card>
                                    ))}
                                    <Button onClick={addFaqItem} variant="outline" className="w-full h-10 rounded-xl border-dashed border-black/10 text-muted-foreground hover:bg-black/[0.02] shadow-none"><Plus className="size-3.5 mr-2" /> Добавить</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Flat Action Bar - Compact & Shadow-free */}
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
