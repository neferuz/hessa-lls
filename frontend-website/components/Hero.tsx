"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import styles from "./Hero.module.css";
import TextReveal from "./ui/TextReveal";

export default function Hero() {
    const [slides, setSlides] = useState<any[]>([]);
    const [tickerItems, setTickerItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [lang, setLang] = useState("RU");

    // Premium Static Mock Data to guarantee layout consistency
    const MOCK_SLIDES = [
        {
            id: 1,
            headline: "Баланс & Здоровье",
            headline_en: "Balance & Health",
            headline_uz: "Balans va Sog'liq",
            descriptionLeft: "Откройте для себя нашу новую коллекцию премиальных добавок, разработанных для поддержания вашего иммунитета и возвращения энергии на каждый день.",
            descriptionLeft_en: "Discover our new collection of premium supplements designed to support your immunity and bring back everyday energy.",
            descriptionLeft_uz: "Immunitetingizni qo'llab-quvvatlash va har kungi energiyani qaytarish uchun yaratilgan yangi premium qo'shimchalar to'plamini kashf eting.",
            buttonText: "Подобрать курс",
            buttonText_en: "Get Your Plan",
            buttonText_uz: "Kursni tanlash",
            image: "https://images.unsplash.com/photo-1615486511484-92e172cb4fa0?auto=format&fit=crop&q=80&w=1400"
        },
        {
            id: 2,
            headline: "Чистота природы",
            headline_en: "Purity of Nature",
            headline_uz: "Tabiat tozaligi",
            descriptionLeft: "Создано из 100% органических ингредиентов высочайшего качества. Протестировано экспертами для вашей уверенности.",
            descriptionLeft_en: "Created from 100% highest quality organic ingredients. Expertly tested for your confidence.",
            descriptionLeft_uz: "Eng yuqori sifatli 100% organik ingredientlardan yaratilgan. Sizning ishonchingiz uchun экспертлар томонидан синовдан ўтган.",
            buttonText: "Подобрать курс",
            buttonText_en: "Get Your Plan",
            buttonText_uz: "Kursni tanlash",
            image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=1400"
        }
    ];

    // Fetch Slides and Ticker
    useEffect(() => {
        const fetchData = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
            try {
                const [resHero, resContent] = await Promise.all([
                    fetch('/api/hero', {
                        cache: 'no-store',
                        signal: controller.signal
                    }),
                    fetch('/api/content', {
                        cache: 'no-store',
                        signal: controller.signal
                    })
                ]);
                
                clearTimeout(timeoutId);
                
                const dataHero = await resHero.json();
                if (dataHero && dataHero.slides && dataHero.slides.length > 0) {
                    setSlides(dataHero.slides);
                } else {
                    setSlides(MOCK_SLIDES);
                }

                const dataContent = await resContent.json();
                if (dataContent && dataContent.ticker) {
                    setTickerItems(dataContent.ticker);
                }
            } catch (err) {
                console.error("Failed to fetch hero/content data.", err);
                setSlides(MOCK_SLIDES);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const nextSlide = () => {
        if (slides.length === 0) return;
        setDirection(1);
        setIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        if (slides.length === 0) return;
        setDirection(-1);
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const current = slides.length > 0 ? slides[index] : null;

    const getImageUrl = (img: any) => {
        let url = img;
        if (!url) return "/static/vitamins-1.png";
        if (typeof url !== 'string') return "/static/vitamins-1.png";
        
        // Protocol guard: don't prefix absolute URLs
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:')) {
            return url;
        }
        
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return cleanUrl;
    };

    const getText = (base: string, l: string) => {
        if (!current) return "";
        if (base === 'buttonText' && !current[base]) {
            return l === 'EN' ? 'Get Your Plan' : l === 'UZ' ? 'Kursni tanlash' : 'Подобрать курс';
        }
        
        const langKey = l === 'RU' ? base : `${base}_${l.toLowerCase()}`;
        return current[langKey] || current[base] || "";
    };

    const getTickerText = (item: any) => {
        if (lang === 'RU') return item.text;
        return item[`text_${lang.toLowerCase()}`] || item.text;
    };

    // Auto-play
    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [index, slides.length]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
    );

    if (!current) return null;

    const slideVariants: Variants = {
        enter: (direction: number) => ({
            opacity: 0,
            scale: 1.05,
        }),
        center: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
            },
        },
        exit: (direction: number) => ({
            opacity: 0,
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            },
        }),
    };

    return (
        <div className={styles.heroWrapper}>
            <div className={styles.contentGrid}>
                {/* LEFT COLUMN: TEXT CONTENT */}
                <div className={styles.leftCol}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={styles.textContentInner}
                        >
                            <span className={styles.subtitle}>
                                HESSA EXCLUSIVE
                            </span>

                            <h1 className={styles.bigHeading}>
                                {getText('headline', lang)}
                            </h1>

                            <p className={styles.descText}>
                                {getText('descriptionLeft', lang)}
                            </p>
                            
                            {/* Desktop Button - Hidden on mobile via CSS */}
                            <div className={styles.desktopBtn}>
                                <Link href="/quiz">
                                    <button className={styles.primaryBtn}>
                                        {getText('buttonText', lang)}
                                        <div className={styles.arrowCircle}><ChevronRight size={22} strokeWidth={2.5} /></div>
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: PRODUCT IMAGE */}
                <div className={styles.rightCol}>
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={current.id}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className={styles.productContainer}
                        >
                            <Image
                                src={getImageUrl(current.image)}
                                alt="Product"
                                fill
                                className={styles.productImg}
                                priority
                                sizes="50vw"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== '/static/vitamins-1.png') {
                                        target.src = '/static/vitamins-1.png';
                                    }
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Overlay Navigation */}
                    <div className={styles.navOverlay}>
                        <div className={styles.navProgress}>
                            <span className={styles.progressLabel}>0{index + 1}</span>
                            <div className={styles.progressBar}>
                                <motion.div
                                    key={index}
                                    className={styles.progressFill}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 6, ease: "linear" }}
                                />
                            </div>
                            <span className={styles.progressLabel}>0{slides.length}</span>
                        </div>

                        <div className={styles.navArrows}>
                            <button onClick={prevSlide} className={styles.navBtn} aria-label="Previous slide">
                                <ArrowLeft size={18} />
                            </button>
                            <button onClick={nextSlide} className={styles.navBtn} aria-label="Next slide">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE BUTTON WRAPPER: Visible only on mobile */}
                <div className={styles.mobileBtnCol}>
                    <Link href="/quiz" className="w-full">
                        <button className={styles.primaryBtn}>
                            {getText('buttonText', lang)}
                            <div className={styles.arrowCircle}><ChevronRight size={22} strokeWidth={2.5} /></div>
                        </button>
                    </Link>
                </div>
            </div>

            {/* IN-HERO TICKER CAROUSEL (BOTTOM) */}
            {tickerItems.length > 0 && (
                <div className={styles.heroTicker}>
                    <div className={styles.tickerTrack}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={styles.tickerGroup}>
                                {tickerItems.map((item, idx) => (
                                    <span key={idx} className={styles.tickerItem}>
                                        {getTickerText(item)}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div >
    );
}
