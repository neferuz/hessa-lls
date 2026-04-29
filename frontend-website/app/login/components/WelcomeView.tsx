"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, Bot } from "lucide-react";
import styles from "./WelcomeView.module.css";

interface WelcomeViewProps {
    onStart: () => void;
}

export default function WelcomeView({ onStart }: WelcomeViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.welcomeWrapper}
        >
            {/* Premium Background Accents */}
            <motion.div
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={styles.bgAccent1}
            />

            <motion.div
                animate={{ 
                    scale: [1.1, 1, 1.1],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={styles.bgAccent2}
            />

            {/* Editorial Content Layout */}
            <div className={styles.content}>
                {/* Brand Logo Mini */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <Link href="/" className={styles.logoBadge}>HESSA</Link>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.title}
                >
                    Ваша персональная <span className={styles.titleHighlight}>формула</span> здоровья.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className={styles.subtitle}
                >
                    За 2 минуты мы проанализируем ваши биоритмы и подберем премиальные нутрицевтики на основе доказательной медицины.
                </motion.p>

                {/* Benefits / Tech stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className={styles.benefits}
                >
                    {[
                        { icon: <Activity size={18} />, label: 'Биоритмы', desc: 'Умный анализ' },
                        { icon: <Bot size={18} />, label: 'HESSA-AI', desc: 'Персонализация' },
                        { icon: <ShieldCheck size={18} />, label: 'Safe', desc: 'GMP Стандарт' }
                    ].map((item, i) => (
                        <div key={i} className={styles.benefitItem}>
                            <div className={styles.iconWrapper}>
                                {item.icon}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className={styles.benefitLabel}>{item.label}</span>
                                <span className={styles.benefitDesc}>{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Primary Action */}
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    onClick={onStart}
                    className={styles.startBtn}
                >
                    Начать анализ
                    <div className={styles.btnIcon}>
                        <ArrowRight size={18} />
                    </div>
                </motion.button>
            </div>

            {/* Bottom Credits */}
            <div className={styles.footer}>
                <div className={styles.footerLine}>
                    <div className={styles.line} />
                    <span className={styles.footerText}>Luxury Health Tech</span>
                    <div className={styles.line} />
                </div>
            </div>
        </motion.div>
    );
}
