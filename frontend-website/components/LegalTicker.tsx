"use client";

import { useState, useEffect } from "react";
import styles from "./LegalTicker.module.css";

export default function LegalTicker() {
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

    const translations: any = {
        RU: [
            "БАД не является лекарственным средством.",
            "Дополнительный источник витаминов и минералов.",
            "Не предназначено для лечения заболеваний."
        ],
        UZ: [
            "BFQ dori vositasi emas.",
            "Vitaminlar va minerallarning qo'shimcha manbai.",
            "Kasalliklarni davolash uchun mo'ljallanmagan."
        ],
        EN: [
            "Dietary supplement is not a medicine.",
            "Additional source of vitamins and minerals.",
            "Not intended for the treatment of diseases."
        ]
    };

    const items = translations[lang] || translations.RU;

    return (
        <div className={styles.tickerContainer}>
            <div className={styles.tickerTrack}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.tickerGroup}>
                        {items.map((text: string, idx: number) => (
                            <div key={idx} className={styles.tickerItem}>
                                {text}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
