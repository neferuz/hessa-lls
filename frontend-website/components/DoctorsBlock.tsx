"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./DoctorsBlock.module.css";
import TextReveal from "./ui/TextReveal";

export default function DoctorsBlock() {
    const [lang, setLang] = useState<"RU" | "EN" | "UZ">("RU");
    const [specialists, setSpecialists] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>({});

    const API_BASE_URL = "http://127.0.0.1:8000";

    const getImageUrlLocal = (img: any) => {
        let url = img;
        if (typeof img === 'string' && img.startsWith('[')) {
            try { url = JSON.parse(img)[0]; } catch (e) { url = img; }
        } else if (Array.isArray(img)) {
            url = img[0];
        }

        if (!url) return "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=400&auto=format&fit=crop";
        
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
        const fetchContent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/content`);
                const data = await res.json();
                if (data.specialists) setSpecialists(data.specialists);
                setMeta({
                    badge: data.experts_badge,
                    badge_uz: data.experts_badge_uz,
                    badge_en: data.experts_badge_en,
                    title: data.experts_title,
                    title_uz: data.experts_title_uz,
                    title_en: data.experts_title_en,
                    desc: data.experts_desc,
                    desc_uz: data.experts_desc_uz,
                    desc_en: data.experts_desc_en,
                    text: data.experts_text,
                    text_uz: data.experts_text_uz,
                    text_en: data.experts_text_en,
                    btn: data.experts_btn,
                    btn_uz: data.experts_btn_uz,
                    btn_en: data.experts_btn_en,
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchContent();

        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const getText = (obj: any, base: string) => {
        if (!obj) return "";
        if (lang === 'RU') return obj[base] || "";
        const key = `${base}_${lang.toLowerCase()}`;
        return obj[key] || obj[base] || "";
    };

    if (specialists.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.layout}>

                    {/* Left Column: Text */}
                    <div className={styles.textContent}>
                        <motion.div
                            className={styles.stepTag}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {getText(meta, 'badge')}
                        </motion.div>
                        <TextReveal>
                            <h2 className={styles.title}>{getText(meta, 'title')}</h2>
                        </TextReveal>
                        <motion.p
                            className={styles.desc}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            {getText(meta, 'desc')}
                        </motion.p>

                        <motion.p
                            className={styles.extra}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {getText(meta, 'text')}
                        </motion.p>


                    </div>

                    {/* Right Column: Doctors */}
                    <div className={styles.doctorsVisual}>
                        {specialists.map((doc, idx) => (
                            <motion.div
                                key={doc.id}
                                className={`${styles.card} ${idx % 2 === 1 ? styles.cardStagger : ''}`}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.7, delay: 0.3 + (idx * 0.2) }}
                            >
                                <div className={styles.imageCard}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={getImageUrlLocal(doc.image)}
                                            alt={getText(doc, 'name')}
                                            fill
                                            className={styles.image}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                    <div className={styles.badgeOverlay}>
                                        <span className={styles.expTag}>{getText(doc, 'exp')}</span>
                                    </div>
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.infoText}>
                                        <h3 className={styles.name}>{getText(doc, 'name')}</h3>
                                        <p className={styles.role}>{getText(doc, 'role')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
