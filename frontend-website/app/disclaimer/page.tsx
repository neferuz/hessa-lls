"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import styles from "../legal.module.css";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function DisclaimerPage() {
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
            title: "Отказ от ответственности",
            updated: "Обновлено: 15 марта 2024 г.",
            sections: [
                {
                    title: "Не является лекарственным средством",
                    text: "Продукция HESSA, представленная на данном Сайте, не является лекарственными средствами. Информация о продуктах не предназначена для диагностики, лечения или профилактики заболеваний."
                },
                {
                    title: "Консультация врача",
                    text: "Перед началом приема любых биологически активных добавок, витаминов или изменением режима питания мы настоятельно рекомендуем проконсультироваться с квалифицированным медицинским специалистом. Это особенно важно, если вы беременны, кормите грудью, принимаете лекарства или имеете хронические заболевания."
                },
                {
                    title: "Индивидуальные результаты",
                    text: "Результаты использования продуктов HESSA могут варьироваться в зависимости от индивидуальных особенностей организма, состояния здоровья, возраста и образа жизни."
                },
                {
                    title: "Отсутствие медицинских услуг",
                    text: "Hessa не осуществляет медицинскую деятельность и не оказывает медицинские услуги пользователям. Любая информация на Сайте носит ознакомительный характер и не может заменить очную консультацию врача."
                }
            ]
        },
        UZ: {
            title: "Mas'uliyatni rad etish",
            updated: "Yangilandi: 15 mart 2024 y.",
            sections: [
                {
                    title: "Dori vositasi emas",
                    text: "Ushbu Saytda taqdim etilgan HESSA mahsulotlari dori vositasi hisoblanmaydi. Mahsulotlar haqidagi ma'lumotlar kasalliklarni tashxislash, davolash yoki oldini olish uchun mo'ljallanmagan."
                },
                {
                    title: "Shifokor maslahati",
                    text: "Har qanday biologik faol qo'shimchalar, vitaminlarni qabul qilishdan yoki ovqatlanish rejimini o'zgartirishdan oldin malakali tibbiyot mutaxassisi bilan maslahatlashishni tavsiya qilamiz."
                }
            ]
        },
        EN: {
            title: "Medical Disclaimer",
            updated: "Last Updated: March 15, 2024",
            sections: [
                {
                    title: "Not a Medical Product",
                    text: "HESSA products presented on this Site are not medical drugs. Information about products is not intended for diagnosis, treatment, or prevention of any disease."
                },
                {
                    title: "Doctor's Consultation",
                    text: "We strongly recommend consulting with a qualified healthcare professional before taking any dietary supplements, vitamins, or changing your diet."
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
