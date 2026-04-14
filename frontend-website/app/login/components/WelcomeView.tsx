"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Bot } from "lucide-react";

interface WelcomeViewProps {
    onStart: () => void;
}

export default function WelcomeView({ onStart }: WelcomeViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                background: '#ffffff'
            }}
        >
            {/* Premium Background Accents */}
            <motion.div
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    top: '-5%',
                    right: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(196, 151, 160, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />

            <motion.div
                animate={{ 
                    scale: [1.1, 1, 1.1],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(73, 122, 155, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
            />

            {/* Editorial Content Layout */}
            <div style={{ maxWidth: '800px', width: '100%', position: 'relative', zIndex: 10 }}>
                {/* Brand Logo Mini */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    style={{ marginBottom: '3.5rem' }}
                >
                    <span style={{
                        fontFamily: 'var(--font-unbounded)',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        letterSpacing: '0.2em',
                        color: '#1a1a1a',
                        textTransform: 'uppercase',
                        background: '#f8fafc',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '100px',
                        border: '1px solid #f1f5f9'
                    }}>HESSA</span>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontFamily: 'var(--font-unbounded)',
                        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                        fontWeight: 600,
                        lineHeight: 1.05,
                        color: '#1a1a1a',
                        marginBottom: '2rem',
                        letterSpacing: '-0.05em'
                    }}
                >
                    Ваша персональная <span style={{ color: '#C497A0' }}>формула</span> здоровья.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    style={{
                        fontFamily: 'var(--font-manrope)',
                        fontSize: '1.15rem',
                        lineHeight: 1.6,
                        color: '#475569',
                        marginBottom: '4rem',
                        maxWidth: '600px',
                        margin: '0 auto 4rem',
                        fontWeight: 500
                    }}
                >
                    За 2 минуты мы проанализируем ваши биоритмы и подберем премиальные нутрицевтики на основе доказательной медицины.
                </motion.p>

                {/* Benefits / Tech stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2.5rem',
                        marginBottom: '5rem',
                        flexWrap: 'wrap'
                    }}
                >
                    {[
                        { icon: <Activity size={18} />, label: 'Биоритмы', desc: 'Умный анализ' },
                        { icon: <Bot size={18} />, label: 'HESSA-AI', desc: 'Персонализация' },
                        { icon: <ShieldCheck size={18} />, label: 'Safe', desc: 'GMP Стандарт' }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '16px', 
                                background: '#f8fafc', 
                                border: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#C497A0'
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>{item.desc}</span>
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
                    style={{
                        background: '#1a1a1a',
                        color: '#fff',
                        border: 'none',
                        padding: '1.4rem 4rem',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-unbounded)',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1.2rem',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    Начать анализ
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ArrowRight size={18} />
                    </div>
                </motion.button>
            </div>

            {/* Bottom Credits */}
            <div style={{
                position: 'absolute',
                bottom: '3rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '1px', background: '#f1f5f9' }} />
                    <span style={{ 
                        fontFamily: 'var(--font-unbounded)', 
                        fontSize: '0.6rem', 
                        fontWeight: 800, 
                        color: '#cbd5e1', 
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase'
                    }}>Luxury Health Tech</span>
                    <div style={{ width: '40px', height: '1px', background: '#f1f5f9' }} />
                </div>
            </div>
        </motion.div>
    );
}
