"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Gavel } from "lucide-react";
import styles from "../legal.module.css";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function OfferPage() {
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

    const content: any = {
        RU: {
            title: "Публичная оферта",
            updated: "Обновлено: 15 марта 2024 г.",
            sections: [
                {
                    title: "Определение оферты",
                    text: "Настоящий документ является публичной офертой Продавца ООО «HESSA» и содержит все существенные условия договора купли-продажи товаров дистанционным способом."
                },
                {
                    title: "Акцепт оферты",
                    text: "Оформление заказа Пользователем на Сайте является полным и безоговорочным акцептом (принятием) условий данной оферты. С момента акцепта договор считается заключенным."
                },
                {
                    title: "Цены и доставка",
                    text: "Цены на товары указаны в карточках товаров и включают все применимые налоги. Стоимость доставки рассчитывается отдельно и указывается при подтверждении заказа."
                },
                {
                    title: "Возврат и обмен",
                    text: "Возврат и обмен товаров осуществляется в соответствии с законодательством Республики Узбекистан. Пожалуйста, сохраняйте чек и целостность упаковки для совершения возврата."
                }
            ]
        },
        UZ: {
            title: "Ommaviy oferta",
            updated: "Yangilandi: 15 mart 2024 y.",
            sections: [
                {
                    title: "Oferta ta'rifi",
                    text: "Ushbu hujjat «HESSA» MChJ Sotuvchisining ommaviy ofertasi bo'lib, tovarlarni masofadan turib sotib olish-sotish shartnomasining barcha muhim shartlarini o'z ichiga oladi."
                }
            ]
        },
        EN: {
            title: "Public Offer",
            updated: "Last Updated: March 15, 2024",
            sections: [
                {
                    title: "Offer Definition",
                    text: "This document is a public offer of HESSA LLC and contains all essential terms of the agreement for remote sale of goods."
                }
            ]
        }
    };

    const t = content[lang] || content.RU;

    return (
        <>
            <main className={styles.legalWrapper}>
                <div className={styles.container}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link href="/" className={styles.breadcrumb}>
                            <ChevronLeft size={16} /> На главную
                        </Link>
                    </motion.div>

                    <motion.h1 
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t.title}
                    </motion.h1>

                    <motion.div 
                        className={styles.content}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className={styles.lastUpdated}>{t.updated}</span>

                        <div className={styles.sections}>
                            {t.sections.map((section: any, idx: number) => (
                                <div key={idx} className={styles.section}>
                                    <h2 className={styles.sectionTitle}>
                                        <span className={styles.sectionNumber}>0{idx + 1}</span>
                                        {section.title}
                                    </h2>
                                    <p className={styles.text}>{section.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
