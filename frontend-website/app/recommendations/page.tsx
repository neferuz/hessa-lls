"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Loader2, AlertCircle, Info, FileText, HelpCircle } from "lucide-react";
import Image from "next/image";
import styles from "./recommendations.module.css";
import { regions, trustBlocks } from "../login/data";
import { RecommendationResult, RecommendationProduct, RecommendationSachet, SubscriptionPlan } from "../login/types";
import Footer from "@/components/Footer";

const translations = {
    RU: {
        loadingTitle: "Финальные штрихи...",
        loadingDesc: "ИИ обрабатывает ваши ответы, чтобы подобрать идеальный состав.",
        errorTitle: "Упс! Ошибка",
        errorDesc: "Не удалось получить рекомендации. Попробуйте обновить страницу.",
        tryAgain: "Попробовать снова",
        backToQuiz: "Вернуться к викторине",
        genericError: "Что-то пошло не так при загрузке данных.",
        aiBadge: "ИИ Рекомендация",
        prodFallback: "Персональный компонент вашего набора",
        reviewsEffect: "95% оценили эффект от курса",
        reviewsCount: "1083 отзывов",
        stat1: "Грамотный подбор",
        stat2: "Удобно принимать",
        stat3: "Улучшилось самочувствие",
        whyTrust: "Почему доверяют HESSA",
        checkoutTitle: "Оформление заказа",
        periodLabel: "Период курса",
        recipientLabel: "Получатель *",
        namePlaceholder: "ФИО",
        phoneLabel: "Телефон (Telegram) *",
        addressLabel: "Адрес доставки *",
        addressPlaceholder: "Город, улица, дом",
        paymentLabel: "Способ оплаты *",
        totalLabel: "К оплате:",
        currency: "сум",
        payButton: "Оплатить",
        validationFields: "Пожалуйста, заполните все обязательные поля",
        validationPhone: "Пожалуйста, введите корректный номер телефона",
        successOrder: "Заказ успешно оформлен! Наш оператор свяжется с вами в ближайшее время.",
        inSet: "В наборе",
        whyThis: "Почему это вам подходит",
        compositionTitle: "Состав / Компоненты набора",
        viewCert: "Сертификат",
        substance: "Вещество",
        dosage: "Дозировка",
        dailyNorm: "% От нормы"
    },
    UZ: {
        loadingTitle: "Yakuniy bosqich...",
        loadingDesc: "Sun'iy intellekt sizga eng mos keladigan tarkibni tanlash uchun javoblaringizni qayta ishlamoqda.",
        errorTitle: "Xatolik yuz berdi",
        errorDesc: "Tavsiyalarni olib bo'lmadi. Sahifani yangilab ko'ring.",
        tryAgain: "Qayta urinish",
        backToQuiz: "Viktorinaga qaytish",
        genericError: "Ma’lumotlarni yuklashda xatolik yuz berdi.",
        aiBadge: "AI Tavsiyasi",
        prodFallback: "Sizning to'plamingizning shaxsiy komponenti",
        reviewsEffect: "95% foydalanuvchilar kurs effektini yuqori baholashdi",
        reviewsCount: "1083 sharhlar",
        stat1: "To'g'ri tanlov",
        stat2: "Qabul qilish qulay",
        stat3: "Sog'liq yaxshilandi",
        whyTrust: "Nima uchun HESSA ga ishonishadi",
        checkoutTitle: "Buyurtmani rasmiylashtirish",
        periodLabel: "Kurs davomiyligi",
        recipientLabel: "Qabul qiluvchi *",
        namePlaceholder: "F.I.SH",
        phoneLabel: "Telefon (Telegram) *",
        addressLabel: "Yetkazib berish manzili *",
        addressPlaceholder: "Shahar, ko'cha, uy",
        paymentLabel: "To'lov usuli *",
        totalLabel: "To'lov uchun:",
        currency: "so'm",
        payButton: "To'lash",
        validationFields: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        validationPhone: "Iltimos, to'g'ri telefon raqamini kiriting",
        successOrder: "Buyurtma muvaffaqiyatli rasmiylashtirildi! Tez orada operatorimiz siz bilan bog'lanadi.",
        inSet: "To'plamda",
        whyThis: "Nima uchun bu mos keladi",
        compositionTitle: "Tarkib / To'plam komponentlari",
        viewCert: "Sertifikat",
        substance: "Modda",
        dosage: "Dozalash",
        dailyNorm: "Me'yordan %"
    },
    EN: {
        loadingTitle: "Final touches...",
        loadingDesc: "AI is processing your answers to select the perfect composition for you.",
        errorTitle: "Oops! Error",
        errorDesc: "Failed to get recommendations. Please try refreshing the page.",
        tryAgain: "Try Again",
        backToQuiz: "Back to Quiz",
        genericError: "Something went wrong while loading data.",
        aiBadge: "AI Recommendation",
        prodFallback: "A personalized component of your kit",
        reviewsEffect: "95% rated the effect of the course",
        reviewsCount: "1083 reviews",
        stat1: "Expert selection",
        stat2: "Convenient to take",
        stat3: "Improved well-being",
        whyTrust: "Why trust HESSA",
        checkoutTitle: "Order Checkout",
        periodLabel: "Course Period",
        recipientLabel: "Recipient *",
        namePlaceholder: "Full Name",
        phoneLabel: "Phone (Telegram) *",
        addressLabel: "Delivery Address *",
        addressPlaceholder: "City, street, house",
        paymentLabel: "Payment Method *",
        totalLabel: "Total:",
        currency: "UZS",
        payButton: "Pay",
        validationFields: "Please fill in all required fields",
        validationPhone: "Please enter a correct phone number",
        successOrder: "Order placed successfully! Our operator will contact you shortly.",
        inSet: "Included in Kit",
        whyThis: "Why this fits you",
        compositionTitle: "Composition / Kit Components",
        viewCert: "Certificate",
        substance: "Substance",
        dosage: "Dosage",
        dailyNorm: "% Of Daily Norm"
    }
};

const trustTranslations = {
    RU: [
        { title: "Собственное производство", desc: "Контроль качества на каждом этапе" },
        { title: "Сертифицировано", desc: "Продукты сертифицированы по стандартам" },
        { title: "Формулы врачей", desc: "Составы постоянно совершенствуются экспертами" },
        { title: "Умный подбор", desc: "Опрос учитывает сочетаемость компонентов" },
    ],
    UZ: [
        { title: "Xususiy ishlab chiqarish", desc: "Har bir bosqichda sifat nazorati" },
        { title: "Sertifikatlangan", desc: "Mahsulotlar standartlar bo'yicha sertifikatlangan" },
        { title: "Shifokorlar formulalari", desc: "Tarkiblar ekspertlar tomonidan takomillashtiriladi" },
        { title: "Aqlli tanlov", desc: "So'rovnoma komponentlarning mosligini hisobga oladi" },
    ],
    EN: [
        { title: "Own Production", desc: "Quality control at every stage" },
        { title: "Certified", desc: "Products are certified according to standards" },
        { title: "Doctor's Formulas", desc: "Compositions are constantly improved by experts" },
        { title: "Smart Selection", desc: "Quiz takes into account component compatibility" },
    ]
};

export default function RecommendationsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lang, setLang] = useState<"RU" | "UZ" | "EN">("RU");

    // Checkout Form State
    const [checkoutForm, setCheckoutForm] = useState({
        name: '',
        email: '',
        phone: '',
        region: 'Ташкент',
        address: '',
        comment: ''
    });
    const [paymentMethod, setPaymentMethod] = useState<'payme' | 'click' | 'uzum'>('payme');
    const [isReferred, setIsReferred] = useState(false);

    const basePrice = selectedPlan?.price || 0;
    const finalPrice = isReferred ? Math.round(basePrice * 0.8) : basePrice;

    const t = translations[lang];
    const tt = trustTranslations[lang];

    // Language listener
    useEffect(() => {
        const checkLang = () => {
            const l = (window as any).currentLang || "RU";
            setLang(l);
        };
        window.addEventListener("langChange", checkLang);
        checkLang();
        return () => window.removeEventListener("langChange", checkLang);
    }, []);

    const getProductImage = (url?: string) => {
        if (!url || url === "/product_bottle.png") return "/product_bottle.png";
        if (url.startsWith("http")) return url;
        
        // Use the same hostname but port 8000 for backend
        const host = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
        return `http://${host}:8000${url.startsWith("/") ? "" : "/"}${url}`;
    };

    // Загружаем результаты ИИ при монтировании
    useEffect(() => {
        const fetchRecommendation = async () => {
            const savedAnswers = localStorage.getItem('quizAnswers');
            if (!savedAnswers) {
                router.push('/quiz');
                return;
            }

            try {
                const answers = JSON.parse(savedAnswers);

                // Предустановка имени из данных пользователя или ответов
                const userDataRaw = localStorage.getItem("hessaUser");
                if (userDataRaw) {
                    try {
                        const u = JSON.parse(userDataRaw);
                        // Если в профиле нет имени, но оно есть в ответах квиза - синхронизируем
                        if (!u.full_name && answers['name']) {
                            u.full_name = answers['name'];
                            localStorage.setItem("hessaUser", JSON.stringify(u));
                            window.dispatchEvent(new Event("hessaAuthChange"));
                        }
                        
                        if (u.full_name) {
                            setCheckoutForm(prev => ({ ...prev, name: u.full_name }));
                        }
                    } catch (e) { }
                } else if (answers['name']) {
                    setCheckoutForm(prev => ({ ...prev, name: answers['name'] }));
                }

                const res = await fetch("/api/quiz/recommend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: savedAnswers 
                });

                if (!res.ok) throw new Error("Failed to get recommendation");

                const data: RecommendationResult = await res.json();
                setRecommendation(data);

                // По умолчанию выбираем первый план (обычно 1 месяц)
                if (data.subscription_plans && data.subscription_plans.length > 0) {
                    setSelectedPlan(data.subscription_plans[0]);
                }

                // Check for referral discount
                const ref = localStorage.getItem('hessaReferralCode');
                setIsReferred(!!ref);
            } catch (e: any) {
                console.error("Failed to fetch recommendation", e);
                setError(e.message || "Error");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [router]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('998')) {
            value = value.substring(3);
        }
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        setCheckoutForm(prev => ({ ...prev, phone: value }));
    };

    const handleSubmit = () => {
        // Валидация
        if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
            alert(t.validationFields);
            return;
        }
        if (checkoutForm.phone.length !== 9) {
            alert(t.validationPhone);
            return;
        }

        // Prepare order items
        const itemProducts = recommendation?.products.map(p => ({
            id: String(p.id),
            productName: p.name,
            quantity: 1,
            price: 0 // Included in plan
        })) || [];

        const itemSachets = recommendation?.sachets?.map(s => ({
            id: String(s.id),
            productName: s.name,
            quantity: 1,
            price: 0
        })) || [];

        const products = [...itemProducts, ...itemSachets];

        // Create order on backend
        const userData = localStorage.getItem("hessaUser");
        let userId = 1; // Default fallback
        if (userData) {
            try {
                userId = JSON.parse(userData).id;
            } catch (e) { }
        }

        const isReferred = !!localStorage.getItem('hessaReferralCode');
        const refCode = localStorage.getItem('hessaReferralCode') || "";
        const baseAmount = selectedPlan?.price || 0;
        const totalAmount = isReferred ? Math.round(baseAmount * 0.8) : baseAmount;

        const orderPayload = {
            user_id: userId,
            order_number: "", // Backend will generate
            status: "pending",
            payment_status: "pending",
            payment_method: paymentMethod,
            region: checkoutForm.region,
            address: checkoutForm.address,
            products: products,
            total_amount: totalAmount,
            duration: selectedPlan?.months || 1,
            ai_analysis: recommendation?.description,
            referral_code: refCode
        };

        fetch("/api/orders/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload)
        })
            .then(res => {
                if (res.ok) {
                    alert(t.successOrder);
                    router.push("/profile");
                } else {
                    console.error("Order creation failed");
                    alert("Ошибка при создании заказа. Попробуйте позже.");
                }
            })
            .catch(err => {
                console.error("Order error", err);
                alert("Ошибка сети. Попробуйте позже.");
            });
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                paddingTop: 0 
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.analyzingCard}
                >
                    <div className={styles.iconWrapper} style={{ marginBottom: '2rem' }}>
                        <Loader2 size={48} className={styles.spinningIcon} />
                    </div>
                    <h2 className={styles.cardTitle}>{t.loadingTitle}</h2>
                    <p className={styles.cardDesc}>{t.loadingDesc}</p>
                </motion.div>
            </div>
        );
    }

    if (error || !recommendation) {
        return (
            <div className={styles.pageWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9fb' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.errorCard}
                >
                    <div className={styles.errorIconWrapper}>
                        <AlertCircle size={32} />
                    </div>
                    <h2 className={styles.errorTitle}>{t.errorTitle}</h2>
                    <p className={styles.errorDesc}>
                        {error === "Failed to get recommendation" ? t.errorDesc : t.genericError}
                    </p>
                    <button onClick={() => window.location.reload()} className={styles.primaryActionBtn}>
                        {t.tryAgain}
                    </button>
                    <button onClick={() => router.push('/quiz')} className={styles.secondaryActionBtn}>
                        {t.backToQuiz}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.recommendationsLayout}>
                {/* Левая часть - Продукты/Саше */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={styles.recsWrapper}
                >
                    <div className={styles.recsHeader}>
                        <div className={styles.aiBadge}>
                            <Sparkles size={14} className={styles.sparkleIcon} />
                            <span>{t.aiBadge}</span>
                        </div>
                        <h2 className={styles.title}>{recommendation.title}</h2>
                        
                        {/* HERO IMAGE */}
                        {recommendation.image && (
                            <div className={styles.heroImageWrapper} style={{ 
                                position: 'relative', 
                                width: '100%', 
                                height: '300px', 
                                margin: '2rem 0',
                                borderRadius: '32px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                            }}>
                                <Image
                                    src={getProductImage(recommendation.image)}
                                    alt="Hero"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        )}

                        <div className={styles.aiReasoningBox}>
                            <h4 style={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', opacity: 0.4 }}>{t.whyThis}</h4>
                            <p className={styles.aiReasoningText}>{recommendation.description}</p>
                        </div>

                        {/* Show composition of the primary sachet in the Hero section */}
                        {recommendation.sachets && recommendation.sachets.length > 0 && recommendation.sachets[0].composition?.ingredients && (
                            <div className={styles.compositionBox} style={{ marginTop: '2rem', borderTop: 'none', background: '#f8fafc', padding: '1.5rem', borderRadius: '24px' }}>
                                <h4 className={styles.compositionTitleSmall}>{t.compositionTitle}</h4>
                                <div className={styles.ingList}>
                                    {recommendation.sachets[0].composition.ingredients.map((ing: any, i: number) => (
                                        <div key={i} className={styles.ingRow} style={{ background: '#ffffff' }}>
                                            <div className={styles.ingImageWrapper}>
                                                <img 
                                                    src={getProductImage(ing.photo_url || "/vitamins.png")}
                                                    alt={ing.name}
                                                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px' }}
                                                />
                                            </div>
                                            <div className={styles.ingMainInfo}>
                                                <div className={styles.ingName}>{ing.name}</div>
                                                <div className={styles.ingDosage}>
                                                    {ing.dosage} {ing.daily_value && <span className={styles.dailyBadge}>{ing.daily_value}</span>}
                                                </div>
                                            </div>
                                            {ing.cert_url && (
                                                <a 
                                                    href={getProductImage(ing.cert_url)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={styles.ingCertLink}
                                                    title={t.viewCert}
                                                >
                                                    <HelpCircle size={18} />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {recommendation.sachets && recommendation.sachets.length > 1 && (
                        <div className={styles.compositionHeader} style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0 1rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '4px', color: '#ccc' }}>{t.inSet}</span>
                            <div style={{ height: '1px', flex: 1, background: '#f0f0f0' }} />
                        </div>
                    )}

                    {/* Product/Sachet Grid */}
                    <div className={styles.recsGrid}>
                        <AnimatePresence>
                            {/* Sachets come first - Skip the first one as it is already featured in the Hero section above */}
                            {recommendation.sachets?.slice(1).map((sachet, idx) => (
                                <motion.div
                                    key={sachet.id}
                                    className={`${styles.recCard} ${styles.sachetCard}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className={styles.recImageInfo}>
                                        <div className={styles.recCategory}>{sachet.dosage}</div>
                                        <h3 className={styles.recName}>{sachet.name}</h3>
                                        <p className={styles.recDesc}>{sachet.reason || sachet.description || t.prodFallback}</p>
                                        
                                        {/* Composition / Ingredients */}
                                        {sachet.composition?.ingredients && sachet.composition.ingredients.length > 0 && (
                                            <div className={styles.compositionBox}>
                                                <h4 className={styles.compositionTitleSmall}>{t.compositionTitle}</h4>
                                                <div className={styles.ingList}>
                                                    {sachet.composition.ingredients.map((ing: any, i: number) => (
                                                        <div key={i} className={styles.ingRow}>
                                                            <div className={styles.ingImageWrapper}>
                                                                <img 
                                                                    src={getProductImage(ing.photo_url || "/vitamins.png")}
                                                                    alt={ing.name}
                                                                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px' }}
                                                                />
                                                            </div>
                                                            <div className={styles.ingMainInfo}>
                                                                <div className={styles.ingName}>{ing.name}</div>
                                                                <div className={styles.ingDosage}>
                                                                    {ing.dosage} {ing.daily_value && <span className={styles.dailyBadge}>{ing.daily_value}</span>}
                                                                </div>
                                                            </div>
                                                            {ing.cert_url && (
                                                                <a 
                                                                    href={getProductImage(ing.cert_url)} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className={styles.ingCertLink}
                                                                    title={t.viewCert}
                                                                >
                                                                    <HelpCircle size={18} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.checkCircle}>
                                        <Check size={14} color="white" />
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Legacy products support */}
                            {recommendation.products.map((prod, idx) => (
                                <motion.div
                                    key={prod.id}
                                    className={styles.recCard}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (recommendation.sachets?.length || 0) * 0.1 + idx * 0.1 }}
                                >
                                    <div className={styles.recImageWrapper}>
                                        <Image
                                            src={getProductImage(prod.image)}
                                            alt={prod.name}
                                            width={100}
                                            height={100}
                                            className={styles.recImage}
                                            unoptimized
                                        />
                                    </div>
                                    <div className={styles.recImageInfo}>
                                        <div className={styles.recCategory}>{prod.category}</div>
                                        <h3 className={styles.recName}>{prod.name}</h3>
                                        <p className={styles.recDesc}>{prod.details || t.prodFallback}</p>
                                    </div>
                                    <div className={styles.checkCircle}>
                                        <Check size={14} color="white" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Stats Section */}
                    <div className={styles.trustSection}>
                        {recommendation.stats && (
                            <>
                                <div className={styles.reviewsHeader}>
                                    <div className={styles.ratingBadge}>
                                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{recommendation.stats.rating}</span>
                                        <Sparkles size={14} fill="#b45309" color="#b45309" />
                                    </div>
                                    <p className={styles.reviewsSub}>{recommendation.stats.effectiveness}% оценили эффект</p>
                                    <p className={styles.reviewsCount}>{recommendation.stats.reviews_count} {t.reviewsCount}</p>
                                </div>

                                <div className={styles.statsGrid}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statVal}>{recommendation.stats.stat1_value}%</span>
                                        <span className={styles.statLabel}>{recommendation.stats.stat1_label}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statVal}>{recommendation.stats.stat2_value}%</span>
                                        <span className={styles.statLabel}>{recommendation.stats.stat2_label}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statVal}>{recommendation.stats.stat3_value}%</span>
                                        <span className={styles.statLabel}>{recommendation.stats.stat3_label}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <h3 className={styles.trustTitle}>{t.whyTrust}</h3>
                        <div className={styles.trustGrid}>
                            {(recommendation.stats?.trust_blocks && recommendation.stats.trust_blocks.length > 0
                                ? recommendation.stats.trust_blocks
                                : tt
                            ).map((tb, idx) => (
                                <div key={idx} className={styles.trustCard} style={{ background: trustBlocks[idx % trustBlocks.length].color }}>
                                    <h4 className={styles.trustCardTitle} style={{ color: trustBlocks[idx % trustBlocks.length].textColor }}>{tb.title}</h4>
                                    <p className={styles.trustCardDesc} style={{ color: trustBlocks[idx % trustBlocks.length].textColor, opacity: 0.9 }}>{(tb as any).description || (tb as any).desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Правая часть - Форма оформления */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.checkoutSidebar}
                >
                    <div className={styles.checkoutSidebarContent}>
                        <h3 className={styles.checkoutSidebarTitle}>{t.checkoutTitle}</h3>

                        {/* Выбор тарифа */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t.periodLabel}</label>
                            <div className={styles.durationGrid}>
                                {recommendation.subscription_plans.map((p, idx) => (
                                    <div
                                        key={`${p.months}-${p.price}-${idx}`}
                                        className={`${styles.durationCard} ${selectedPlan === p ? styles.durationActive : ''}`}
                                        onClick={() => setSelectedPlan(p)}
                                    >
                                        <span className={styles.durationLabel}>{p.title || `${p.months} мес`}</span>
                                        {p.discount > 0 && <span className={styles.discountBadge}>-{Math.round(p.discount)}%</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Имя */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t.recipientLabel}</label>
                            <input
                                className={styles.inputField}
                                placeholder={t.namePlaceholder}
                                value={checkoutForm.name}
                                onChange={e => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        {/* Телефон */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t.phoneLabel}</label>
                            <div className={styles.phoneInputWrapper}>
                                <span className={styles.phonePrefix}>+998</span>
                                <input
                                    type="tel"
                                    className={`${styles.inputField} ${styles.phoneInput}`}
                                    placeholder="901234567"
                                    value={checkoutForm.phone}
                                    onChange={handlePhoneChange}
                                />
                            </div>
                        </div>


                        {/* Адрес */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t.addressLabel}</label>
                            <input
                                className={styles.inputField}
                                placeholder={t.addressPlaceholder}
                                value={checkoutForm.address}
                                onChange={e => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                            />
                        </div>

                        {/* Способ оплаты */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t.paymentLabel}</label>
                            <div className={styles.paymentMethods}>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'payme' ? styles.methodActive : ''}`}
                                    onClick={() => setPaymentMethod('payme')}
                                >
                                    <img 
                                        src="https://api.logobank.uz/media/logos_preview/payme-01_dNOt8CM.png" 
                                        alt="Payme" 
                                        className={styles.paymentLogo}
                                    />
                                </div>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'click' ? styles.methodActive : ''}`}
                                    onClick={() => setPaymentMethod('click')}
                                >
                                    <img 
                                        src="https://api.logobank.uz/media/logos_png/Click-02.png" 
                                        alt="Click" 
                                        className={styles.paymentLogo}
                                    />
                                </div>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'uzum' ? styles.methodActive : ''}`}
                                    onClick={() => setPaymentMethod('uzum')}
                                >
                                    <img 
                                        src="https://play-lh.googleusercontent.com/JCBYxCERUToAIM2Es2qiEohYPt2ii-ekW7CRlX3qTT_atWfekr78JIfOFBFO0CQEkrgN" 
                                        alt="Uzum" 
                                        className={styles.paymentLogo}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Итого */}
                        <div className={styles.checkoutSidebarTotal}>
                            <div className={styles.totalRow}>
                                <span>{t.totalLabel}</span>
                                <span className={styles.totalPriceBig}>{finalPrice.toLocaleString('ru-RU')} {t.currency}</span>
                            </div>
                            <button className={styles.primaryActionBtn} onClick={handleSubmit}>
                                {t.payButton}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div style={{ width: '100%', marginTop: '3rem' }}>
                <Footer />
            </div>
        </div>
    );
}
