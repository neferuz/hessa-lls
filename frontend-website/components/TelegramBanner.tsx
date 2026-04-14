"use client";

import { motion } from "framer-motion";
// Removed unused lucide-react import
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./TelegramBanner.module.css";
import TextReveal from "./ui/TextReveal";

const TRANSLATIONS = {
    tgTitle: {
        RU: "Мы есть в Telegram",
        EN: "We are on Telegram",
        UZ: "Biz Telegramdamiz"
    },
    tgDesc: {
        RU: "Следите за новостями, полезными статьями и эксклюзивными предложениями в нашем боте. Будьте в курсе всех новинок!",
        EN: "Follow the news, useful articles and exclusive offers in our bot. Stay updated with all news!",
        UZ: "Botimizda yangiliklar, foydali maqolalar va eksklyuziv takliflarni kuzatib boring. Yangiliklardan xabardor bo'ling!"
    },
    tgBtn: {
        RU: "Перейти в бот",
        EN: "Go to bot",
        UZ: "Botga o'tish"
    }
};

const TelegramIcon = ({ size = 24, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.2 3.45-.49.34-.93.5-1.33.49-.44-.01-1.29-.25-1.92-.45-.77-.25-1.38-.38-1.33-.8.02-.22.33-.44.91-.68 3.56-1.55 5.92-2.58 7.09-3.07 3.37-1.4 4.07-1.65 4.54-1.66.1 0 .32.02.46.12.12.09.15.22.17.34.02.13.02.32.01.44z" />
    </svg>
);

export default function TelegramBanner() {
    const [lang, setLang] = useState<"RU" | "EN" | "UZ">("RU");

    useEffect(() => {
        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.banner}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className={styles.content}>
                        <div className={styles.text}>
                            <div className={styles.stepTag}>Telegram</div>
                            <TextReveal>
                                <h2 className={styles.title}>{TRANSLATIONS.tgTitle[lang]}</h2>
                            </TextReveal>
                            <p className={styles.desc}>{TRANSLATIONS.tgDesc[lang]}</p>
                            <Link href="https://t.me/hessa_uz" target="_blank" className={styles.button}>
                                <span className={styles.btnText}>{TRANSLATIONS.tgBtn[lang]}</span>
                                <div className={styles.arrowCircle}>
                                    <TelegramIcon size={18} />
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.qrSection}>
                        <div className={styles.qrCard}>
                            <div className={styles.qrHeader}>
                                <span>@hessa_uz</span>
                            </div>
                            <div className={styles.qrImageWrapper}>
                                <Image
                                    src="/qr-code.jpeg"
                                    alt="Telegram QR"
                                    width={160}
                                    height={160}
                                    className={styles.qrImage}
                                />
                            </div>
                            <p className={styles.qrHint}>
                                {lang === 'RU' ? 'Сканируйте QR-код' : lang === 'UZ' ? 'QR-kodni skanerlang' : 'Scan QR code'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
