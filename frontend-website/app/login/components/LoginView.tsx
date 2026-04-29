import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Phone, Lock, AlertCircle, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import Image from "next/image";
import styles from "../page.module.css";
import { ViewState, LoginStep } from "../types";
import clsx from "clsx";

interface LoginViewProps {
    setView: (view: ViewState) => void;
    authStep: LoginStep;
    setAuthStep: (step: LoginStep) => void;
    phone: string;
    setPhone: (phone: string) => void;
    otp: string[];
    setOtp: (otp: string[]) => void;
}

export default function LoginView({
    setView,
    authStep,
    setAuthStep,
    phone,
    setPhone,
    otp,
    setOtp
}: LoginViewProps) {
    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequestCode = async () => {
        setError(null);
        if (phone.length < 9) {
            setError("Пожалуйста, введите корректный номер телефона");
            return;
        }
        setIsSubmitting(true);
        const fullPhone = `+998${phone}`;
        try {
            const res = await fetch("/api/auth/request-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: fullPhone, context: "login" }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.detail || "Не удалось отправить код");
                return;
            }
            // We don't alert the code in production. The user will receive an SMS.
            if (data.code) {
                console.log("[DEV] Code:", data.code);
            }
            setAuthStep("otp");
        } catch (e) {
            console.error(e);
            setError("Ошибка сети при отправке кода");
        } finally {
            setIsSubmitting(false);
        }
    };

    const completeEmailLogin = async () => {
        setError(null);
        setIsSubmitting(true);
        const code = otp.join("");
        const fullPhone = `+998${phone}`;
        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: fullPhone, code, context: "login" }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.detail || "Неверный код");
                return;
            }

            localStorage.setItem("hessaUser", JSON.stringify(data));
            window.dispatchEvent(new Event("hessaAuthChange"));
            window.location.href = "/";
        } catch (e) {
            console.error(e);
            setError("Ошибка сети при проверке кода");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className={styles.loginWrapper}
        >
            <button
                className={styles.backLink}
                onClick={() => {
                    if (authStep === 'otp') setAuthStep('phone');
                    else setView('selection');
                }}
            >
                <ChevronLeft size={16} /> Назад
            </button>

            <div className={styles.loginCard}>
                <AnimatePresence mode="wait">
                    {authStep === 'phone' ? (
                        <motion.div
                            key="phone-step"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className={styles.iconWrapper}>
                                <Phone size={24} color="#C497A0" />
                            </div>
                            <h2 className={styles.cardTitle}>Войти в аккаунт</h2>
                            <p className={styles.cardDesc}>Введите ваш номер телефона для получения SMS-кода.</p>

                            <div className={styles.phoneInputWrapper}>
                                <div className={styles.flagPrefix}>
                                    <div className={styles.flagIcon}>
                                        <Image 
                                            src="https://flagcdn.com/uz.svg" 
                                            alt="UZ" 
                                            width={28} 
                                            height={18}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <span className={styles.prefixText}>+998</span>
                                </div>
                                <input
                                    type="tel"
                                    className={styles.inputField}
                                    placeholder="90 000 00 00"
                                    value={(() => {
                                        const v = phone;
                                        let formatted = v;
                                        if (v.length > 2) formatted = v.slice(0, 2) + ' ' + v.slice(2);
                                        if (v.length > 5) formatted = v.slice(0, 2) + ' ' + v.slice(2, 5) + ' ' + v.slice(5);
                                        if (v.length > 7) formatted = v.slice(0, 2) + ' ' + v.slice(2, 5) + ' ' + v.slice(5, 7) + ' ' + v.slice(7);
                                        return formatted;
                                    })()}
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, '');
                                        if (v.length > 9) v = v.slice(0, 9);
                                        setPhone(v); 
                                        if (error) setError(null);
                                    }}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && phone.length === 9 && !isSubmitting) {
                                            handleRequestCode();
                                        }
                                    }}
                                />
                            </div>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={styles.errorNotification}
                                    style={{ marginTop: '1rem' }}
                                >
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                            <button
                                className={styles.actionBtn}
                                disabled={phone.length < 9 || isSubmitting}
                                onClick={handleRequestCode}
                            >
                                {isSubmitting ? "Отправка..." : "Отправить код"}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-step"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className={styles.iconWrapper}>
                                <Lock size={24} color="#C497A0" />
                            </div>
                            <h2 className={styles.cardTitle}>Введите код</h2>
                            <p className={styles.cardDesc}>Мы отправили 4-значный код на <strong>+998 {phone.slice(0, 2)} {phone.slice(2, 5)} {phone.slice(5, 7)} {phone.slice(7)}</strong></p>

                            <div className={styles.otpGrid}>
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="tel"
                                        maxLength={1}
                                        className={styles.otpInput}
                                        value={d}
                                        autoFocus={i === 0}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, '');
                                            // Handle Paste
                                            if (v.length > 1) {
                                                const pasted = v.split('').slice(0, 4);
                                                setOtp(pasted.concat(Array(4 - pasted.length).fill('')));
                                                // Focus last filled
                                                setTimeout(() => document.getElementById(`otp-${Math.min(3, pasted.length)}`)?.focus(), 0);
                                                return;
                                            }

                                            const n = [...otp];
                                            n[i] = v;
                                            setOtp(n);

                                            // Auto-focus next
                                            if (v && i < 3) {
                                                document.getElementById(`otp-${i + 1}`)?.focus();
                                            }

                                            // Auto-submit on last digit
                                            if (i === 3 && v && n.every(digit => digit !== '')) {
                                                completeEmailLogin();
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                                document.getElementById(`otp-${i - 1}`)?.focus();
                                            }
                                            if (e.key === 'Enter' && otp.join("").length === 4 && !isSubmitting) {
                                                completeEmailLogin();
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginTop: '1rem' }}
                                    className={styles.errorNotification}
                                >
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <button
                                className={styles.actionBtn}
                                disabled={otp.join("").length < 4 || isSubmitting}
                                onClick={completeEmailLogin}
                            >
                                {isSubmitting ? "Проверяем..." : "Продолжить"}
                            </button>

                            <button
                                className={styles.textLink}
                                onClick={() => setAuthStep('phone')}
                            >
                                Изменить номер
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

