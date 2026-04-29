"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import styles from "../legal.module.css";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
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
            title: "Политика конфиденциальности",
            updated: "Обновлено: 15 марта 2024 г.",
            sections: [
                {
                    title: "Сбор данных",
                    text: "Мы собираем только ту информацию, которая необходима для обработки ваших заказов и предоставления качественного сервиса: ваше имя, номер телефона, адрес доставки и историю покупок."
                },
                {
                    title: "Использование данных",
                    text: "Ваши данные используются исключительно для: обработки и доставки заказов, связи с вами по вопросам покупок, информирования о статусе заказа и предоставления персональных рекомендаций."
                },
                {
                    title: "Защита данных",
                    text: "Мы применяем современные методы шифрования и безопасности для защиты вашей персональной информации от несанкционированного доступа. Доступ к вашим данным имеют только авторизованные сотрудники."
                },
                {
                    title: "Куки (Cookies)",
                    text: "Сайт использует куки для улучшения пользовательского опыта, анализа трафика и персонализации контента. Вы можете отключить их в настройках браузера, но это может повлиять на функциональность сайта."
                }
            ]
        },
        UZ: {
            title: "Maxfiylik siyosati",
            updated: "Yangilandi: 15 mart 2024 y.",
            sections: [
                {
                    title: "Ma'lumotlar to'plami",
                    text: "Biz faqat buyurtmalaringizni qayta ishlash va sifatli xizmat ko'rsatish uchun zarur bo'lgan ma'lumotlarni to'playmiz: ismingiz, telefon raqamingiz, yetkazib berish manzili va xaridlar tarixi."
                }
            ]
        },
        EN: {
            title: "Privacy Policy",
            updated: "Last Updated: March 15, 2024",
            sections: [
                {
                    title: "Data Collection",
                    text: "We collect only the information necessary for processing your orders and providing quality service: your name, phone number, delivery address, and purchase history."
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
