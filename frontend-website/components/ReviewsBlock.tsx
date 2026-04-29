"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle } from "lucide-react";
import styles from "./ReviewsBlock.module.css";
import TextReveal from "./ui/TextReveal";

export default function ReviewsBlock() {
    const [lang, setLang] = useState<"RU" | "EN" | "UZ">("RU");
    const [reviews, setReviews] = useState<any[]>([
        {
            id: 'm1',
            user_name: "Мария С.",
            user_handle: "@maria_s",
            rating: 5.0,
            text: "Очень понравился подход к анализам на дому. Все быстро и без очередей. Самочувствие топ!",
            text_uz: "Uyda tahlil qilish yondashuvi juda yoqdi. Hammasi tez va navbatlarsiz. O'zimni juda yaxshi his qilyapman!",
            text_en: "I really liked the approach to home tests. Everything is fast and without queues. Feeling top!"
        },
        {
            id: 'm2',
            user_name: "Елена В.",
            user_handle: "@elenav_28",
            rating: 5.0,
            text: "Качество витаминов на высоте, волосы перестали выпадать. Спасибо команде HESSA!",
            text_uz: "Vitaminlar sifati a'lo darajada, sochlarim to'kilishdan to'xtadi. HESSA jamoasiga rahmat!",
            text_en: "The quality of vitamins is at its best, my hair stopped falling out. Thanks to the HESSA team!"
        },
        {
            id: 'm3',
            user_name: "Александр К.",
            user_handle: "@alex_k",
            rating: 5.0,
            text: "HESSA помогли подобрать именно те витамины, которых мне не хватало. Энергия вернулась!",
            text_uz: "HESSA manga kerakli vitaminlarni tanlashda yordam berdi. Energiya qaytdi!",
            text_en: "HESSA helped pick exactly the vitamins I was missing. Energy is back!"
        }
    ]);
    const [meta, setMeta] = useState<any>({
        badge: "Нам доверяют",
        badge_uz: "Bizga ishonishadi",
        badge_en: "They trust us",
        title: "Люди выбирают HESSA",
        title_uz: "Odamlar HESSA ni tanlashadi",
        title_en: "People choose HESSA",
        desc: "Реальные отзывы клиентов, которые уже улучшили своё самочувствие вместе с нами.",
        desc_uz: "Biz bilan o'z sog'lig'ini yaxshilagan mijozlarning haqiqiy fikrlari.",
        desc_en: "Real reviews from customers who have already improved their well-being with us.",
    });

    const API_BASE_URL = "https://api.hessa.uz";

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/content`);
                const data = await res.json();
                if (data.reviews_list) setReviews(data.reviews_list);
                setMeta({
                    badge: data.reviews_badge,
                    badge_uz: data.reviews_badge_uz,
                    badge_en: data.reviews_badge_en,
                    title: data.reviews_title,
                    title_uz: data.reviews_title_uz,
                    title_en: data.reviews_title_en,
                    desc: data.reviews_desc,
                    desc_uz: data.reviews_desc_uz,
                    desc_en: data.reviews_desc_en,
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

    if (reviews.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.stepTag}>{getText(meta, 'badge')}</div>
                    <TextReveal>
                        <h2 className={styles.title}>{getText(meta, 'title')}</h2>
                    </TextReveal>
                    <p className={styles.desc}>{getText(meta, 'desc')}</p>
                </div>

                <div className={styles.marqueeWrapper}>
                    <div className={styles.marqueeTrack}>
                        {/* Render the reviews multiple times to create an infinite seamless loop */}
                        {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
                            <div key={`${review.id}-${idx}`} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {(review.user_name || "U").charAt(0)}
                                        </div>
                                        <div className={styles.userDetails}>
                                            <div className={styles.nameRow}>
                                                <span className={styles.userName}>{review.user_name}</span>
                                                <CheckCircle size={14} className={styles.verifiedIcon} />
                                            </div>
                                            <span className={styles.userTag}>{review.user_handle}</span>
                                        </div>
                                    </div>
                                    <div className={styles.ratingBox}>
                                        <Star size={12} fill="currentColor" />
                                        <span className={styles.ratingValue}>{review.rating?.toFixed(1) || "5.0"}</span>
                                    </div>
                                </div>

                                <p className={styles.reviewText}>
                                    {getText(review, 'text')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
