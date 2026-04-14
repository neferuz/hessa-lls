import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles, AlertCircle, Phone, Fingerprint } from "lucide-react";
import { ViewState, LoginStep } from "../types";

interface QuizAuthViewProps {
    setView: (view: ViewState) => void;
    authStep: LoginStep;
    setAuthStep: (step: LoginStep) => void;
    email: string;
    setEmail: (email: string) => void;
    otp: string[];
    setOtp: (otp: string[]) => void;
    participantName: string;
}

export default function QuizAuthView({
    setView, authStep, setAuthStep, email, setEmail, otp, setOtp, participantName
}: QuizAuthViewProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentName, setCurrentName] = useState(participantName || "");

    const parseError = (detail: any, fallback: string): string => {
        if (!detail) return fallback;
        if (typeof detail === 'string') return detail;
        if (Array.isArray(detail)) return detail.map((e: any) => e?.msg || JSON.stringify(e)).join(', ');
        return fallback;
    };

    const handleRequestCode = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/request-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: `+998${email}`, context: "quiz" }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setError(parseError(data?.detail, "Не удалось отправить код")); return; }
            setAuthStep("otp");
        } catch { setError("Ошибка сети при отправке кода"); }
        finally { setIsSubmitting(false); }
    };

    const completeQuizAuth = async () => {
        setError(null);
        setIsSubmitting(true);
        const code = otp.join("");
        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: `+998${email}`, code, context: "quiz", full_name: currentName }),
            });
            const data = await res.json();
            if (!res.ok) { setError(parseError(data?.detail, "Неверный код")); return; }
            try { localStorage.setItem("hessaUser", JSON.stringify(data)); } catch {}
            try { window.dispatchEvent(new Event("hessaAuthChange")); } catch {}
            window.location.href = "/recommendations";
        } catch { setError("Ошибка сети при проверке кода"); }
        finally { setIsSubmitting(false); }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                minHeight: '100vh',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                fontFamily: 'var(--font-manrope), sans-serif',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Accents (From Login Style) */}
            <div style={{
                position: 'fixed',
                top: '-10%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'rgba(196, 151, 160, 0.3)',
                borderRadius: '50%',
                filter: 'blur(120px)',
                zIndex: -1
            }} />

            {/* Back button */}
            <div style={{ width: '100%', maxWidth: 420, marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                <button
                    onClick={() => authStep === 'otp' ? setAuthStep('email') : setView('quiz')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.4)', border: '1px solid rgba(0, 0, 0, 0.05)', cursor: 'pointer',
                        padding: '0.5rem 1.25rem', borderRadius: '100px',
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontSize: '0.85rem', fontWeight: 700,
                        color: '#94a3b8',
                    }}
                >
                    <ChevronLeft size={16} />
                    Назад
                </button>
            </div>

            {/* Glassmorphic Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%',
                    maxWidth: 420,
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: 32,
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                {/* Icon Wrapper */}
                <div style={{
                    width: 52, height: 52,
                    background: 'white',
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                }}>
                    <Sparkles size={26} color="#C497A0" strokeWidth={1.5} />
                </div>

                <AnimatePresence mode="wait">
                    {authStep === 'email' ? (
                        <motion.div
                            key="email-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 style={{
                                fontFamily: 'var(--font-unbounded), sans-serif',
                                fontSize: '1.5rem', fontWeight: 800,
                                color: '#1a1a1a', marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1
                            }}>
                                Сохранить прогресс
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>
                                Введите данные для получения персональной программы.
                            </p>

                            {/* Name Field */}
                            <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    borderRadius: 24,
                                    padding: '1rem 1.5rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
                                }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>
                                        Ваше имя
                                    </label>
                                    <input
                                        value={currentName}
                                        onChange={e => setCurrentName(e.target.value)}
                                        placeholder="Введите имя"
                                        autoFocus
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '1.15rem', fontWeight: 600, color: '#1a1a1a',
                                            fontFamily: 'var(--font-manrope), sans-serif',
                                            outline: 'none',
                                            padding: '0'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    borderRadius: 24,
                                    padding: '1rem 1.5rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
                                }}>
                                    <label style={{ 
                                        fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', 
                                        textTransform: 'uppercase', letterSpacing: '0.1em', 
                                        display: 'block', marginBottom: '0.4rem' 
                                    }}>
                                        Телефон
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ 
                                            fontFamily: 'var(--font-manrope)', 
                                            fontSize: '1.15rem', fontWeight: 600, color: '#1a1a1a',
                                            opacity: 0.6,
                                            paddingRight: '0.75rem',
                                            borderRight: '1px solid rgba(0, 0, 0, 0.1)'
                                        }}>+998</span>
                                        <input
                                            type="tel"
                                            placeholder="90 123 45 67"
                                            value={email}
                                            onChange={e => setEmail(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                            style={{
                                                flex: 1,
                                                background: 'transparent',
                                                border: 'none',
                                                fontSize: '1.15rem', fontWeight: 600, color: '#1a1a1a',
                                                fontFamily: 'var(--font-manrope), sans-serif',
                                                outline: 'none',
                                                letterSpacing: '0.05em',
                                                padding: '0'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifySelf: 'center', gap: '0.5rem',
                                    padding: '1rem', background: 'rgba(239, 68, 68, 0.05)',
                                    border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: 16,
                                    color: '#ef4444', fontSize: '0.9rem', fontWeight: 600,
                                    marginBottom: '2rem', textAlign: 'left'
                                }}>
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                disabled={email.length < 9 || isSubmitting}
                                onClick={handleRequestCode}
                                style={{
                                    width: '100%', padding: '1.25rem',
                                    background: email.length < 9 || isSubmitting ? '#e2e8f0' : '#1a1a1a',
                                    color: 'white', border: 'none', borderRadius: 20,
                                    fontFamily: 'var(--font-unbounded), sans-serif',
                                    fontSize: '0.85rem', fontWeight: 600,
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                    cursor: email.length < 9 || isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.4s ease',
                                    opacity: email.length < 9 ? 0.3 : 1
                                }}
                            >
                                {isSubmitting ? 'Загрузка...' : 'Получить результат'}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                             <h2 style={{
                                fontFamily: 'var(--font-unbounded), sans-serif',
                                fontSize: '1.5rem', fontWeight: 800,
                                color: '#1a1a1a', marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1
                            }}>
                                Подтверждение
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.5 }}>
                                Код отправлен на <strong style={{color:'#1a1a1a'}}>+998 {email}</strong>.
                            </p>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        id={`otp-q-${i}`}
                                        type="text"
                                        maxLength={1}
                                        value={d}
                                        onChange={e => {
                                            const v = e.target.value.replace(/\D/g, "");
                                            if (!v && e.target.value !== "") return;
                                            const n = [...otp];
                                            n[i] = v.slice(-1);
                                            setOtp(n);
                                            if (v && i < 3) {
                                                document.getElementById(`otp-q-${i + 1}`)?.focus();
                                            }
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                                document.getElementById(`otp-q-${i - 1}`)?.focus();
                                            }
                                        }}
                                        style={{
                                            width: 52, height: 60,
                                            textAlign: 'center',
                                            fontSize: '1.35rem', fontWeight: 500,
                                            border: '2px solid transparent',
                                            borderRadius: 16,
                                            background: d ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                            fontFamily: 'var(--font-space-grotesk), sans-serif',
                                            color: '#1a1a1a',
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                ))}
                            </div>

                            {error && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '1rem', background: 'rgba(239, 68, 68, 0.05)',
                                    border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: 16,
                                    color: '#ef4444', fontSize: '0.9rem', fontWeight: 600,
                                    marginBottom: '2rem', textAlign: 'left'
                                }}>
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                disabled={otp.join("").length < 4 || isSubmitting}
                                onClick={completeQuizAuth}
                                style={{
                                    width: '100%', padding: '1.25rem',
                                    background: '#1a1a1a',
                                    color: 'white', border: 'none', borderRadius: 20,
                                    fontFamily: 'var(--font-unbounded), sans-serif',
                                    fontSize: '0.85rem', fontWeight: 600,
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                    cursor: otp.join("").length < 4 || isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.4s ease',
                                    opacity: otp.join("").length < 4 ? 0.3 : 1
                                }}
                            >
                                {isSubmitting ? 'Проверка...' : 'Подтвердить'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Bottom Credit */}
            <div style={{
                position: 'absolute',
                bottom: '3rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-unbounded), sans-serif',
                fontSize: '0.8rem', fontWeight: 800,
                color: '#cbd5e1', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
                HESSA
            </div>
        </motion.div>
    );
}
