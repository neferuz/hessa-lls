"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "./FAQ.module.css";

import TextReveal from "./ui/TextReveal";

export default function FAQ() {
    const [faq, setFaq] = useState<any[]>([
        {
            "question": "Как правильно принимать комплексы HESSA?",
            "question_uz": "HESSA komplekslarini qanday to'g'ri qabul qilish kerak?",
            "question_en": "How to take HESSA complexes correctly?",
            "answer": "Оптимальное время приема — во время или сразу после завтрака, запивая стаканом чистой воды. Это способствует наиболее эффективному усвоению активных нутриентов и дает заряд бодрости на весь день.",
            "answer_uz": "Qabul qilish uchun eng maqbul vaqt — nonushta vaqtida yoki undan keyin bir stakan toza suv bilan. Bu faol nutriyentlarning samarali so'rilishini ta'minlaydi va kun bo'yi tetiklik beradi.",
            "answer_en": "The optimal time to intake is during or immediately after breakfast with a glass of pure water. This promotes more effective absorption of active nutrients and provides an energy boost for the whole day."
        },
        {
            "question": "Когда ожидать первых результатов от приема?",
            "question_uz": "Qabul qilishdan birinchi natijalarni qachon kutish kerak?",
            "question_en": "When to expect the first results?",
            "answer": "Нутриенты действуют накопительно. Первые положительные изменения — повышение уровня энергии и улучшение качества сна — большинство клиентов отмечают через 14–20 дней регулярного соблюдения режима. Рекомендуемая длительность базового курса составляет 30–60 дней.",
            "answer_uz": "Nutriyentlar to'planuvchi ta'sirga ega. Ko'pgina mijozlar 14-20 kunlik muntazam qabuldan so'ng energiya darajasi oshishi va uyqu sifati yaxshilanishini sezadilar. Tavsiya etilgan bazaviy kurs 30-60 kunni tashkil etadi.",
            "answer_en": "Nutrients have a cumulative effect. Most clients notice the first positive changes — increased energy levels and improved sleep quality — after 14–20 days of regular adherence. The recommended duration of a base course is 30–60 days."
        },
        {
            "question": "Сертифицирована ли ваша продукция?",
            "question_uz": "Mahsulotlaringiz sertifikatlanganmi?",
            "question_en": "Are your products certified?",
            "answer": "Да, все комплексы HESSA проходят строгий многоэтапный контроль качества и имеют государственную регистрацию. Мы работаем только с премиальным сырьем из Европы и США на собственном высокотехнологичном производстве.",
            "answer_uz": "Ha, barcha HESSA komplekslari qat'iy ko'p bosqichli sifat nazoratidan o'tadi va davlat ro'yxatidan o'tgan. Biz Evropa va AQShdan keltirilgan yuqori sifatli xom ashyolar bilan o'zimizning yuqori texnologiyali ishlab chiqarishimizda ishlaymiz.",
            "answer_en": "Yes, all HESSA complexes undergo strict multi-stage quality control and have state registration. We work only with premium raw materials from Europe and the USA at our own high-tech production facility."
        }
    ]);
    const [titles, setTitles] = useState<any>({
        "faq_title": "Частые вопросы",
        "faq_subtitle": "Всё, что вы хотели знать о нашей продукции и сервисе",
    });
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
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

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const res = await fetch('/api/content', { cache: 'no-store' });
                const data = await res.json();
                if (data.faq) setFaq(data.faq);
                setTitles({
                    faq_title: data.faq_title || "Частые вопросы",
                    faq_title_uz: data.faq_title_uz || "",
                    faq_title_en: data.faq_title_en || "",
                    faq_subtitle: data.faq_subtitle || "Всё, что вы хотели знать о нашей продукции и сервисе",
                    faq_subtitle_uz: data.faq_subtitle_uz || "",
                    faq_subtitle_en: data.faq_subtitle_en || "",
                });
            } catch (err) {
                console.error("Failed to fetch FAQ:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaq();
    }, []);

    const toggleItem = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const getText = (obj: any, base: string, l: string) => {
        if (!obj) return "";
        if (l === 'RU') return obj[base];
        return obj[`${base}_${l.toLowerCase()}`] || obj[base];
    };

    if (loading || faq.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.stepTag}>FAQ</div>
                    <TextReveal>
                        <h2 className={styles.title}>{getText(titles, 'faq_title', lang)}</h2>
                    </TextReveal>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {getText(titles, 'faq_subtitle', lang)}
                    </motion.p>
                </div>

                <div className={styles.accordion}>
                    {faq.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <button
                                className={styles.questionButton}
                                onClick={() => toggleItem(index)}
                                aria-expanded={activeIndex === index}
                            >
                                <div className={styles.questionHeader}>
                                    <span className={styles.number}>0{index + 1}</span>
                                    <span className={styles.questionText}>{getText(item, 'question', lang)}</span>
                                </div>
                                <div className={`${styles.iconCircle} ${activeIndex === index ? styles.active : ""}`}>
                                    <ChevronDown size={20} strokeWidth={2} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        className={styles.answerWrapper}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                    >
                                        <div className={styles.answerContent}>
                                            <div className={styles.answerInner}>
                                                {getText(item, 'answer', lang)}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
