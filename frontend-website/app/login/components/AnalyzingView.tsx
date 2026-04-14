import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnalyzingViewProps {
    analyzingText: string;
}

export default function AnalyzingView({ analyzingText }: AnalyzingViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                minHeight: '100vh',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                fontFamily: 'var(--font-manrope), sans-serif',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
             {/* Background Accents */}
             <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(196, 151, 160, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            {/* Animated Icon */}
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 4rem', zIndex: 10 }}>
                {/* Pulse Ring */}
                <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle, #C497A0 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />

                {/* Dashed Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                    style={{
                        position: 'absolute', top: 5, left: 5, right: 5, bottom: 5,
                        border: '1.2px dashed #C497A0',
                        borderRadius: '50%',
                        opacity: 0.4,
                    }}
                />

                {/* Center Icon Box */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 64, height: 64,
                        background: '#1a1a1a',
                        borderRadius: 22,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <Sparkles color="#C497A0" size={28} strokeWidth={1.2} />
                </motion.div>
            </div>

            {/* Text Content */}
            <div style={{ zIndex: 10, position: 'relative' }}>
                <motion.h2
                    key={analyzingText}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontFamily: 'var(--font-unbounded), sans-serif',
                        fontSize: '2rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '1rem',
                        letterSpacing: '-0.04em',
                    }}
                >
                    {analyzingText}
                </motion.h2>

                <p style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '1.05rem',
                    color: '#64748b',
                    maxWidth: 420,
                    lineHeight: 1.6,
                    margin: '0 auto 4rem',
                    fontWeight: 500,
                }}>
                    Алгоритм HESSA подбирает идеальное сочетание на основе доказательной медицины
                </p>

                {/* Progress bar */}
                <div style={{
                    width: '280px',
                    margin: '0 auto',
                    height: 2,
                    background: '#f1f5f9',
                    borderRadius: 100,
                    overflow: 'hidden',
                }}>
                    <motion.div
                        style={{ height: '100%', background: '#C497A0' }}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'easeInOut' }}
                    />
                </div>
            </div>

            {/* HESSA word mark */}
            <div style={{
                position: 'absolute',
                bottom: '3rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-unbounded), sans-serif',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
            }}>
                HESSA
            </div>
        </motion.div>
    );
}
