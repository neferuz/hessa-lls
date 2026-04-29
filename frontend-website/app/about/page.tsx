"use client";

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { Shield, Zap, Microscope, ChevronRight } from "lucide-react";
import TickerBanner from "@/components/TickerBanner";
import DoctorsBlock from "@/components/DoctorsBlock";
import ReviewsBlock from "@/components/ReviewsBlock";
import TelegramBanner from "@/components/TelegramBanner";
import LegalTicker from "@/components/LegalTicker";
import Footer from "@/components/Footer";
import styles from "./About.module.css";
import { useState, useEffect, useRef, ReactNode } from "react";

// Premium RevealSection for sections appearance
const RevealSection = ({ children }: { children: ReactNode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

const iconMap: Record<string, React.ReactNode> = {
    "Shield": <Shield size={28} strokeWidth={1.5} />,
    "Microscope": <Microscope size={28} strokeWidth={1.5} />,
    "Zap": <Zap size={28} strokeWidth={1.5} />
};

// Helper component to animate numbers within a string (consistent with Benefits.tsx)
function AnimatedCounter({ text }: { text: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    
    const match = text.match(/(\d+[\s\d]*)/);
    if (!match) return <span>{text}</span>;
    
    const numberStr = match[0].replace(/\s/g, '');
    const targetNumber = parseInt(numberStr, 10);
    const prefix = text.substring(0, match.index);
    const suffix = text.substring((match.index || 0) + match[0].length);
    
    const count = useMotionValue(0);
    const springValue = useSpring(count, {
        stiffness: 60,
        damping: 30,
        restDelta: 0.001
    });

    const displayValue = useTransform(springValue, (latest) => {
        const num = Math.round(latest);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    });

    useEffect(() => {
        if (isInView) {
            count.set(targetNumber);
        }
    }, [isInView, count, targetNumber]);

    return (
        <span ref={ref}>
            {prefix}
            <motion.span>{displayValue}</motion.span>
            {suffix}
        </span>
    );
}

export default function AboutPage() {
    const [data, setData] = useState<any>(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 500]);

    const [lang, setLang] = useState("RU");

    useEffect(() => {
        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    useEffect(() => {
        fetch('/api/about')
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    const resolveImageUrl = (path: string) => {
        if (!path) return "/static/vitamins-1.png";
        if (typeof path !== 'string') return "/static/vitamins-1.png";
        
        // Protocol guard
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//') || path.startsWith('data:')) {
            return path;
        }
        
        const cleanUrl = path.startsWith('/') ? path : `/${path}`;
        return cleanUrl;
    };

    const getLangText = (obj: any, base: string) => {
        if (!obj) return "";
        // window.currentLang is updated by Navbar. We use state 'lang' for re-rendering.
        if (lang === 'RU') return obj[base];
        return obj[`${base}_${lang.toLowerCase()}`] || obj[base];
    };

    if (!data) return null;

    return (
        <div ref={containerRef} className={styles.pageWrapper}>
            <main className={styles.aboutContainer}>

                {/* 1. HERO SECTION */}
                <section className={styles.heroWrapper}>
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1
                            className={styles.bigHeading}
                            dangerouslySetInnerHTML={{ __html: getLangText(data.hero, 'heading') }}
                        />
                    </motion.div>

                    <div className={styles.contentGrid}>
                        <motion.div
                            className={styles.leftCol}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className={styles.descText}>
                                {getLangText(data.hero, 'desc_left')}
                            </p>
                            <button className={styles.primaryBtn}>
                                Каталог <div className={styles.arrowCircle}><ChevronRight size={22} strokeWidth={2.5} /></div>
                            </button>
                        </motion.div>

                        <motion.div
                            className={styles.centerCol}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className={styles.productContainer}>
                                <Image
                                    src={resolveImageUrl(data.hero.image)}
                                    alt="HESSA About"
                                    fill
                                    className={styles.productImg}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            className={styles.rightCol}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <p className={styles.descText}>
                                {getLangText(data.hero, 'desc_right')}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 2. TICKER BANNER */}
                <TickerBanner />

                {/* 3. BENEFITS SECTION */}
                <section className={styles.benefitsSection}>
                    <motion.div
                        className={styles.benefitsContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {data.metrics && data.metrics.map((m: any) => (
                            <MetricCard key={m.id} title={m.title} text={m.text} />
                        ))}
                    </motion.div>
                </section>

                {/* 4. VALUES GRID */}
                <section className={styles.valuesSection}>
                    <div className={styles.container}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Наши принципы</h2>
                        </div>

                        <RevealSection>
                            <motion.div
                                className={styles.valuesGrid}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={stagger}
                            >
                                {data.values && data.values.map((v: any) => (
                                    <ValueCard
                                        key={v.id}
                                        icon={iconMap[v.icon] || <Shield size={28} strokeWidth={1.5} />}
                                        title={v.title}
                                        desc={v.desc}
                                    />
                                ))}
                            </motion.div>
                        </RevealSection>
                    </div>
                </section>

                <RevealSection><DoctorsBlock /></RevealSection>
                <RevealSection><ReviewsBlock /></RevealSection>
                <RevealSection><TelegramBanner /></RevealSection>
                <LegalTicker />
                <Footer />
            </main>
        </div>
    );
}

function MetricCard({ title, text }: { title: string, text: string }) {
    return (
        <motion.div className={styles.benefitCard} variants={fadeUp}>
            <h3 className={styles.benefitTitle}>
                <AnimatedCounter text={title} />
            </h3>
            <p className={styles.benefitText}>{text}</p>
        </motion.div>
    );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <motion.div className={styles.card} variants={fadeUp}>
            <div className={styles.cardIcon}>{icon}</div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDesc}>{desc}</p>
        </motion.div>
    );
}

