"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import styles from "./Quiz.module.css";
import { ViewState, QuestionStep, LoginStep } from "../login/types";
import AnalyzingView from "../login/components/AnalyzingView";
import QuizAuthView from "../login/components/QuizAuthView";
import WelcomeView from "../login/components/WelcomeView";
import { API_BASE_URL } from "@/lib/config";

export default function QuizPage() {
    const router = useRouter();
    const [view, setView] = useState<ViewState>('welcome');
    const [questions, setQuestions] = useState<QuestionStep[]>([]);
    const [loading, setLoading] = useState(true);
    const [authStep, setAuthStep] = useState<LoginStep>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [analyzingText, setAnalyzingText] = useState("Анализируем ваши ответы...");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/quiz`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.questions?.length) {
                        setQuestions(
                            data.questions
                                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                                .map((q: any) => ({
                                    id: q.id,
                                    label: q.label,
                                    type: q.type,
                                    gender: q.gender,
                                    multiple: q.multiple,
                                    placeholder: q.placeholder,
                                    options: q.options?.map((o: any) => ({ id: o.id, text: o.text }))
                                }))
                        );
                    }
                }
            } catch (_) {}
            finally { setLoading(false); }
        })();
    }, []);

    useEffect(() => {
        if (view !== 'analyzing') return;
        
        // Save answers to localStorage so Recommendations page can find them
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        
        const msgs = ["Анализируем биоритмы...", "Подбираем микронутриенты...", "Готовим программу..."];
        let i = 0;
        const t = setInterval(() => {
            i++;
            if (i < msgs.length) setAnalyzingText(msgs[i]);
            else { 
                clearInterval(t); 
                setTimeout(() => setView('quiz_auth'), 800); 
            }
        }, 1500);
        return () => clearInterval(t);
    }, [view, answers]);

    const filtered = questions.filter(q => !q.gender || q.gender === 'both' || q.gender === answers['gender']);
    const safeIdx = Math.max(0, Math.min(idx, filtered.length - 1));
    const q = filtered[safeIdx];
    const pct = filtered.length ? ((safeIdx + 1) / filtered.length) * 100 : 0;

    const done = () => {
        if (!q) return false;
        if (q.type === 'input') return (answers[q.id] || '').trim().length > 0;
        return (answers[q.id] || '').length > 0;
    };

    const answer = (val: string) => {
        if (!q) return;
        if (q.multiple) {
            setAnswers(prev => {
                const arr = (prev[q.id] || '').split(',').filter(Boolean);
                const upd = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
                return { ...prev, [q.id]: upd.join(',') };
            });
        } else {
            setAnswers(prev => ({ ...prev, [q.id]: val }));
        }
    };

    const goNext = () => {
        if (safeIdx < filtered.length - 1) setIdx(i => i + 1);
        else setView('analyzing');
    };

    const goBack = () => { if (safeIdx > 0) setIdx(i => Math.max(0, i - 1)); };

    if (view === 'welcome') return <WelcomeView onStart={() => setView('quiz')} />;
    if (view === 'analyzing') return <AnalyzingView analyzingText={analyzingText} />;
    if (view === 'quiz_auth') return <QuizAuthView setView={setView} authStep={authStep} setAuthStep={setAuthStep} email={email} setEmail={setEmail} otp={otp} setOtp={setOtp} participantName={answers['name']} />;

    return (
        <div className={styles.quizPage}>
            <div className={styles.topBar}>
                <Link href="/" className={styles.logo}>HESSA</Link>
                <span className={styles.stepLabel}>
                    {loading ? '...' : `${safeIdx + 1} / ${filtered.length}`}
                </span>
            </div>

            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Загрузка вопросов...</div>
            ) : !q ? (
                <div className={styles.loading}>Нет вопросов</div>
            ) : (
                <>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={q.id}
                            className={styles.content}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className={styles.question}>{q.label}</h2>

                            {q.type === 'input' && (
                                <input
                                    type="text"
                                    className={styles.inputField}
                                    placeholder={q.placeholder || 'Введите ответ...'}
                                    value={answers[q.id] || ''}
                                    onChange={e => answer(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && done()) goNext(); }}
                                    autoFocus
                                />
                            )}

                            {q.type === 'options' && (
                                <div className={styles.options}>
                                    {q.options?.map((opt) => {
                                        const sel = (answers[q.id] || '').split(',').filter(Boolean);
                                        const active = q.multiple ? sel.includes(opt.id) : answers[q.id] === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                className={`${styles.option} ${active ? styles.optionActive : ''}`}
                                                onClick={() => answer(opt.id)}
                                            >
                                                <span>{opt.text}</span>
                                                <div className={styles.optionCircle}>
                                                    {active && (
                                                        <motion.div 
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            style={{ width: 10, height: 10, background: 'white', borderRadius: '50%' }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className={styles.nav}>
                        <button
                            className={styles.navBack}
                            onClick={goBack}
                            disabled={safeIdx === 0}
                            style={{ opacity: safeIdx === 0 ? 0.2 : 1 }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className={styles.navNext}
                            onClick={goNext}
                            disabled={!done()}
                        >
                            <span>{safeIdx === filtered.length - 1 ? 'Финиш' : 'Далее'}</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
