"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./DifferenceCarousel.module.css";


export default function DifferenceCarousel() {
    const [originalItems, setOriginalItems] = useState<any[]>([]);
    const [sliderWidth, setSliderWidth] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [lang, setLang] = useState("RU");
    const [isPaused, setIsPaused] = useState(false);

    const API_BASE_URL = "https://api.hessa.uz";

    const getImageUrl = (img: any) => {
        let url = img;
        if (typeof img === 'string' && img.startsWith('[')) {
            try { url = JSON.parse(img)[0]; } catch (e) { url = img; }
        } else if (Array.isArray(img)) {
            url = img[0];
        }

        if (!url) return "/static/vitamins-1.png";
        
        // Protocol guard
        if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:'))) {
            return url;
        }
        
        let cleanUrl = url.startsWith('/') ? url : `/${url}`;
        if (!cleanUrl.startsWith('/static/') && !cleanUrl.startsWith('/images/')) {
            cleanUrl = `/static${cleanUrl}`;
        }
        return cleanUrl;
    };

    useEffect(() => {
        // Fetch Content
        const fetchContent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/content`);
                const data = await res.json();
                if (data.difference && data.difference.length > 0) {
                    setOriginalItems(data.difference);
                } else {
                    setOriginalItems([]);
                }
            } catch (err) {
                console.error("DifferenceCarousel fetch error:", err);
            }
        };
        fetchContent();

        // Lang Listener
        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const getText = (item: any, field: string) => {
        if (lang === 'RU') return item[field];
        return item[`${field}_${lang.toLowerCase()}`] || item[field];
    };

    // Card Width logic with fallbacks
    const getCardStep = useCallback(() => {
        if (sliderWidth > 0 && originalItems.length > 0) {
            return sliderWidth / originalItems.length;
        }
        // Fallbacks based on media queries
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) return 264; // 240 + 24
            if (window.innerWidth <= 1024) return 284; // 260 + 24
        }
        return 324; // 300 + 24
    }, [sliderWidth, originalItems.length]);

    // Calculate effective width for one set of items
    useEffect(() => {
        const updateWidth = () => {
            if (sliderRef.current && originalItems.length > 0) {
                const firstCard = sliderRef.current.querySelector(`.${styles.card}`);
                if (firstCard) {
                    const rect = firstCard.getBoundingClientRect();
                    const gap = 24; // 1.5rem gap
                    const fullWidth = (rect.width + gap) * originalItems.length;
                    setSliderWidth(fullWidth);
                    // Reset to middle set if we are at 0
                    if (x.get() === 0) {
                        x.set(-fullWidth);
                    }
                }
            }
        };

        const timer = setTimeout(updateWidth, 100);
        window.addEventListener("resize", updateWidth);
        return () => {
            window.removeEventListener("resize", updateWidth);
            clearTimeout(timer);
        };
    }, [originalItems]);

    // Infinite Loop reset
    useEffect(() => {
        const unsubscribe = x.on("change", (latest) => {
            if (sliderWidth === 0) return;
            
            // Boundary detection
            if (latest <= -2 * sliderWidth) {
                x.set(latest + sliderWidth);
            } else if (latest >= -0.1 * sliderWidth) {
                x.set(latest - sliderWidth);
            }
        });
        return () => unsubscribe();
    }, [sliderWidth]);

    const slideLeft = () => {
        const step = getCardStep();
        const current = x.get();
        animate(x, current + step, { duration: 1, ease: [0.16, 1, 0.3, 1] });
    };

    const slideRight = () => {
        const step = getCardStep();
        const current = x.get();
        animate(x, current - step, { duration: 1, ease: [0.16, 1, 0.3, 1] });
    };

    // Autoplay
    useEffect(() => {
        if (originalItems.length === 0 || isPaused) return;
        
        const interval = setInterval(() => {
            // Only trigger if we aren't already animating
            slideRight();
        }, 2000);
        
        return () => clearInterval(interval);
    }, [originalItems.length, sliderWidth, isPaused, getCardStep]);

    if (originalItems.length === 0) return null;

    // Triple the items for seamless infinite scroll
    const displayItems = [...originalItems, ...originalItems, ...originalItems];

    return (
        <section 
            className={styles.carouselSection}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.headerRow}>
                    <div className={styles.titleWrapper}>
                        <h2 className={styles.title}>
                            {lang === 'UZ' ? "O'zingizning eng yaxshi versiyangiz sari 30 kun" :
                                lang === 'EN' ? "30 days to the best version of yourself" :
                                    "30 дней до лучшей версии себя"}
                        </h2>
                    </div>
                    <div className={styles.controls}>
                        <button className={styles.controlBtn} onClick={slideLeft} aria-label="Previous">
                            <ArrowLeft size={20} />
                        </button>
                        <button className={styles.controlBtn} onClick={slideRight} aria-label="Next">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Slider */}
                <div className={styles.sliderWindow}>
                    <motion.div
                        className={styles.sliderTrack}
                        ref={sliderRef}
                        drag="x"
                        dragConstraints={{ left: -3 * sliderWidth, right: 0 }}
                        style={{ x }}
                    >
                        {displayItems.map((item, idx) => (
                            <Link href="/quiz" key={`${item.id}-${idx}`} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={getImageUrl(item.image)}
                                        alt={getText(item, 'title')}
                                        fill
                                        className={styles.cardImage}
                                        draggable={false}
                                        sizes="(max-width: 768px) 240px, 300px"
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>{getText(item, 'title')}</h3>
                                        <div className={styles.cardIcon}>
                                            <ArrowUpRight size={24} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <p className={styles.cardDesc}>{getText(item, 'desc')}</p>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
