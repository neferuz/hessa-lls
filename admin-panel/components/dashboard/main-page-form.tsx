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
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

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

    // Data States
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

    // Fetch existing data
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [resHero, resContent] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/hero'),
                fetch('http://127.0.0.1:8000/api/content')
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
            toast.error("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let res;
            if (activeSection === 'hero') {
                res = await fetch('http://127.0.0.1:8000/api/hero', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slides }),
                });
            } else if (activeSection === 'ticker') {
                res = await fetch('http://127.0.0.1:8000/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticker }),
                });
            } else if (activeSection === 'benefits') {
                res = await fetch('http://127.0.0.1:8000/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ benefits }),
                });
            } else if (activeSection === 'difference') {
                res = await fetch('http://127.0.0.1:8000/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ difference }),
                });
            } else if (activeSection === 'experts') {
                res = await fetch('http://127.0.0.1:8000/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        specialists,
                        ...expertsMeta
                    }),
                });
            } else if (activeSection === 'faq') {
                res = await fetch('http://127.0.0.1:8000/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        faq,
                        ...faqTitles
                    }),
                });
            } else if (activeSection === 'reviews') {
                res = await fetch('http://127.0.0.1:8000/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        reviews_list: reviews,
                        ...reviewsMeta
                    }),
                });
            }

            if (res && res.ok) {
                toast.success("Изменения сохранены");
            } else {
                throw new Error("Failed to save");
            }
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
            const res = await fetch('http://127.0.0.1:8000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                if (activeSection === 'hero') {
                    updateSlideField(index, 'image', data.url);
                } else if (activeSection === 'difference') {
                    updateDifference(index, 'image', data.url);
                } else if (activeSection === 'experts') {
                    updateSpecialist(index, 'image', data.url);
                }
                toast.success("Изображение загружено");
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Ошибка загрузки");
        } finally {
            setUploading(null);
        }
    };

    const updateSlideField = (index: number, field: string, value: any) => {
        const newSlides = [...slides];
        if (!newSlides[index]) return;
        newSlides[index] = { ...newSlides[index], [field]: value };
        setSlides(newSlides);
    };

    const updateTicker = (index: number, field: string, value: any) => {
        const newTicker = [...ticker];
        if (!newTicker[index]) return;
        newTicker[index] = { ...newTicker[index], [field]: value };
        setTicker(newTicker);
    };

    const updateBenefit = (index: number, field: string, value: any) => {
        const newBenefits = [...benefits];
        if (!newBenefits[index]) return;
        newBenefits[index] = { ...newBenefits[index], [field]: value };
        setBenefits(newBenefits);
    };
    
    const updateDifference = (index: number, field: string, value: any) => {
        const newDiff = [...difference];
        if (!newDiff[index]) return;
        newDiff[index] = { ...newDiff[index], [field]: value };
        setDifference(newDiff);
    };

    const updateSpecialist = (index: number, field: string, value: any) => {
        const newSpecs = [...specialists];
        if (!newSpecs[index]) return;
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setSpecialists(newSpecs);
    };

    const updateExpertsMeta = (field: string, value: any) => {
        setExpertsMeta({ ...expertsMeta, [field]: value });
    };

    const updateFaq = (index: number, field: string, value: any) => {
        const newFaq = [...faq];
        if (!newFaq[index]) return;
        newFaq[index] = { ...newFaq[index], [field]: value };
        setFaq(newFaq);
    };

    const updateFaqTitles = (field: string, value: any) => {
        setFaqTitles({ ...faqTitles, [field]: value });
    };

    const updateReview = (index: number, field: string, value: any) => {
        const newReviews = [...reviews];
        if (!newReviews[index]) return;
        newReviews[index] = { ...newReviews[index], [field]: value };
        setReviews(newReviews);
    };

    const updateReviewsMeta = (field: string, value: any) => {
        setReviewsMeta({ ...reviewsMeta, [field]: value });
    };

    const addReview = () => {
        const nextId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
        setReviews([...reviews, {
            id: nextId,
            user_name: "Новый пользователь",
            user_handle: "@handle",
            rating: 5.0,
            text: "Текст отзыва", text_uz: "", text_en: ""
        }]);
    };

    const removeReview = (index: number) => {
        setReviews(reviews.filter((_, i) => i !== index));
        if (activeReview >= reviews.length - 1 && activeReview > 0) {
            setActiveReview(activeReview - 1);
        }
    };

    const addFaqItem = () => {
        setFaq([...faq, {
            question: "Новый вопрос", question_uz: "", question_en: "",
            answer: "Текст ответа", answer_uz: "", answer_en: ""
        }]);
    };

    const removeFaqItem = (index: number) => {
        setFaq(faq.filter((_, i) => i !== index));
    };

    const addDifferenceCard = () => {
        const nextId = difference.length > 0 ? Math.max(...difference.map(d => d.id)) + 1 : 1;
        setDifference([...difference, {
            id: nextId,
            title: "Новая карточка", title_uz: "", title_en: "",
            desc: "Краткое описание", desc_uz: "", desc_en: "",
            full_text: "Полное описание", full_text_uz: "", full_text_en: "",
            image: "",
            product_ids: []
        }]);
    };

    const removeDifferenceCard = (index: number) => {
        setDifference(difference.filter((_, i) => i !== index));
        if (activeDiff >= difference.length - 1 && activeDiff > 0) {
            setActiveDiff(activeDiff - 1);
        }
    };

    const addSpecialist = () => {
        const nextId = specialists.length > 0 ? Math.max(...specialists.map(s => s.id)) + 1 : 1;
        setSpecialists([...specialists, {
            id: nextId,
            name: "Новый специалист", name_uz: "", name_en: "",
            role: "Должность", role_uz: "", role_en: "",
            image: ""
        }]);
    };

    const removeSpecialist = (index: number) => {
        setSpecialists(specialists.filter((_, i) => i !== index));
        if (activeSpec >= specialists.length - 1 && activeSpec > 0) {
            setActiveSpec(activeSpec - 1);
        }
    };

    const getFieldForLang = (baseName: string, currentLang: Language) => {
        if (currentLang === 'RU') return baseName;
        return `${baseName}_${currentLang.toLowerCase()}`;
    };

    const resolveImageUrl = (path: string) => {
        return getImageUrl(path);
    };

    if (loading) {
        return (
            <div className="w-full h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="size-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
        );
    }

    const MyImage = ({ src, alt }: { src: string, alt?: string }) => {
        const [error, setError] = useState(false);
        const resolvedSrc = resolveImageUrl(src);

        if (!src || error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30">
                    <ImageIcon className="size-12 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-widest">Нет изображения</span>
                </div>
            );
        }

        return (
            <img
                src={resolvedSrc}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={alt}
                onError={() => setError(true)}
            />
        );
    };

    const currentSlide = slides[activeSlide];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const slideVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "tween" as const, ease: "easeOut" as const, duration: 0.3 }
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            className="w-full p-6 space-y-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Main Tabs */}
            <div className="flex justify-center">
                <div className="inline-flex bg-muted/30 p-1 rounded-2xl border border-border/50 shadow-none backdrop-blur-sm">
                    {[
                        { id: 'hero', label: 'Баннеры', icon: ImageIcon },
                        { id: 'ticker', label: 'Строка', icon: Megaphone },
                        { id: 'benefits', label: 'Преимущества', icon: Sparkles },
                        { id: 'difference', label: 'Карточки', icon: ChevronRight },
                        { id: 'experts', label: 'Эксперты', icon: Type },
                        { id: 'reviews', label: 'Отзывы', icon: Megaphone },
                        { id: 'faq', label: 'FAQ', icon: HelpCircle },
                    ].map((sec) => {
                        const isActive = activeSection === sec.id;
                        return (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSection(sec.id as Section)}
                                className={cn(
                                    "relative px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2.5 z-0 outline-none focus-visible:ring-2 ring-primary/20",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSection"
                                        className="absolute inset-0 bg-primary rounded-xl shadow-none z-[-1]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <sec.icon className="size-4" />
                                <span>{sec.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* HERO SECTION */}
                {activeSection === 'hero' && (
                    <motion.div
                        key="hero"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        {/* Slide Dots Tabs */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveSlide(idx as SlideIndex)}
                                        className={cn(
                                            "relative px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-200 border",
                                            activeSlide === idx
                                                ? "bg-primary/5 border-primary/20 text-primary shadow-none ring-2 ring-primary/10"
                                                : "bg-muted/20 border-transparent text-muted-foreground hover:border-border hover:bg-muted/40"
                                        )}
                                    >
                                        Слайд {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    {/* Left: Fields */}
                                    <div className="p-8 space-y-8 lg:border-r border-border/50">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                                    <Type className="size-4" />
                                                </div>
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Текстовый контент</h3>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between pl-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Заголовок</Label>
                                                    <span className={cn(
                                                        "text-[10px] font-bold tabular-nums",
                                                        (currentSlide?.[getFieldForLang('headline', lang)]?.length || 0) > 45 
                                                            ? "text-destructive" 
                                                            : "text-muted-foreground"
                                                    )}>
                                                        {currentSlide?.[getFieldForLang('headline', lang)]?.length || 0}/45
                                                    </span>
                                                </div>
                                                <Input
                                                    placeholder="Введите заголовок..."
                                                    value={currentSlide?.[getFieldForLang('headline', lang)] || ''}
                                                    onChange={(e) => updateSlideField(activeSlide, getFieldForLang('headline', lang), e.target.value)}
                                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Текст кнопки</Label>
                                                <Input
                                                    placeholder="Текст кнопки..."
                                                    value={currentSlide?.[getFieldForLang('buttonText', lang)] || ''}
                                                    onChange={(e) => updateSlideField(activeSlide, getFieldForLang('buttonText', lang), e.target.value)}
                                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between pl-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Описание</Label>
                                                    <span className={cn(
                                                        "text-[10px] font-bold tabular-nums",
                                                        (currentSlide?.[getFieldForLang('descriptionLeft', lang)]?.length || 0) > 160 
                                                            ? "text-destructive" 
                                                            : "text-muted-foreground"
                                                    )}>
                                                        {currentSlide?.[getFieldForLang('descriptionLeft', lang)]?.length || 0}/160
                                                    </span>
                                                </div>
                                                <Textarea
                                                    value={currentSlide?.[getFieldForLang('descriptionLeft', lang)] || ''}
                                                    onChange={(e) => updateSlideField(activeSlide, getFieldForLang('descriptionLeft', lang), e.target.value)}
                                                    className="min-h-[120px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl resize-none transition-all"
                                                    placeholder="Введите описание слайда..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Visual */}
                                    <div className="p-8 bg-muted/5 flex flex-col justify-between space-y-6">
                                        <div className="space-y-4 h-full flex flex-col">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                    <ImageIcon className="size-4" />
                                                </div>
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Изображение</h3>
                                            </div>

                                            <div className="relative group/image flex-1 min-h-[250px] w-full rounded-2xl overflow-hidden border-2 border-dashed border-border/60 bg-muted/10 hover:border-primary/30 hover:bg-muted/20 transition-all">
                                                <MyImage src={currentSlide?.image} />

                                                {/* Upload Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                                    <input
                                                        type="file"
                                                        id={`upload-${activeSlide}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files && handleUpload(activeSlide, e.target.files[0])}
                                                    />
                                                    <Button
                                                        size="lg"
                                                        className="rounded-full font-bold shadow-none"
                                                        onClick={() => document.getElementById(`upload-${activeSlide}`)?.click()}
                                                        disabled={uploading === activeSlide}
                                                    >
                                                        {uploading === activeSlide ? <RefreshCw className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
                                                        Загрузить новое
                                                    </Button>
                                                    <p className="text-[10px] text-white/80 font-medium uppercase tracking-widest">1920x1080px • Max 5MB</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 px-1">
                                                <Input
                                                    value={currentSlide?.image || ''}
                                                    readOnly
                                                    className="h-9 text-xs font-mono bg-background/50 border-input/50 rounded-lg text-muted-foreground"
                                                    placeholder="URL изображения..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* TICKER SECTION */}
                {activeSection === 'ticker' && (
                    <motion.div
                        key="ticker"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden max-w-3xl mx-auto">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4 border-b border-border/40 pb-6">
                                    <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 shadow-none">
                                        <Megaphone className="size-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight">Бегущая строка</h2>
                                        <p className="text-sm text-muted-foreground">Настройте текст объявлений в верхней части сайта</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {ticker.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group bg-background p-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-all"
                                        >
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center justify-between">
                                                <span>Фраза {idx + 1} ({lang})</span>
                                                <ArrowRight className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                            </Label>
                                            <Input
                                                value={item[getFieldForLang('text', lang)] || ''}
                                                onChange={(e) => updateTicker(idx, getFieldForLang('text', lang), e.target.value)}
                                                className="h-10 bg-muted/20 border-transparent focus:bg-background focus:border-primary/20 rounded-xl transition-all font-medium"
                                                placeholder="Введите текст..."
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* BENEFITS SECTION */}
                {activeSection === 'benefits' && (
                    <motion.div
                        key="benefits"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4 border-b border-border/40 pb-6">
                                    <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-none">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight">Карточки преимуществ</h2>
                                        <p className="text-sm text-muted-foreground">Ключевые показатели успеха компании</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                                    {benefits.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group bg-background p-5 rounded-2xl border border-border/50 hover:border-primary/30 transition-all relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Sparkles className="size-12 text-primary rotate-12" />
                                            </div>

                                            <div className="flex items-center justify-between mb-4 relative z-10">
                                                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-4 ring-primary/5">
                                                    #{idx + 1}
                                                </div>
                                            </div>

                                            <div className="space-y-4 relative z-10">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Значение (Заголовок)</Label>
                                                    <Input
                                                        value={item[getFieldForLang('title', lang)] || ''}
                                                        onChange={(e) => updateBenefit(idx, getFieldForLang('title', lang), e.target.value)}
                                                        className="h-10 bg-muted/20 border-transparent focus:bg-background focus:border-primary/20 rounded-xl font-bold text-lg tracking-tight"
                                                        placeholder="Напр: 100%"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Описание</Label>
                                                    <Input
                                                        value={item[getFieldForLang('text', lang)] || ''}
                                                        onChange={(e) => updateBenefit(idx, getFieldForLang('text', lang), e.target.value)}
                                                        className="h-10 bg-muted/20 border-transparent focus:bg-background focus:border-primary/20 rounded-xl"
                                                        placeholder="Описание преимущества..."
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* DIFFERENCE SECTION */}
                {activeSection === 'difference' && (
                    <motion.div
                        key="difference"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-wrap justify-center gap-2">
                                {difference.map((_, idx) => (
                                    <div key={idx} className="relative group">
                                        <button
                                            onClick={() => setActiveDiff(idx)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                                activeDiff === idx
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted/20 border-transparent text-muted-foreground hover:border-border"
                                            )}
                                        >
                                            Слайд {idx + 1}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeDifferenceCard(idx); }}
                                            className="absolute -top-2 -right-2 size-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addDifferenceCard}
                                    className="px-4 py-2 rounded-xl text-xs font-bold border-dashed border-primary/40 text-primary"
                                >
                                    <Plus className="size-4 mr-1" />
                                    Добавить
                                </Button>
                            </div>
                        </div>

                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="p-8 space-y-6 lg:border-r border-border/50">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Type className="size-4 text-blue-500" />
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Текстовый контент</h3>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Заголовок ({lang})</Label>
                                                <Input
                                                    value={difference[activeDiff]?.[getFieldForLang('title', lang)] || ''}
                                                    onChange={(e) => updateDifference(activeDiff, getFieldForLang('title', lang), e.target.value)}
                                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Краткое описание ({lang})</Label>
                                                <Input
                                                    value={difference[activeDiff]?.[getFieldForLang('desc', lang)] || ''}
                                                    onChange={(e) => updateDifference(activeDiff, getFieldForLang('desc', lang), e.target.value)}
                                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Полное описание ({lang})</Label>
                                                <Textarea
                                                    value={difference[activeDiff]?.[getFieldForLang('full_text', lang)] || ''}
                                                    onChange={(e) => updateDifference(activeDiff, getFieldForLang('full_text', lang), e.target.value)}
                                                    className="min-h-[120px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-muted/5 flex flex-col justify-between space-y-6">
                                        <div className="space-y-4 h-full flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <ImageIcon className="size-4 text-indigo-500" />
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Изображение</h3>
                                            </div>

                                            <div className="relative group/image flex-1 min-h-[250px] w-full rounded-2xl overflow-hidden border-2 border-dashed border-border/60 bg-muted/10 hover:border-primary/30 transition-all">
                                                <MyImage src={difference[activeDiff]?.image} />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                                    <input
                                                        type="file"
                                                        id={`upload-diff-${activeDiff}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files && handleUpload(activeDiff, e.target.files[0])}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => document.getElementById(`upload-diff-${activeDiff}`)?.click()}
                                                        disabled={uploading === activeDiff}
                                                    >
                                                        {uploading === activeDiff ? <RefreshCw className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
                                                        Загрузить фото
                                                    </Button>
                                                </div>
                                            </div>
                                            <Input
                                                value={difference[activeDiff]?.image || ''}
                                                readOnly
                                                className="h-8 text-[10px] font-mono bg-background/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* EXPERTS SECTION */}
                {activeSection === 'experts' && (
                    <motion.div
                        key="experts"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4 border-b border-border/40 pb-6">
                                    <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-none">
                                        <Type className="size-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight">Заголовки раздела Эксперты</h2>
                                        <p className="text-sm text-muted-foreground">Настройте текстовые блоки для блока специалистов</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Бейдж (верхний заголовок)</Label>
                                        <Input
                                            value={expertsMeta[getFieldForLang('experts_badge', lang)] || ''}
                                            onChange={(e) => updateExpertsMeta(getFieldForLang('experts_badge', lang), e.target.value)}
                                            className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Главный заголовок</Label>
                                        <Input
                                            value={expertsMeta[getFieldForLang('experts_title', lang)] || ''}
                                            onChange={(e) => updateExpertsMeta(getFieldForLang('experts_title', lang), e.target.value)}
                                            className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-full">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Краткое описание (под заголовком)</Label>
                                        <Textarea
                                            value={expertsMeta[getFieldForLang('experts_desc', lang)] || ''}
                                            onChange={(e) => updateExpertsMeta(getFieldForLang('experts_desc', lang), e.target.value)}
                                            className="min-h-[60px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl resize-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-full">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Основной текст</Label>
                                        <Textarea
                                            value={expertsMeta[getFieldForLang('experts_text', lang)] || ''}
                                            onChange={(e) => updateExpertsMeta(getFieldForLang('experts_text', lang), e.target.value)}
                                            className="min-h-[100px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl resize-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Текст кнопки</Label>
                                        <Input
                                            value={expertsMeta[getFieldForLang('experts_btn', lang)] || ''}
                                            onChange={(e) => updateExpertsMeta(getFieldForLang('experts_btn', lang), e.target.value)}
                                            className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-wrap justify-center gap-2">
                                {specialists.map((_, idx) => (
                                    <div key={idx} className="relative group">
                                        <button
                                            onClick={() => setActiveSpec(idx)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                                activeSpec === idx
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted/20 border-transparent text-muted-foreground hover:border-border"
                                            )}
                                        >
                                            Врач {idx + 1}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeSpecialist(idx); }}
                                            className="absolute -top-2 -right-2 size-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addSpecialist}
                                    className="px-4 py-2 rounded-xl text-xs font-bold border-dashed border-primary/40 text-primary"
                                >
                                    <Plus className="size-4 mr-1" />
                                    Добавить врача
                                </Button>
                            </div>
                        </div>

                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="p-8 space-y-6 lg:border-r border-border/50">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <ImageIcon className="size-4 text-primary" />
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Данные специалиста</h3>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Имя специалиста ({lang})</Label>
                                                <Input
                                                    value={specialists[activeSpec]?.[getFieldForLang('name', lang)] || ''}
                                                    onChange={(e) => updateSpecialist(activeSpec, getFieldForLang('name', lang), e.target.value)}
                                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Специализация/Роль ({lang})</Label>
                                                <Input
                                                    value={specialists[activeSpec]?.[getFieldForLang('role', lang)] || ''}
                                                    onChange={(e) => updateSpecialist(activeSpec, getFieldForLang('role', lang), e.target.value)}
                                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Опыт/Доп. инфо ({lang})</Label>
                                                <Input
                                                    value={specialists[activeSpec]?.[getFieldForLang('exp', lang)] || ''}
                                                    onChange={(e) => updateSpecialist(activeSpec, getFieldForLang('exp', lang), e.target.value)}
                                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-muted/5 flex flex-col justify-between space-y-6">
                                        <div className="space-y-4 h-full flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <ImageIcon className="size-4 text-indigo-500" />
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Фото специалиста</h3>
                                            </div>

                                            <div className="relative group/image flex-1 min-h-[250px] w-full rounded-2xl overflow-hidden border-2 border-dashed border-border/60 bg-muted/10 hover:border-primary/30 transition-all">
                                                <MyImage src={specialists[activeSpec]?.image} />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                                    <input
                                                        type="file"
                                                        id={`upload-spec-${activeSpec}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files && handleUpload(activeSpec, e.target.files[0])}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => document.getElementById(`upload-spec-${activeSpec}`)?.click()}
                                                        disabled={uploading === activeSpec}
                                                    >
                                                        {uploading === activeSpec ? <RefreshCw className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
                                                        Загрузить фото
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* REVIEWS SECTION */}
                {activeSection === 'reviews' && (
                    <motion.div
                        key="reviews"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4 border-b border-border/40 pb-6">
                                    <div className="size-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 shadow-none">
                                        <Megaphone className="size-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight">Заголовки раздела Отзывы</h2>
                                        <p className="text-sm text-muted-foreground">Настройте текстовые блоки для блока социальных доказательств</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Бейдж</Label>
                                        <Input
                                            value={reviewsMeta[getFieldForLang('reviews_badge', lang)] || ''}
                                            onChange={(e) => updateReviewsMeta(getFieldForLang('reviews_badge', lang), e.target.value)}
                                            className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Заголовок</Label>
                                        <Input
                                            value={reviewsMeta[getFieldForLang('reviews_title', lang)] || ''}
                                            onChange={(e) => updateReviewsMeta(getFieldForLang('reviews_title', lang), e.target.value)}
                                            className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-full">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Описание</Label>
                                        <Textarea
                                            value={reviewsMeta[getFieldForLang('reviews_desc', lang)] || ''}
                                            onChange={(e) => updateReviewsMeta(getFieldForLang('reviews_desc', lang), e.target.value)}
                                            className="min-h-[60px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-wrap justify-center gap-2">
                                {reviews.map((_, idx) => (
                                    <div key={idx} className="relative group">
                                        <button
                                            onClick={() => setActiveReview(idx)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                                activeReview === idx
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted/20 border-transparent text-muted-foreground hover:border-border"
                                            )}
                                        >
                                            Отзыв {idx + 1}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeReview(idx); }}
                                            className="absolute -top-2 -right-2 size-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addReview}
                                    className="px-4 py-2 rounded-xl text-xs font-bold border-dashed border-primary/40 text-primary"
                                >
                                    <Plus className="size-4 mr-1" />
                                    Добавить отзыв
                                </Button>
                            </div>
                        </div>

                        {reviews[activeReview] && (
                            <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Имя пользователя</Label>
                                            <Input
                                                value={reviews[activeReview].user_name || ''}
                                                onChange={(e) => updateReview(activeReview, 'user_name', e.target.value)}
                                                className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Handle (@username)</Label>
                                            <Input
                                                value={reviews[activeReview].user_handle || ''}
                                                onChange={(e) => updateReview(activeReview, 'user_handle', e.target.value)}
                                                className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Рейтинг (0-5)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="5"
                                                step="0.5"
                                                value={reviews[activeReview].rating || 5}
                                                onChange={(e) => updateReview(activeReview, 'rating', parseFloat(e.target.value))}
                                                className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-full">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Текст отзыва ({lang})</Label>
                                            <Textarea
                                                value={reviews[activeReview][getFieldForLang('text', lang)] || ''}
                                                onChange={(e) => updateReview(activeReview, getFieldForLang('text', lang), e.target.value)}
                                                className="min-h-[100px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                )}

                {/* FAQ SECTION */}
                {activeSection === 'faq' && (
                    <motion.div
                        key="faq"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between border-b border-border/40 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 shadow-none">
                                            <HelpCircle className="size-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight">Частые вопросы (FAQ)</h2>
                                            <p className="text-sm text-muted-foreground">Управление разделом вопросов и ответов</p>
                                        </div>
                                    </div>
                                    <Button onClick={addFaqItem} variant="outline" className="rounded-full gap-2 font-bold px-6 border-primary/20 hover:bg-primary/5 text-primary">
                                        <Plus className="size-4" />
                                        Добавить вопрос
                                    </Button>
                                </div>

                                {/* Main FAQ Titles */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Заголовок раздела</Label>
                                        <Input
                                            value={faqTitles[getFieldForLang('faq_title', lang)] || ''}
                                            onChange={(e) => updateFaqTitles(getFieldForLang('faq_title', lang), e.target.value)}
                                            className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                            placeholder="Частые вопросы..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Подзаголовок раздела</Label>
                                        <Input
                                            value={faqTitles[getFieldForLang('faq_subtitle', lang)] || ''}
                                            onChange={(e) => updateFaqTitles(getFieldForLang('faq_subtitle', lang), e.target.value)}
                                            className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                            placeholder="Описание..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    {faq.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group bg-background/40 p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all space-y-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Вопрос ({lang})</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFaqItem(idx)}
                                                    className="size-8 p-0 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Input
                                                        value={item[getFieldForLang('question', lang)] || ''}
                                                        onChange={(e) => updateFaq(idx, getFieldForLang('question', lang), e.target.value)}
                                                        className="h-11 bg-muted/10 border-transparent focus:bg-background focus:border-primary/20 rounded-xl transition-all font-bold"
                                                        placeholder="Введите вопрос..."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={item[getFieldForLang('answer', lang)] || ''}
                                                        onChange={(e) => updateFaq(idx, getFieldForLang('answer', lang), e.target.value)}
                                                        className="min-h-[80px] bg-muted/10 border-transparent focus:bg-background focus:border-primary/20 rounded-xl resize-none transition-all text-sm"
                                                        placeholder="Введите ответ..."
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Save Button */}
            <motion.div
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/80 p-2 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-full px-8 font-semibold transition-all hover:scale-105 active:scale-95"
                        size="lg"
                    >
                        {saving ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                        Сохранить изменения
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
