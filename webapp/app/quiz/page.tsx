"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Star, Sparkles, CreditCard, Calendar, X, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { API_BASE_URL } from "@/lib/config";

interface QuizOption {
    id: string;
    text: string;
}

interface QuizQuestion {
    id: string;
    section: string;
    label: string;
    type: "input" | "options";
    placeholder?: string;
    options: QuizOption[];
    multiple?: boolean;
    gender?: string;
}

interface RecommendedSachet {
    id: number;
    name: string;
    dosage: string;
    reason: string;
    image: string;
    description: string;
}

const getApiImageUrl = (url: string) => {
    if (!url || url === "/product_bottle.png") return "/product_bottle.png";
    if (url.startsWith('http')) return url;
    // Prepend API_BASE_URL for any relative path from backend
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

interface SubscriptionPlan {
    months: number;
    price: number;
    discount: number;
    title?: string;
    items?: string;
}

interface RecommendationResult {
    title: string;
    description: string;
    image: string;
    sachets: RecommendedSachet[];
    subscription_plans: SubscriptionPlan[];
}

export default function QuizPage() {
    const [selectedProductForModal, setSelectedProductForModal] = useState<RecommendedSachet | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<number>(0);
    const [analyzingText, setAnalyzingText] = useState("Инициализация анализа...");
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('click');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = async () => {
        if (!recommendation) return;
        setIsSubmitting(true);
        const plan = recommendation.subscription_plans[selectedPlan];

        try {
            // Create real order
            const orderPayload = {
                user_id: 1, // Fallback user_id
                order_number: `HS-${Math.floor(100000 + Math.random() * 900000)}`,
                status: "pending",
                payment_status: "paid",
                payment_method: paymentMethod,
                products: recommendation.sachets.map(s => ({
                    id: s.id,
                    productName: s.name,
                    price: 0 
                })),
                total_amount: plan?.price || 0,
                duration: plan?.months || 1,
                ai_analysis: recommendation.description,
                quiz_answers: answers
            };

            const res = await fetch(`${API_BASE_URL}/api/orders/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload)
            });

            if (!res.ok) throw new Error("Failed to create order");

            setIsSuccess(true);
        } catch (error) {
            console.error("Payment failed", error);
            // Fallback for demo
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (analyzing) {
            const texts = [
                "Инициализация анализа...",
                "Изучаем ваши биоритмы...",
                "Подбираем микронутриенты...",
                "Оптимизируем дозировки...",
                "Формируем персональный план..."
            ];
            let i = 0;
            const interval = setInterval(() => {
                i++;
                if (i < texts.length) setAnalyzingText(texts[i]);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [analyzing]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/quiz`);
                const data = await res.json();
                setQuestions(data.questions);
            } catch (err) {
                console.error("Failed to fetch quiz", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    const handleOptionSelect = (questionId: string, optionId: string) => {
        const question = filteredQuestions.find(q => q.id === questionId);
        if (question?.multiple) {
            setAnswers(prev => {
                const current = prev[questionId] ? prev[questionId].split(',') : [];
                const updated = current.includes(optionId)
                    ? current.filter(id => id !== optionId)
                    : [...current, optionId];
                return { ...prev, [questionId]: updated.join(',') };
            });
        } else {
            setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        }
    };

    const handleInputChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextStep = () => {
        if (currentStep < filteredQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Фильтруем вопросы по полу
    const selectedGender = answers['gender'];
    const filteredQuestions = questions.filter(q =>
        !q.gender || q.gender === 'both' || q.gender === selectedGender
    );

    const finishQuiz = async () => {
        setAnalyzing(true);
        try {
            console.log("Submitting quiz answers...", answers);
            const res = await fetch(`${API_BASE_URL}/api/quiz/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(answers)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
            }

            const data = await res.json();
            console.log("Recommendation received:", data);
            setRecommendation(data);
            setIsFinished(true);
        } catch (err) {
            console.error("Failed to get recommendation:", err);
            // Fallback for demo purposes if backend fails
            setRecommendation({
                title: "Универсальный набор Hessa",
                description: "К сожалению, сервис временно недоступен. Мы подобрали для вас универсальный набор.",
                image: "https://i.pinimg.com/736x/8e/31/3d/8e313d4b684d7285223e71df825b497b.jpg",
                sachets: [
                    {
                        id: 1,
                        name: "Hessa Balance",
                        dosage: "1 саше",
                        reason: "Для поддержания здоровья",
                        image: "/product_bottle.png",
                        description: "Универсальный комплекс витаминов"
                    }
                ],
                subscription_plans: [
                    { months: 1, price: 499000, discount: 0, title: "Пробный старт", items: "1 набор" },
                    { months: 3, price: 1347000, discount: 10, title: "Курс на результат", items: "3 набора" },
                    { months: 6, price: 2545000, discount: 15, title: "Полная трансформация", items: "6 наборов" }
                ]
            });
            setIsFinished(true);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-[#C497A0] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (analyzing) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden font-sans">
                {/* Simplified Brand Background */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#C497A0]/20">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10 }}
                        className="h-full bg-[#C497A0]"
                    />
                </div>

                {/* Elegant AI Loading Animation */}
                <div className="relative w-40 h-40 mb-10">
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.03, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-[#C497A0]/10 shadow-[0_0_30px_rgba(196,151,160,0.05)]"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-3 rounded-full border border-[#C497A0]/5"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.05, 0.1, 0.05]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute w-24 h-24 bg-[#C497A0] rounded-full blur-[40px]"
                        />
                        <div className="relative z-10">
                            <Sparkles className="w-9 h-9 text-[#C497A0] mx-auto mb-1.5 opacity-80" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 max-w-[260px] relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={analyzingText}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="text-xl font-bold text-[#1a1a1a] tracking-tight"
                        >
                            {analyzingText}
                        </motion.h2>
                    </AnimatePresence>
                    <p className="text-[#94a3b8] text-[13px] font-medium leading-relaxed">
                        Наш ИИ анализирует ваш профиль для создания идеального плана
                    </p>
                </div>

                {/* Minimalist Micro-stats */}
                <div className="mt-10 flex gap-6">
                    <div className="flex flex-col items-center">
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C497A0] mb-2">БИОРИТМЫ</div>
                        <div className="h-0.5 w-10 bg-gray-50 rounded-full overflow-hidden">
                            <motion.div animate={{ x: [-40, 40] }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-full bg-[#C497A0]/40" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C497A0] mb-2">ДЕФИЦИТЫ</div>
                        <div className="h-0.5 w-10 bg-gray-50 rounded-full overflow-hidden">
                            <motion.div animate={{ x: [-40, 40] }} transition={{ duration: 2.5, repeat: Infinity }} className="h-full w-full bg-[#C497A0]/40" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-sans">
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#C497A0]/5 rounded-full blur-[80px] pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-[#C497A0] rounded-[22px] flex items-center justify-center mb-6 shadow-xl shadow-[#C497A0]/20 relative z-10"
                >
                    <CheckCircle2 size={28} className="text-white" strokeWidth={2.5} />
                </motion.div>

                <div className="space-y-2 mb-10 relative z-10">
                    <h1 className="text-2xl font-bold text-[#1a1a1a] leading-tight">
                        Заказ оформлен!
                    </h1>
                    <p className="text-[#94a3b8] max-w-[240px] mx-auto text-sm font-medium leading-relaxed">
                        Ваша программа готова. Мы уже начали подготовку вашего набора.
                    </p>
                </div>

                <div className="w-full max-w-[260px] space-y-3 relative z-10">
                    <Link
                        href="/profile"
                        className="w-full h-13 bg-[#1a1a1a] text-white rounded-[16px] flex items-center justify-center font-bold text-sm tracking-wide active:scale-95 transition-all shadow-lg shadow-black/5"
                    >
                        Мои заказы
                    </Link>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full h-13 bg-white border border-gray-100 text-[#1a1a1a] rounded-[16px] flex items-center justify-center font-bold text-sm active:scale-95 transition-all"
                    >
                        На главную
                    </button>
                </div>
            </div>
        );
    }

    if (showCheckout && recommendation) {
        const plan = recommendation.subscription_plans[selectedPlan];

        return (
            <div className="min-h-screen bg-[#F8FAFC] text-[#1a1a1a] pb-32 font-sans">
                <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white/80 backdrop-blur-xl flex items-center justify-between border-b border-gray-50">
                    <button
                        onClick={() => setShowCheckout(false)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all text-[#1a1a1a] border border-gray-100"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <h1 className="text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]">Оформление</h1>
                    <div className="w-8" />
                </div>

                <div className="px-5 pt-16 space-y-6">
                    <section>
                        <h3 className="text-[9px] font-bold text-[#C497A0] uppercase tracking-[0.15em] mb-3 pl-1">Ваш тариф</h3>
                        <div className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.02)] relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fcf5f6] text-[#C497A0] text-[9px] font-black uppercase tracking-wider mb-2.5">
                                    {plan?.months === 1 ? 'Пробный старт' :
                                        plan?.months === 3 ? 'Курс на результат' :
                                            plan?.months === 6 ? 'Полная трансформация' :
                                                (plan?.title || "Персональный план")}
                                </span>

                                <div className="flex items-baseline gap-1 mb-1.5">
                                    <span className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
                                        {Math.round(plan?.price || 0).toLocaleString()}
                                    </span>
                                    <span className="text-xs font-bold text-[#94a3b8]">сум</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-[12px] text-[#94a3b8] font-bold">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} className="text-[#C497A0]" />
                                        <span>{plan?.months} {plan?.months === 1 ? 'месяц' : 'месяца'}</span>
                                    </div>
                                    {plan?.discount > 0 && (
                                        <>
                                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                                            <span className="text-emerald-500">Выгода {plan?.discount}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[9px] font-bold text-[#C497A0] uppercase tracking-[0.15em] mb-2.5 pl-1">Способ оплаты</h3>
                        <div className="grid grid-cols-1 gap-1.5">
                            {[
                                { id: 'click', name: 'Click Up', logo: 'https://api.logobank.uz/media/logos_preview/Click-02.png' },
                                { id: 'payme', name: 'Payme', logo: 'https://api.logobank.uz/media/logos_preview/Payme-01.png' },
                                { id: 'uzum', name: 'Uzum Bank', logo: 'https://api.logobank.uz/media/logos_preview/Uzum-01.png' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`w-full h-14 px-4 rounded-[16px] border text-left transition-all flex items-center justify-between active:scale-[0.98] ${paymentMethod === method.id
                                        ? "bg-white border-[#C497A0] shadow-sm"
                                        : "bg-white/50 border-gray-100 text-gray-400"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-white border border-gray-50 flex items-center justify-center p-1.5 overflow-hidden transition-all ${paymentMethod === method.id ? "opacity-100" : "opacity-40 grayscale"}`}>
                                            <img 
                                                src={method.logo} 
                                                alt={method.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[14px] font-bold leading-none ${paymentMethod === method.id ? "text-[#1a1a1a]" : "text-gray-400"}`}>
                                                {method.name}
                                            </span>
                                        </div>
                                    </div>
                                    {paymentMethod === method.id && (
                                        <div className="w-5 h-5 rounded-full bg-[#fcf5f6] flex items-center justify-center">
                                            <CheckCircle2 size={14} className="text-[#C497A0]" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-white border-t border-gray-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-[0.1em]">Итого к оплате</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-[#1a1a1a] tracking-tight">
                                    {Math.round(plan?.price || 0).toLocaleString('ru-RU')}
                                </span>
                                <span className="text-xs font-bold text-[#94a3b8]">сум</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isSubmitting}
                            className="w-full h-12 bg-[#C497A0] text-white rounded-[14px] flex items-center justify-center gap-2 font-bold text-sm tracking-wide active:scale-95 transition-all disabled:opacity-70 shadow-lg shadow-[#C497A0]/20"
                        >
                            {isSubmitting ? (
                                <Loader2 size={18} className="animate-spin text-white/50" />
                            ) : (
                                <span>Оплатить заказ</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isFinished && recommendation) {
        return (
            <div className="min-h-screen bg-white pb-32 max-w-md mx-auto relative overflow-hidden font-sans">
                <div className="px-5 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-50">
                    <button onClick={() => setIsFinished(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C497A0]">Результат анализа</span>
                    <div className="w-8" />
                </div>

                <div className="px-5 pt-4">
                    <div className="relative mb-6">
                        <div className="relative z-10 bg-white rounded-[28px] border border-gray-50 overflow-hidden shadow-sm">
                            <div className="relative h-[280px] w-full bg-gray-50">
                                <Image
                                    src={getApiImageUrl(recommendation.image)}
                                    alt="Hero"
                                    fill
                                    priority
                                    unoptimized
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                                        <span className="text-[9px] font-bold text-[#C497A0] tracking-wider uppercase">Одобрено ИИ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 -mt-8 relative z-10">
                                <div className="bg-white/90 backdrop-blur-xl p-5 rounded-[20px] border border-gray-100 shadow-sm mb-6 text-center">
                                    <h1 className="text-gray-900 text-lg font-bold leading-tight mb-2 tracking-tight">
                                        {recommendation.title}
                                    </h1>
                                    <p className="text-[#94a3b8] text-[12px] leading-relaxed font-medium">
                                        {recommendation.description}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-bold text-[#C497A0] uppercase tracking-[0.15em] shrink-0">ВАШ СОСТАВ</span>
                                        <div className="h-[1px] flex-1 bg-gray-50" />
                                    </div>

                                    <div className="space-y-2">
                                        {recommendation.sachets.map((sachet, sIdx) => (
                                            <button
                                                key={sachet.id}
                                                onClick={() => setSelectedProductForModal(sachet)}
                                                className="w-full text-left flex items-start gap-4 p-3 rounded-[18px] bg-white border border-gray-50 shadow-sm hover:border-[#C497A0]/30 transition-all duration-300"
                                            >
                                                <div className="w-12 h-12 rounded-[14px] bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100/50 overflow-hidden relative p-2">
                                                    <Image
                                                        src={getApiImageUrl(sachet.image)}
                                                        alt={sachet.name}
                                                        fill
                                                        unoptimized
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-[8px] font-bold text-[#C497A0] bg-[#fcf5f6] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            {sachet.dosage}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5">{sachet.name}</h4>
                                                    <p className="text-[10px] text-[#94a3b8] leading-relaxed font-medium line-clamp-1">
                                                        {sachet.reason}
                                                    </p>
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center self-center shrink-0">
                                                    <Info size={10} className="text-[#94a3b8]" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedProductForModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md"
                            onClick={() => setSelectedProductForModal(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-sm bg-white rounded-[24px] overflow-hidden shadow-2xl relative flex flex-col"
                            >
                                <div className="relative h-32 bg-gray-50 shrink-0">
                                    <Image
                                        src={getApiImageUrl(selectedProductForModal.image)}
                                        alt={selectedProductForModal.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => setSelectedProductForModal(null)}
                                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm text-gray-900"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>

                                <div className="p-5 pt-2 pb-5">
                                    <div className="text-center mb-4">
                                        <span className="text-[8px] uppercase font-bold tracking-widest text-[#C497A0] mb-1 block">{selectedProductForModal.dosage}</span>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{selectedProductForModal.name}</h3>
                                        <p className="text-[10px] text-[#94a3b8] max-w-[85%] mx-auto leading-relaxed">
                                            {selectedProductForModal.reason}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-[14px] border border-gray-100">
                                         <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                                             {selectedProductForModal.description || "Этот компонент был подобран искусственным интеллектом специально для коррекции вашего состояния на основе данных анкеты."}
                                         </p>
                                     </div>
                                </div>

                                <div className="p-4 pt-0 mt-auto">
                                    <button
                                        onClick={() => setSelectedProductForModal(null)}
                                        className="w-full h-10 bg-gray-900 text-white rounded-lg font-bold text-[11px] tracking-wide active:scale-95 transition-all"
                                    >
                                        Понятно
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="px-5 mb-8">
                    <h3 className="text-[9px] font-bold text-[#C497A0] uppercase tracking-[0.15em] mb-4 pl-1">Выберите программу</h3>
                    <div className="space-y-2">
                        {recommendation.subscription_plans.map((plan, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedPlan(idx)}
                                className={`w-full p-3.5 rounded-[18px] border transition-all flex items-center justify-between active:scale-[0.98] ${selectedPlan === idx
                                    ? "border-[#C497A0] bg-[#fcf5f6]/30 shadow-sm"
                                    : "border-gray-50 bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${selectedPlan === idx ? "bg-[#C497A0] text-white" : "bg-gray-50 text-gray-300"}`}>
                                        <Calendar size={13} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[13px] font-bold text-[#1a1a1a]">
                                            {plan?.months === 1 ? 'Пробный старт' :
                                                plan?.months === 3 ? 'Курс на результат' :
                                                    plan?.months === 6 ? 'Полная трансформация' :
                                                        (plan?.title || 'Персональный план')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold uppercase text-[#94a3b8]">{plan?.months} {plan?.months === 1 ? 'мес.' : 'мес.'}</span>
                                            {plan?.discount > 0 && (
                                                <span className="text-[9px] font-bold uppercase text-emerald-500">-{plan?.discount}%</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[14px] font-bold text-[#1a1a1a]">{Math.round(plan?.price || 0).toLocaleString()} <span className="text-[9px] font-bold text-[#94a3b8]">сум</span></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-white/80 backdrop-blur-xl border-t border-gray-50">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full h-12 bg-[#C497A0] text-white rounded-[14px] flex items-center justify-center gap-3 font-bold text-sm tracking-wide active:scale-95 transition-all shadow-lg shadow-[#C497A0]/20"
                        >
                            Заказать программу
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = filteredQuestions[currentStep];

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-[#94a3b8] text-xs font-bold uppercase tracking-widest">Загрузка вопросов...</p>
            </div>
        );
    }

    const progress = ((currentStep + 1) / filteredQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative overflow-hidden font-sans text-[#1a1a1a]">
            {/* Minimal Background Elements */}
            <div className="absolute top-[-5%] left-[-10%] w-[300px] h-[300px] bg-[#C497A0]/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
                <button onClick={prevStep} className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-all ${currentStep === 0 ? 'opacity-0' : 'opacity-100'}`}>
                    <ChevronLeft size={18} className="text-[#94a3b8]" />
                </button>
                <div className="flex flex-col items-center">
                   <span className="text-[10px] font-bold text-[#C497A0] uppercase tracking-[0.2em] mb-0.5">HESSA QUIZ</span>
                   <div className="h-0.5 w-12 bg-gray-50 rounded-full overflow-hidden">
                       <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#C497A0]" />
                   </div>
                </div>
                <div className="w-8" />
            </div>

            <div className="flex-1 px-5 pt-8 pb-32 relative z-10 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col flex-1"
                    >
                        <div className="mb-8 px-1">
                            <h2 className="text-[19px] font-bold text-[#1a1a1a] leading-tight tracking-tight text-center">
                                {currentQuestion.label}
                            </h2>
                        </div>

                        {currentQuestion.type === "input" ? (
                            <div className="relative px-1">
                                <input
                                    type="text"
                                    autoFocus
                                    value={answers[currentQuestion.id] || ""}
                                    onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                    placeholder={currentQuestion.placeholder}
                                    className="w-full bg-transparent border-b border-gray-100 py-3 text-2xl font-bold text-[#1a1a1a] placeholder:text-gray-100 focus:outline-none focus:border-[#C497A0] transition-all text-center"
                                />
                                <p className="mt-4 text-[10px] text-[#94a3b8] font-medium text-center opacity-60">Нажмите «Продолжить», чтобы идти дальше</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                {currentQuestion.options.map((option) => {
                                    const isSelected = (answers[currentQuestion.id] || "").split(',').includes(option.id);
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                                            className={`p-4 rounded-[16px] border text-left transition-all duration-200 flex items-center justify-between active:scale-[0.98] ${isSelected
                                                ? "bg-white border-[#C497A0] shadow-sm"
                                                : "bg-[#F8FAFC]/50 border-gray-50 hover:border-gray-100"
                                                }`}
                                        >
                                            <span className={`text-[13px] font-bold ${isSelected ? "text-[#1a1a1a]" : "text-gray-400"}`}>
                                                {option.text}
                                            </span>
                                            {isSelected && (
                                                <div className="w-4 h-4 rounded-full bg-[#C497A0] flex items-center justify-center">
                                                    <CheckCircle2 size={10} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-white border-t border-gray-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={nextStep}
                        disabled={!answers[currentQuestion.id]}
                        className="w-full h-12 bg-[#1a1a1a] text-white rounded-[14px] flex items-center justify-center gap-2 font-bold text-sm tracking-wide active:scale-95 transition-all disabled:opacity-20 shadow-md shadow-black/5"
                    >
                        <span>{currentStep === filteredQuestions.length - 1 ? "Завершить" : "Продолжить"}</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
