"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import styles from "../legal.module.css";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function TermsPage() {
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
            title: "Пользовательское соглашение",
            updated: "Обновлено: 15 марта 2024 г.",
            sections: [
                {
                    title: "Согласие с условиями",
                    text: "Использование Сайта означает полное и безоговорочное согласие Пользователя с настоящим Соглашением. Если вы не согласны с условиями, пожалуйста, воздержитесь от использования ресурсов Сайта."
                },
                {
                    title: "Использование аккаунта",
                    text: "Для оформления заказов и доступа к персональным рекомендациям требуется авторизация по номеру телефона. Пользователь несет ответственность за безопасность своего доступа и достоверность предоставленных данных."
                },
                {
                    title: "Заказы и оплата",
                    text: "Все заказы оформляются через корзину или квиз на Сайте. Оплата производится на условиях, указанных при оформлении. Продавец имеет право изменять цены, информируя об этом на Сайте."
                },
                {
                    title: "Интеллектуальная собственность",
                    text: "Все материалы Сайта, включая тексты, изображения и дизайн, являются собственностью HESSA. Копирование и использование материалов без письменного согласия запрещено."
                }
            ]
        },
        UZ: {
            title: "Foydalanuvchi shartnomasi",
            updated: "Yangilandi: 15 mart 2024 y.",
            sections: [
                {
                    title: "Shartlarga rozilik",
                    text: "Saytdan foydalanish Foydalanuvchining ushbu Shartnomaga to'liq va so'zsiz roziligini bildiradi."
                }
            ]
        },
        EN: {
            title: "Terms of Use",
            updated: "Last Updated: March 15, 2024",
            sections: [
                {
                    title: "Agreement to Terms",
                    text: "Using the Site means the User's full and unconditional consent with this Agreement."
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
