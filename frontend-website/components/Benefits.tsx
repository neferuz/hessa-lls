"use client";

import { motion, useSpring, useTransform, useMotionValue, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import styles from "./Benefits.module.css";

// Helper component to animate numbers within a string
function AnimatedCounter({ text }: { text: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    
    // Extract numbers and non-numbers from the string
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
        // Format with spaces for 10 000 style
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

export default function Benefits() {
    const [benefits, setBenefits] = useState<any[]>([]);
    const [lang, setLang] = useState("RU");

    const MOCK_BENEFITS = [
        {
            title: "3+ года",
            title_en: "3+ years",
            title_uz: "3+ yil",
            text: "Своё производство в Ташкенте",
            text_en: "Our own production in Tashkent",
            text_uz: "Toshkentda o'z ishlab chiqarishimiz"
        },
        {
            title: "10 000 +",
            title_en: "10,000 +",
            title_uz: "10 000 +",
            text: "Клиентов доверяют HESSA",
            text_en: "Clients trust HESSA",
            text_uz: "Mijozlar HESSAga ishonishadi"
        },
        {
            title: "Сертификация",
            title_en: "Certification",
            title_uz: "Sertifikatlash",
            text: "Проверенное сырьё",
            text_en: "Proven raw materials",
            text_uz: "Tekshirilgan homashyo"
        },
        {
            title: "60+",
            title_en: "60+",
            title_uz: "60+",
            text: "Витаминных комплексов",
            text_en: "Vitamin complexes",
            text_uz: "Vitamin komplekslari"
        }
    ];

    useEffect(() => {
        // Fetch Content
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                if (data.benefits && data.benefits.length > 0) {
                    setBenefits(data.benefits);
                } else {
                    setBenefits(MOCK_BENEFITS);
                }
            } catch (err) {
                console.error(err);
                setBenefits(MOCK_BENEFITS);
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

    const displayBenefits = benefits.length > 0 ? benefits : MOCK_BENEFITS;

    return (
        <section className={styles.benefitsSection}>
            <div className={styles.benefitsContainer}>
                {displayBenefits.map((benefit, idx) => (
                    <motion.div
                        key={idx}
                        className={styles.benefitCard}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                    >
                        <div className={styles.cardInner}>
                            <h3 className={styles.benefitTitle}>
                                <AnimatedCounter text={getText(benefit, 'title')} />
                            </h3>
                            <p className={styles.benefitText}>{getText(benefit, 'text')}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
