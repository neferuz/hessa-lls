"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Send } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    const [footer, setFooter] = useState<any>(null);
    const [lang, setLang] = useState("RU");

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const res = await fetch(`/api/content?t=${Date.now()}`, {
                    cache: 'no-store'
                });
                const data = await res.json();
                console.log("Footer data received:", data.footer);
                if (data.footer) setFooter(data.footer);
            } catch (err) {
                console.error("Footer fetch error:", err);
            }
        };
        fetchFooter();

        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const getTranslated = (baseField: string) => {
        if (!footer) return "";
        if (lang === 'RU') return footer[baseField];
        return footer[`${baseField}_${lang.toLowerCase()}`] || footer[baseField];
    };

    const getTranslatedLabel = (obj: any) => {
        if (!obj) return "";
        if (lang === 'RU') return obj.label;
        return obj[`label_${lang.toLowerCase()}`] || obj.label;
    };

    const translations: any = {
        RU: {
            entityName: "Наименование предприятия",
            inn: "ИНН",
            mfo: "МФО",
            account: "Расчетный счёт",
            address: "Юридический адрес",
            addressValue: "ГОРОД ТАШКЕНТ МИРАБАДСКИЙ РАЙОН ИСТИКЛОЛАБАД МФЙ, ЭСКИ САРАКУЛ кучаси, 2-уй 58-ХОНА",
            contactLabel: "Связаться с нами",
            writeLabel: "Напишите нам",
            socialLabel: "Мы в соцсетях",
            locationLabel: "Локация"
        },
        UZ: {
            entityName: "Korxona nomi",
            inn: "STIR (INN)",
            mfo: "MFO",
            account: "Hisob raqami",
            address: "Yuridik manzil",
            addressValue: "TOSHKENT SHAHRI MIROBOD TUMANI ISTIQLOLOBOD MFY, ESKI SARAQUL ko'chasi, 2-uy 58-XONA",
            contactLabel: "Biz bilan bog'laning",
            writeLabel: "Bizga yozing",
            socialLabel: "Ijtimoiy tarmoqlar",
            locationLabel: "Manzil"
        },
        EN: {
            entityName: "Company Name",
            inn: "INN",
            mfo: "MFO",
            account: "Settlement Account",
            address: "Legal Address",
            addressValue: "TASHKENT CITY MIRABAD DISTRICT ISTIQLOLABAD MCC, ESKI SARAKUL street, 2-house 58-ROOM",
            contactLabel: "Contact us",
            writeLabel: "Write to us",
            socialLabel: "Social media",
            locationLabel: "Location"
        }
    };

    const t = translations[lang] || translations.RU;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* 1. TOP BAR: LOGO & BACK TO TOP */}
                <div className={styles.topBar}>
                    <Link href="/" className={styles.logo}>HESSA</Link>
                    <button onClick={scrollToTop} className={styles.backToTop}>
                        {lang === 'RU' ? 'Наверх' : lang === 'UZ' ? 'Yuqoriga' : 'To top'} 
                        <span className={styles.topArrow}>↑</span>
                    </button>
                </div>

                {/* 2. MAIN CONTENT GRID */}
                <div className={styles.mainGrid}>
                    {/* LEFT: CONTACTS */}
                    <div className={styles.contactsCol}>
                        <h3 className={styles.columnTitle}>{t.contactLabel}</h3>
                        <div className={styles.contactItems}>
                            <a href={`mailto:${footer?.email || 'hello@hessa.uz'}`} className={styles.contactEmail}>
                                {footer?.email || "hello@hessa.uz"}
                            </a>
                            <a href={`tel:${footer?.phone?.replace(/\D/g, '')}`} className={styles.contactPhone}>
                                {footer?.phone || "+998 (90) 123-4567"}
                            </a>
                        </div>
                        <div className={styles.socialIcons}>
                            <a href={footer?.telegram || "#"} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="Telegram">
                                <Send size={18} />
                            </a>
                            <a href={footer?.instagram || "#"} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: DOCUMENTS */}
                    <div className={styles.docsCol}>
                        <h3 className={styles.columnTitle}>
                        {lang === 'RU' ? 'Документы' : lang === 'UZ' ? 'Hujjatlar' : 'Documents'}
                        </h3>
                        <div className={styles.docsGrid}>
                            {(footer?.legal_links || []).map((link: any, idx: number) => (
                                <Link key={idx} href={link.url} className={styles.docsLink}>
                                    {getTranslatedLabel(link)}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. LEGAL INFO GRID (3 COLUMNS) */}
                <div className={styles.legalGrid}>
                    {/* COL 1: Copyright & Legal Entity */}
                    <div className={styles.legalCol}>
                        <p className={styles.legalText}>
                            {footer?.copyright_text || `© 2018 — ${new Date().getFullYear()} OOO «Hessa» (Hessa).`}
                        </p>
                        <div className={styles.entityInfo}>
                            <p className={styles.legalSmall}>ООО «HESSA»</p>
                            <p className={styles.legalSmall}>{t.inn}: 312296091</p>
                            <p className={styles.legalSmall}>{t.mfo}: 01041</p>
                            <p className={styles.legalSmall}>
                                {t.address}: {t.addressValue}
                            </p>
                        </div>
                    </div>

                    {/* COL 2: Product & Medical Disclaimers */}
                    <div className={styles.legalCol}>
                        <p className={styles.legalSmall}>
                            {lang === 'RU' 
                                ? "Размещённые на сайте продукты не являются лекарственными средствами."
                                : lang === 'UZ'
                                ? "Saytda joylashtirilgan mahsulotlar dori vositalari emas."
                                : "Products posted on the site are not medications."}
                        </p>
                        <p className={styles.legalSmall}>
                            {lang === 'RU'
                                ? "Hessa не осуществляет медицинскую деятельность и не оказывает Пользователям Сайта медицинские услуги, в том числе направленные на профилактику, диагностику и лечение заболеваний."
                                : lang === 'UZ'
                                ? "Hessa tibbiy faoliyat bilan shug'ullanmaydi va Sayt foydalanuvchilariga tibbiy xizmatlar ko'rsatmaydi."
                                : "Hessa does not carry out medical activities and does not provide medical services to users."}
                        </p>
                        <p className={styles.legalSmall}>
                            {lang === 'RU'
                                ? "Все рекомендации не носят предписательного характера. Пожалуйста, ознакомьтесь с Пользовательским соглашением перед покупкой."
                                : lang === 'UZ'
                                ? "Barcha tavsiyalar majburiy xarakterga ega emas. Iltimos, xarid qilishdan oldin foydalanuvchi shartnomasi bilan tanishib chiqing."
                                : "All recommendations are not prescriptive. Please read the User Agreement before purchasing."}
                        </p>
                    </div>

                    {/* COL 3: Rights & Usage */}
                    <div className={styles.legalCol}>
                        <p className={styles.legalSmall}>
                            {lang === 'RU'
                                ? "Все права защищены. Содержимое Сайта, в том числе любая текстовая информация и графические изображения, являются интеллектуальной собственностью ООО «Hessa»."
                                : lang === 'UZ'
                                ? "Barcha huquqlar himoyalangan. Sayt mazmuni, shu jumladan har qanday matnli ma'lumotlar va grafik tasvirlar, «Hessa» MCHJ intellektual mulki hisoblanadi."
                                : "All rights reserved. The content of the Site, including any text and images, are intellectual property of Hessa LLC."}
                        </p>
                        <p className={styles.legalSmall}>
                            {lang === 'RU'
                                ? "Использование их третьими лицами, в том числе копирование, воспроизведение и иное использование в любой форме запрещено."
                                : lang === 'UZ'
                                ? "Ulardan uchinchi shaxslar tomonidan foydalanish, shu jumladan nusxa ko'chirish, ko'paytirish va har qanday shaklda foydalanish taqiqlanadi."
                                : "Their use by third parties, including copying and reproduction, is prohibited."}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
