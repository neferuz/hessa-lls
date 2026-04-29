"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Package,
    ChevronRight,
    Settings,
    LogOut,
    CreditCard,
    MapPin,
    History,
    ChevronLeft,
    Edit2,
    X,
    Phone,
    Mail,
    Sparkles,
    Clock,
    Copy,
    Check,
    Gift,
    Coins,
    Share2,
    Bot,
    Stethoscope,
    FileText,
    Archive
} from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";
import loginStyles from "../login/page.module.css";
import { recommendedProducts } from "../login/data";
import { formatPhoneNumber } from "@/lib/utils";

// Translations
const translations: any = {
    RU: {
        title: "Личный кабинет",
        back: "Назад",
        tabs: {
            overview: "Обзор",
            program: "Моя программа",
            orders: "История заказов",
            tests: "Сдать анализы на дому"
        },
        greeting: {
            morning: "Доброе утро",
            day: "Добрый день",
            evening: "Добрый вечер",
            night: "Доброй ночи",
            hello: "Привет"
        },
        stats: {
            active: "Программа активна",
            orders: "заказа(ов)"
        },
        personal: {
            title: "Личные данные",
            name: "Ваше имя",
            phone: "Номер телефона",
            email: "Email",
            address: "Адрес",
            edit: "Редактировать данные",
            save: "Сохранить изменения",
            saving: "Сохранение...",
            cancel: "Отмена"
        },
        program: {
            title: "Моя программа",
            date: "Дата оформления",
            duration: "Длительность",
            address: "Адрес доставки",
            set: "Ваш набор:",
            month: "мес.",
            empty: "У вас пока нет активной программы",
            quizText: "Пройдите викторину, чтобы мы могли подобрать идеальный курс именно для вас.",
            takeQuiz: "Пройти викторину",
            notSpecified: "Не указан"
        },
        orders: {
            title: "История заказов",
            order: "Заказ",
            status: {
                completed: "Выполнен",
                processing: "В сборке",
                pending: "Ожидает",
                canceled: "Отменен",
                default: "В обработке"
            },
            method: "Способ оплаты",
            time: "Время оплаты",
            tariff: "Тариф",
            composition: "Состав заказа:",
            ai: "Рекомендация ИИ",
            empty: "У вас пока нет заказов",
            sum: "сум",
            inSet: "В наборе"
        },
        logout: "Выйти из аккаунта",
        logoutConfirm: {
            title: "Выход из аккаунта",
            text: "Вы уверены, что хотите выйти? Вам потребуется снова войти в систему для доступа к программе.",
            confirm: "Выйти",
            cancel: "Остаться"
        },
        support: {
            title: "Чат поддержки",
            text: "Напишите нам в Telegram для быстрого ответа:",
            open: "Открыть Telegram",
            bot: "Telegram",
            botTitle: "Мы есть в Telegram",
            botDesc: "Следите за новостями, полезными статьями и эксклюзивными предложениями в нашем боте. Будьте в курсе всех новинок!"
        },
        placeholders: {
            name: "Ваше имя",
            phone: "99 123 45 67",
            email: "example@mail.com"
        },
        preview: "Превью:",
        referral: {
            title: "Реферальная программа",
            desc: "Делитесь ссылкой, дарите друзьям скидку 20% и получайте 10% кэшбэк токенами!",
            yourLink: "Ваша ссылка",
            copy: "Скопировать",
            copied: "Скопировано!",
            bonuses: "Ваши бонусы",
            tokens: "токенов"
        }
    },
    UZ: {
        title: "Shaxsiy kabinet",
        back: "Ortga",
        tabs: {
            overview: "Umumiy",
            program: "Mening dasturim",
            orders: "Buyurtmalar tarixi",
            tests: "Uyda taxlil"
        },
        greeting: {
            morning: "Xayrli tong",
            day: "Xayrli kun",
            evening: "Xayrli kech",
            night: "Xayrli tun",
            hello: "Salom"
        },
        stats: {
            active: "Dastur faol",
            orders: "buyurtma(lar)"
        },
        personal: {
            title: "Shaxsiy ma'lumotlar",
            name: "Ismingiz",
            phone: "Telefon raqami",
            email: "Email",
            address: "Manzil",
            edit: "Ma'lumotlarni tahrirlash",
            save: "O'zgarishlarni saqlash",
            saving: "Saqlanmoqda...",
            cancel: "Bekor qilish"
        },
        program: {
            title: "Mening dasturim",
            date: "Rasmiylashtirilgan sana",
            duration: "Davomiyligi",
            address: "Yetkazib berish manzili",
            set: "Sizning to'plamingiz:",
            month: "oy",
            empty: "Sizda hozircha faol dastur yo'q",
            quizText: "Siz uchun ideal kursni tanlashimiz uchun viktorinadan o'ting.",
            takeQuiz: "Viktorinadan o'tish",
            notSpecified: "Ko'rsatilmagan"
        },
        orders: {
            title: "Buyurtmalar tarixi",
            order: "Buyurtma",
            status: {
                completed: "Bajarildi",
                processing: "Yig'ilmoqda",
                pending: "Kutilmoqda",
                canceled: "Bekor qilindi",
                default: "Qayta ishlanmoqda"
            },
            method: "To'lov usuli",
            time: "To'lov vaqti",
            tariff: "Tarif",
            composition: "Buyurtma tarkibi:",
            ai: "AI Tavsiyasi",
            empty: "Sizda hozircha buyurtmalar yo'q",
            sum: "so'm",
            inSet: "To'plamda"
        },
        logout: "Akkauntdan chiqish",
        logoutConfirm: {
            title: "Akkauntdan chiqish",
            text: "Chiqishni xohlaysizmi? Dasturga kirish uchun qayta tizimga kirishingiz kerak bo'ladi.",
            confirm: "Chiqish",
            cancel: "Qolish"
        },
        support: {
            title: "Qo'llab-quvvatlash chati",
            text: "Tezkor javob olish uchun bizga Telegram orqali yozing:",
            open: "Telegramni ochish",
            bot: "Telegram",
            botTitle: "Biz Telegramdamiz",
            botDesc: "Botimizda yangiliklar, foydali maqolalar va eksklyuziv takliflarni kuzatib boring. Yangiliklardan xabardor bo'ling!"
        },
        placeholders: {
            name: "Ismingiz",
            phone: "99 123 45 67",
            email: "example@mail.com"
        },
        preview: "Ko'rib chiqish:",
        referral: {
            title: "Referral dasturi",
            desc: "Havolani ulashing, do'stlaringizga 20% chegirma bering va 10% keshbek oling!",
            yourLink: "Sizning havolangiz",
            copy: "Nusxalash",
            copied: "Nusxalandi!",
            bonuses: "Sizning bonuslaringiz",
            tokens: "token"
        }
    },
    EN: {
        title: "Personal Account",
        back: "Back",
        tabs: {
            overview: "Overview",
            program: "My Program",
            orders: "Order History",
            tests: "Home Analysis"
        },
        greeting: {
            morning: "Good morning",
            day: "Good afternoon",
            evening: "Good evening",
            night: "Good night",
            hello: "Hello"
        },
        stats: {
            active: "Program active",
            orders: "order(s)"
        },
        personal: {
            title: "Personal Data",
            name: "Your Name",
            phone: "Phone Number",
            email: "Email",
            address: "Address",
            edit: "Edit Data",
            save: "Save Changes",
            saving: "Saving...",
            cancel: "Cancel"
        },
        program: {
            title: "My Program",
            date: "Date",
            duration: "Duration",
            address: "Delivery Address",
            set: "Your Set:",
            month: "mo.",
            empty: "You don't have an active program yet",
            quizText: "Take the quiz so we can choose the perfect course for you.",
            takeQuiz: "Take Quiz",
            notSpecified: "Not specified"
        },
        orders: {
            title: "Order History",
            order: "Order",
            status: {
                completed: "Completed",
                processing: "Processing",
                pending: "Pending",
                canceled: "Canceled",
                default: "Processing"
            },
            method: "Payment Method",
            time: "Payment Time",
            tariff: "Tariff",
            composition: "Order Composition:",
            ai: "AI Recommendation",
            empty: "You have no orders yet",
            sum: "sum",
            inSet: "In set"
        },
        logout: "Log Out",
        logoutConfirm: {
            title: "Log Out",
            text: "Are you sure you want to log out? You will need to log in again to access your program.",
            confirm: "Log Out",
            cancel: "Stay"
        },
        support: {
            title: "Support Chat",
            text: "Write to us on Telegram for a quick response:",
            open: "Open Telegram",
            bot: "Telegram",
            botTitle: "We are on Telegram",
            botDesc: "Follow the news, useful articles and exclusive offers in our bot. Stay updated with all news!"
        },
        placeholders: {
            name: "Your Name",
            phone: "99 123 45 67",
            email: "example@mail.com"
        },
        preview: "Preview:",
        referral: {
            title: "Referral Program",
            desc: "Share the link, give friends a 20% discount and earn 10% cashback in tokens!",
            yourLink: "Your Link",
            copy: "Copy",
            copied: "Copied!",
            bonuses: "Your Bonuses",
            tokens: "tokens"
        }
    }
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [programData, setProgramData] = useState<any>(null);
    const [orderHistory, setOrderHistory] = useState<any[]>([]);
    const [analysisRequests, setAnalysisRequests] = useState<any[]>([]);
    const [analysisFilter, setAnalysisFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const [showSupport, setShowSupport] = useState(false);
    const [showBotModal, setShowBotModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editValues, setEditValues] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [greeting, setGreeting] = useState("");
    const [currentLang, setCurrentLang] = useState("RU");
    const [referralCode, setReferralCode] = useState("HESSA-FRIEND-20");
    const [tokens, setTokens] = useState(1500);
    const [copied, setCopied] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ message: string; isError: boolean } | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleCopy = () => {
        const link = `https://hessa.uz/ref/${referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const showToast = (message: string, isError: boolean = false) => {
        setToastMessage({ message, isError });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const getFileUrl = (url: string | null) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/static')) return `http://127.0.0.1:8000${url}`;
        const clean = url.startsWith('/') ? url.slice(1) : url;
        return `http://127.0.0.1:8000/static/${clean}`;
    };

    // Listen for language changes
    useEffect(() => {
        const updateLang = () => {
            const lang = (window as any).currentLang || "RU";
            setCurrentLang(lang);
        };

        updateLang();
        window.addEventListener("langChange", updateLang);
        return () => window.removeEventListener("langChange", updateLang);
    }, []);

    const t = translations[currentLang] || translations.RU;

    const tabs = [
        { id: "overview", label: t.tabs.overview, icon: <User size={18} /> },
        { id: "program", label: t.tabs.program, icon: <Package size={18} /> },
        { id: "orders", label: t.tabs.orders, icon: <History size={18} /> },
        { id: "tests", label: t.tabs.tests, icon: <Stethoscope size={18} /> },
    ];

    // Set greeting based on time of day
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 6) setGreeting(t.greeting.night);
        else if (hour < 12) setGreeting(t.greeting.morning);
        else if (hour < 18) setGreeting(t.greeting.day);
        else setGreeting(t.greeting.evening);
    }, [currentLang]);

    // Helper for images
    const getProductImage = (url?: string) => {
        if (!url) return "/product_bottle.png";
        if (url.startsWith("http")) return url;

        // If it already starts with /static, just prepend host
        if (url.startsWith("/static")) {
            return `http://127.0.0.1:8000${url}`;
        }

        // Otherwise assume it's a file in backend/static and needs /static prefix
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://127.0.0.1:8000/static/${cleanPath}`;
    };

    // Lock scroll when modal is open
    useEffect(() => {
        if (showEditModal || showSupport) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        };
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showEditModal, showSupport]);

    useEffect(() => {
        const loadData = async () => {
            const userData = localStorage.getItem("hessaUser");
            if (!userData) {
                router.push("/login");
                return;
            }

            try {
                const parsed = JSON.parse(userData);
                // Fetch detailed user data (including referral code and tokens)
                try {
                    const userRes = await fetch(`/api/users/${parsed.id}`);
                    if (userRes.ok) {
                        const detailedUser = await userRes.json();
                        setUser(detailedUser);
                        if (detailedUser.referral_code) setReferralCode(detailedUser.referral_code);
                        if (detailedUser.tokens !== undefined) setTokens(detailedUser.tokens);

                        // Update local storage to keep it fresh
                        localStorage.setItem("hessaUser", JSON.stringify(detailedUser));
                    } else {
                        // Fallback if fetch fails
                        setUser(parsed);
                    }
                } catch (e) {
                    console.error("Failed to fetch user details", e);
                    setUser(parsed);
                }

                // Загружаем данные программы
                const checkoutData = localStorage.getItem("hessaCheckout");

                if (checkoutData) {
                    try {
                        const checkout = JSON.parse(checkoutData);
                        let programInfo: any = {
                            products: recommendedProducts,
                            duration: checkout.duration || 1,
                            purchaseDate: checkout.purchaseDate || parsed.createdAt || new Date().toISOString(),
                            address: checkout.address || parsed.address || null,
                            region: checkout.region || parsed.region || null,
                            name: checkout.name || parsed.full_name || parsed.username || null,
                            phone: checkout.phone || parsed.phone || null,
                            email: checkout.email || parsed.email || null,
                        };
                        setProgramData(programInfo);
                    } catch (e) {
                        console.error("Failed to parse checkout data", e);
                        setProgramData(null);
                    }
                } else {
                    setProgramData(null);
                }

                // Загружаем историю заказов с бэкенда
                try {
                    const ordersRes = await fetch(`/api/orders/user/${parsed.id}`);
                    if (ordersRes.ok) {
                        const orders = await ordersRes.json();

                        // Преобразуем формат бэкенда в формат фронтенда если нужно
                        const formattedOrders = orders.map((o: any) => ({
                            id: o.id,
                            date: o.created_at,
                            total: o.total_amount,
                            status: o.status,
                            products: o.products || [],
                            ai_analysis: o.ai_analysis
                        }));

                        setOrderHistory(formattedOrders);
                    }
                } catch (e) {
                    console.error("Failed to fetch orders from backend", e);
                    // Fallback to localStorage if backend fails
                    const ordersData = localStorage.getItem("hessaOrderHistory");
                    if (ordersData) {
                        setOrderHistory(JSON.parse(ordersData));
                    }
                }

                // Загружаем запросы на анализы
                try {
                    const analysisRes = await fetch(`/api/analysis/user/${parsed.id}`);
                    if (analysisRes.ok) {
                        const requests = await analysisRes.json();
                        setAnalysisRequests(requests);
                    }
                } catch (e) {
                    console.error("Failed to fetch analysis requests", e);
                }
            } catch (e) {
                console.error("Failed to parse user data", e);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [router]);

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleEdit = (field: string, currentValue: string) => {
        setEditingField(field);
        setEditValues({ ...editValues, [field]: currentValue });
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValues({});
    };

    const handleSave = async (field: string) => {
        if (!user?.id) return;

        setSaving(true);
        try {
            const updateData: any = {};
            if (field === 'name') {
                updateData.full_name = editValues.name;
            } else if (field === 'phone') {
                updateData.phone = editValues.phone?.replace(/\D/g, '').substring(0, 9);
            } else if (field === 'email') {
                updateData.email = editValues.email;
            } else if (field === 'region') {
                updateData.region = editValues.region;
            } else if (field === 'address') {
                updateData.address = editValues.address;
            }

            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                localStorage.setItem("hessaUser", JSON.stringify(updatedUser));
                setEditingField(null);
                setShowEditModal(false);

                // Обновляем также checkout данные если они есть
                const checkoutData = localStorage.getItem("hessaCheckout");
                if (checkoutData) {
                    const checkout = JSON.parse(checkoutData);
                    if (field === 'name') checkout.name = editValues.name;
                    if (field === 'phone') checkout.phone = editValues.phone?.replace(/\D/g, '').substring(0, 9);
                    if (field === 'email') checkout.email = editValues.email;
                    if (field === 'region') checkout.region = editValues.region;
                    if (field === 'address') checkout.address = editValues.address;
                    localStorage.setItem("hessaCheckout", JSON.stringify(checkout));
                    setProgramData((prev: any) => ({ ...prev, ...checkout }));
                }

                // Обновляем programData напрямую из обновленного пользователя
                if (field === 'region' || field === 'address') {
                    setProgramData((prev: any) => ({
                        ...prev,
                        [field]: editValues[field as keyof typeof editValues] || ''
                    }));
                }

                setEditingField(null);
                setEditValues({});
            } else {
                alert("Ошибка при сохранении данных");
            }
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Ошибка при сохранении данных");
        } finally {
            setSaving(false);
        }
    };

    const handleRequestAnalysis = async () => {
        if (!user?.id) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/analysis/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    address: user.address || null
                })
            });
            if (res.ok) {
                const newReq = await res.json();
                setAnalysisRequests([newReq, ...analysisRequests]);
                alert(currentLang === "RU" ? "Заявка успешно отправлена!" : "So'rov yuborildi!");
            } else {
                alert("Ошибка при отправке заявки");
            }
        } catch (e) {
            console.error("Failed to request analysis:", e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.profileWrapper}>
            <div className={styles.profileContainer}>
                {/* Header and Back button removed as requested */}



                {/* Navigation Tabs */}
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsContainer}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.tabItem} ${activeTab === tab.id ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className={styles.activeIndicator}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={styles.tabContent}
                    >

                        {activeTab === "overview" && (
                            <div className={styles.overviewSection}>
                                {/* Profile Header Section */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={styles.mainProfileHeader}
                                >
                                    <div className={styles.headerCentral}>
                                        <div className={styles.avatarLarge}>
                                            <User size={40} />
                                        </div>
                                        <div className={styles.centralInfo}>
                                            <h2 className={styles.userNameLarge}>
                                                {t.greeting.hello}, {programData?.name || user.full_name || (user.username && !user.username.includes('@') ? user.username : "друг")}! 👋
                                            </h2>
                                            <p className={styles.greetingText}>{greeting}</p>
                                        </div>
                                    </div>
                                    <div className={styles.quickStats}>
                                        <div className={styles.statItem}>
                                            <Package size={20} />
                                            <span>{t.stats.active}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <History size={20} />
                                            <span>{orderHistory.length} {t.stats.orders}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <div className={styles.tokenIconMini}>H</div>
                                            <span>{tokens} {t.referral.tokens}</span>
                                        </div>
                                    </div>
                                </motion.div>



                                <div className={styles.overviewGrid}>
                                    {/* Personal Data Section integrated in Overview */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={styles.infoCard}
                                    >
                                        <div className={styles.cardHeader} style={{ justifyContent: 'space-between', width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className={styles.cardIcon}>
                                                    <User size={20} />
                                                </div>
                                                <h3 className={styles.cardTitle}>{t.personal.title}</h3>
                                            </div>
                                            <button
                                                className={styles.editIconBtn}
                                                style={{ opacity: 1 }}
                                                onClick={() => {
                                                    setEditValues({
                                                        name: user.full_name || user.username,
                                                        phone: user.phone,
                                                        email: user.email,
                                                        address: user.address || ''
                                                    });
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardItem}>
                                                <User size={16} className={styles.cardItemIcon} />
                                                <div className={styles.cardItemContent}>
                                                    <span className={styles.cardItemLabel}>{t.personal.name}</span>
                                                    <span className={styles.cardItemValue}>{user.full_name || user.username || user.email?.split("@")[0]}</span>
                                                </div>
                                            </div>

                                            <div className={styles.cardItem}>
                                                <Phone size={16} className={styles.cardItemIcon} />
                                                <div className={styles.cardItemContent}>
                                                    <span className={styles.cardItemLabel}>{t.personal.phone}</span>
                                                    <span className={styles.cardItemValue}>{formatPhoneNumber(user.phone)}</span>
                                                </div>
                                            </div>

                                            <div className={styles.cardItem}>
                                                <Mail size={16} className={styles.cardItemIcon} />
                                                <div className={styles.cardItemContent}>
                                                    <span className={styles.cardItemLabel}>{t.personal.email}</span>
                                                    <span className={styles.cardItemValue}>{user.email}</span>
                                                </div>
                                            </div>

                                            <div className={styles.cardItem}>
                                                <MapPin size={16} className={styles.cardItemIcon} />
                                                <div className={styles.cardItemContent}>
                                                    <span className={styles.cardItemLabel}>{t.personal.address}</span>
                                                    <span className={styles.cardItemValue}>{user.address || t.program.notSpecified}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    {/* Referral Program Section in standard style */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className={styles.infoCard}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div className={styles.cardIcon}>
                                                <Gift size={20} />
                                            </div>
                                            <h3 className={styles.cardTitle}>{t.referral.title}</h3>
                                        </div>

                                        <div className={styles.cardContent}>
                                            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5, marginBottom: '0.5rem', fontFamily: 'var(--font-evolventa), sans-serif' }}>
                                                {t.referral.desc}
                                            </p>

                                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #edf2f7', marginTop: '0.5rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-evolventa), sans-serif' }}>{t.referral.yourLink}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', fontFamily: 'var(--font-evolventa), sans-serif', letterSpacing: '0.02em' }}>hessa.uz/ref/{referralCode}</span>
                                                        <button
                                                            onClick={handleCopy}
                                                            className={styles.editIconBtn}
                                                            style={{ color: copied ? '#10b981' : '#C497A0', opacity: 1 }}
                                                        >
                                                            {copied ? <Check size={20} /> : <Copy size={20} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.bonusCard}>
                                                <div className={styles.tokenIconLarge}>H</div>
                                                <div className={styles.bonusInfo}>
                                                    <span className={styles.bonusLabel}>{t.referral.bonuses}</span>
                                                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                                        <span className={styles.tokenValue}>{tokens}</span>
                                                        <span className={styles.tokenUnit}>{t.referral.tokens}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className={styles.telegramBanner}
                                    >
                                        <div className={styles.telegramInfo}>
                                            <div className={styles.telegramTag}>
                                                {t.support.bot}
                                                <div className={styles.telegramTagLine}></div>
                                            </div>
                                            
                                            <h3 className={styles.telegramTitle}>
                                                {t.support.botTitle}<span style={{ color: '#C497A0' }}>.</span>
                                            </h3>
                                            
                                            <p className={styles.telegramDesc}>
                                                {t.support.botDesc}
                                            </p>
 
                                             <button
                                                 className={`${styles.primaryActionBtn} ${styles.telegramBtn}`}
                                                 onClick={() => setShowBotModal(true)}
                                             >
                                                 <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.support.open}</span>
                                                 <div className={styles.telegramBtnIcon}>
                                                     <Bot size={18} />
                                                 </div>
                                             </button>
                                         </div>
 
                                         {/* Dynamic QR for desktop */}
                                         <div className={styles.desktopOnly} style={{ flexShrink: 0 }}>
                                             <div className={styles.telegramQR}>
                                                 <div className={styles.qrWrapper}>
                                                     <Image
                                                         src="/qr-code.jpeg"
                                                         alt="Telegram QR"
                                                         width={110}
                                                         height={110}
                                                         style={{ objectFit: 'contain' }}
                                                     />
                                                 </div>
                                                 <span className={styles.qrHandle}>@hessa_uz</span>
                                             </div>
                                         </div>
                                     </motion.div>
                                </div>
                            </div>
                        )}

                        {activeTab === "program" && (
                            <div className={styles.programTabContent}>
                                {programData ? (
                                    <div className={styles.topGrid}>
                                        {/* My Program */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={styles.infoCard}
                                        >
                                            <div className={styles.cardHeader}>
                                                <div className={styles.cardIcon}>
                                                    <Package size={20} />
                                                </div>
                                                <h3 className={styles.cardTitle}>{t.program.title}</h3>
                                            </div>
                                            <div className={styles.programMetaGrid}>
                                                <div className={styles.metaItem}>
                                                    <div className={styles.metaIcon}>
                                                        <Clock size={18} />
                                                    </div>
                                                    <div className={styles.metaContent}>
                                                        <span className={styles.metaLabel}>{t.program.date}</span>
                                                        <span className={styles.metaValue}>
                                                            {new Date(programData.purchaseDate).toLocaleDateString(currentLang === 'RU' ? "ru-RU" : "en-US", {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric"
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <div className={styles.metaIcon}>
                                                        <Package size={18} />
                                                    </div>
                                                    <div className={styles.metaContent}>
                                                        <span className={styles.metaLabel}>{t.program.duration}</span>
                                                        <span className={styles.metaValue}>{programData.duration} {t.program.month}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <div className={styles.metaIcon}>
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div className={styles.metaContent}>
                                                        <span className={styles.metaLabel}>{t.program.address}</span>
                                                        <span className={styles.metaValue}>
                                                            {programData.region || t.program.notSpecified}, {programData.address || t.program.notSpecified}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.programProducts}>
                                                <h4 className={styles.productsTitle}>{t.program.set}</h4>
                                                <div className={styles.productsGrid}>
                                                    {programData.products?.map((product: any) => (
                                                        <div key={product.id} className={styles.productMini}>
                                                            <div className={styles.productIcon} style={{ background: '#fff', border: 'none', boxShadow: 'none' }}>
                                                                <Image
                                                                    src={product.image || "/product_bottle.png"}
                                                                    alt={product.name}
                                                                    width={40}
                                                                    height={40}
                                                                    style={{ objectFit: 'contain' }}
                                                                />
                                                            </div>
                                                            <div className={styles.productInfo}>
                                                                <h4 className={styles.productName}>{product.name}</h4>
                                                                <p className={styles.productPrice}>{product.price}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                ) : (
                                     <motion.div
                                         initial={{ opacity: 0, scale: 0.95 }}
                                         animate={{ opacity: 1, scale: 1 }}
                                         className={styles.emptyState}
                                     >
                                         <div className={`${styles.cardIcon} ${styles.emptyStateIcon}`}>
                                            <Package size={40} />
                                        </div>
                                        <p>{t.program.empty}</p>
                                        <span style={{ fontSize: '0.9rem', color: '#888', textAlign: 'center', maxWidth: '300px', marginBottom: '1rem' }}>
                                            {t.program.quizText}
                                        </span>
                                        <Link href="/quiz" className={styles.primaryActionBtn}>
                                            {t.program.takeQuiz}
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className={styles.ordersTabContent}>
                                {orderHistory.length > 0 ? (
                                    <div className={styles.orderHistoryList}>
                                        {orderHistory.map((order: any) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={styles.orderItem}
                                            >
                                                <button
                                                    className={styles.orderItemHeader}
                                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                >
                                                    <div className={styles.orderHeaderLeft}>
                                                        <div className={styles.orderStatusContainer}>
                                                            <div className={`${styles.orderStatusDot} ${order.status === 'completed' ? styles.statusCompleted : order.status === 'processing' ? styles.statusProcessing : styles.statusPending}`} />
                                                            <span className={styles.orderStatusText}>{t.orders.status[order.status] || t.orders.status.default}</span>
                                                        </div>
                                                        <div className={styles.orderMetaInfo}>
                                                            <span className={styles.orderNumber}>{t.orders.order} #{order.id}</span>
                                                            <span className={styles.orderDate}>
                                                                {new Date(order.date).toLocaleDateString(currentLang === 'RU' ? "ru-RU" : "en-US", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.orderHeaderRight}>
                                                        <span className={styles.orderTotal}>
                                                            {order.total?.toLocaleString('ru-RU')} {t.orders.sum}
                                                        </span>
                                                        <motion.div
                                                            animate={{ rotate: expandedOrder === order.id ? 90 : 0 }}
                                                            className={styles.chevronWrapper}
                                                        >
                                                            <ChevronRight size={20} />
                                                        </motion.div>
                                                    </div>
                                                </button>
                                                <AnimatePresence>
                                                    {expandedOrder === order.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className={styles.orderExpandContent}
                                                            style={{ overflow: 'hidden' }}
                                                        >
                                                            <div className={styles.orderExpandInner}>
                                                                <div className={styles.orderMetaGrid}>
                                                                    <div className={styles.orderMetaItem}>
                                                                        <div className={styles.orderMetaLabel}>{t.orders.method}</div>
                                                                        <div className={styles.orderMetaValue}>
                                                                            <CreditCard size={14} />
                                                                            <span style={{ textTransform: 'uppercase' }}>{order.payment_method || "Payme"}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className={styles.orderMetaItem}>
                                                                        <div className={styles.orderMetaLabel}>{t.orders.time}</div>
                                                                        <div className={styles.orderMetaValue}>
                                                                            <Clock size={14} />
                                                                            <span>
                                                                                {new Date(order.date).toLocaleTimeString(currentLang === 'RU' ? "ru-RU" : "en-US", {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className={styles.orderMetaItem}>
                                                                        <div className={styles.orderMetaLabel}>{t.orders.tariff}</div>
                                                                        <div className={styles.orderMetaValue}>
                                                                            <Package size={14} />
                                                                            <span>{order.products?.length || 1} {t.program.month}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.orderProductsList}>
                                                                    <h4 className={styles.productsListTitle}>{t.orders.composition}</h4>
                                                                    {order.products?.map((product: any, idx: number) => (
                                                                        <div key={idx} className={styles.orderProductItem}>
                                                                            <div className={styles.orderProductImageWrapper}>
                                                                                <Image
                                                                                    src={getProductImage(product.image)}
                                                                                    alt={product.name || "Product"}
                                                                                    width={40}
                                                                                    height={40}
                                                                                    style={{ objectFit: 'contain' }}
                                                                                />
                                                                            </div>
                                                                            <div className={styles.orderProductInfo}>
                                                                                <span className={styles.orderProductName}>{product.productName || product.name}</span>
                                                                                <span className={styles.orderProductPrice}>{product.price ? `${product.price.toLocaleString()} ${t.orders.sum}` : t.orders.inSet}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {order.ai_analysis && (
                                                                    <div className={styles.orderAiAnalysis}>
                                                                        <div className={styles.aiAnalysisHeader}>
                                                                            <Sparkles size={16} />
                                                                            <span>{t.orders.ai}</span>
                                                                        </div>
                                                                        <p className={styles.aiAnalysisText}>{order.ai_analysis}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <Package size={48} />
                                        <p>{t.orders.empty}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "tests" && (
                            <div className={styles.testsTabContent} style={{ fontFamily: 'var(--font-evolventa), sans-serif' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={styles.infoCard}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardIcon}>
                                            <Stethoscope size={20} />
                                        </div>
                                        <h3 className={styles.cardTitle}>
                                            {currentLang === "RU" ? "Вызвать специалиста на дом" : "Mutaxassisni uyga chaqirish"}
                                        </h3>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5, marginBottom: '1.5rem', fontFamily: 'var(--font-evolventa), sans-serif' }}>
                                            {currentLang === "RU"
                                                ? "Наши специалисты приедут к вам в удобное время, возьмут все необходимые анализы и результаты появятся прямо здесь, в вашем личном кабинете."
                                                : "Bizning mutaxassislarimiz sizga qulay vaqtda keladi, barcha kerakli analizlarni oladi va natijalar shaxsiy kabinetingizda paydo bo'ladi."}
                                        </p>

                                        {!user.address && (
                                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontFamily: 'var(--font-evolventa), sans-serif' }}>
                                                {currentLang === "RU" ? "Пожалуйста, укажите ваш адрес в ЛИЧНЫХ ДАННЫХ перед вызовом." : "Iltimos, avval shaxsiy ma'lumotlarda manzilingizni kiriting."}
                                            </div>
                                        )}

                                        <button
                                            className={styles.primaryActionBtn}
                                            disabled={saving || !user.address}
                                            onClick={handleRequestAnalysis}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: (!user.address || saving) ? 0.5 : 1 }}
                                        >
                                            <MapPin size={18} />
                                            <span>{saving ? (currentLang === "RU" ? "Отправка..." : "Yuborilmoqda...") : (currentLang === "RU" ? "Оставить заявку на выезд" : "Chaqirish uchun so'rov qoldirish")}</span>
                                        </button>
                                    </div>
                                </motion.div>

                                <div style={{ marginTop: '3rem', fontFamily: 'var(--font-evolventa), sans-serif' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-evolventa), sans-serif', color: '#1a1a1a', margin: 0 }}>
                                            {currentLang === "RU" ? "Ваши заявки и результаты" : "Sizning so'rovlaringiz va natijalar"}
                                        </h3>
                                        {analysisRequests.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.5rem', background: '#f8fafc', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                {[
                                                    { id: 'all', label: currentLang === 'RU' ? 'Все' : 'Barchasi' },
                                                    { id: 'pending', label: currentLang === 'RU' ? 'Ожидание' : 'Kutilmoqda' },
                                                    { id: 'completed', label: currentLang === 'RU' ? 'Завершены' : 'Bajarildi' }
                                                ].map(tab => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setAnalysisFilter(tab.id)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '8px',
                                                            background: analysisFilter === tab.id ? '#1a1a1a' : 'transparent',
                                                            color: analysisFilter === tab.id ? 'white' : '#666',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            transition: 'all 0.2s ease',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {analysisRequests.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <AnimatePresence mode="popLayout">
                                                {analysisRequests
                                                    .filter(req => analysisFilter === 'all' ? true : req.status === analysisFilter)
                                                    .map((req, idx) => (
                                                        <motion.div
                                                            key={req.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                                                            className={styles.orderItem}
                                                            style={{ border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '16px', overflow: 'hidden' }}
                                                        >
                                                            <button
                                                                className={styles.orderItemHeader}
                                                                style={{ border: 'none', borderRadius: expandedOrder === req.id ? '16px 16px 0 0' : '16px' }}
                                                                onClick={() => setExpandedOrder(expandedOrder === req.id ? null : req.id)}
                                                            >
                                                                <div className={styles.orderHeaderLeft}>
                                                                    <div className={styles.orderStatusContainer}>
                                                                        <div className={`${styles.orderStatusDot} ${req.status === 'completed' ? styles.statusCompleted : req.status === 'scheduled' ? styles.statusProcessing : styles.statusPending}`} />
                                                                        <span className={styles.orderStatusText}>
                                                                            {req.status === 'completed' ? 'Завершено' : req.status === 'scheduled' ? 'Запланировано' : req.status === 'canceled' ? 'Отменено' : 'Ожидание'}
                                                                        </span>
                                                                    </div>
                                                                    <div className={styles.orderMetaInfo}>
                                                                        <span className={styles.orderNumber}>Заявка #{req.id}</span>
                                                                        <span className={styles.orderDate}>
                                                                            {new Date(req.created_at).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.orderHeaderRight}>
                                                                    {req.status === 'completed' && req.result_file_url ? (
                                                                        <a
                                                                            href={getFileUrl(req.result_file_url)}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className={styles.primaryActionBtn}
                                                                            style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            Скачать результат
                                                                        </a>
                                                                    ) : (
                                                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, fontFamily: 'var(--font-evolventa), sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                            <Clock size={14} style={{ opacity: 0.5 }} />
                                                                            {req.status === 'completed' ? "Результаты скоро загрузятся" : "Ожидание специалиста"}
                                                                        </p>
                                                                    )}
                                                                    <motion.div
                                                                        animate={{ rotate: expandedOrder === req.id ? 90 : 0 }}
                                                                        className={styles.chevronWrapper}
                                                                    >
                                                                        <ChevronRight size={20} />
                                                                    </motion.div>
                                                                </div>
                                                            </button>

                                                            <AnimatePresence>
                                                                {expandedOrder === req.id && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className={styles.orderExpandContent}
                                                                    >
                                                                        <div className={styles.orderExpandInner}>
                                                                            <div className={styles.orderMetaGrid} style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                                                                                <div className={styles.orderMetaItem}>
                                                                                    <div className={styles.orderMetaLabel}>Пациент</div>
                                                                                    <div className={styles.orderMetaValue}>
                                                                                        <User size={14} />
                                                                                        <span>{user.full_name || user.username}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className={styles.orderMetaItem}>
                                                                                    <div className={styles.orderMetaLabel}>Адрес выезда</div>
                                                                                    <div className={styles.orderMetaValue}>
                                                                                        <MapPin size={14} />
                                                                                        <span>{req.address || user.address}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className={styles.orderMetaItem}>
                                                                                    <div className={styles.orderMetaLabel}>Телефон пациента</div>
                                                                                    <div className={styles.orderMetaValue}>
                                                                                        <Phone size={14} />
                                                                                        <span>{formatPhoneNumber(user.phone) || "Не указан"}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    ))}
                                                {analysisRequests.filter(req => analysisFilter === 'all' ? true : req.status === analysisFilter).length === 0 && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.emptyState}>
                                                        <Archive size={40} />
                                                        <p style={{ fontFamily: 'var(--font-evolventa), sans-serif' }}>В этой категории нет заявок.</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className={styles.emptyState}>
                                            <Stethoscope size={48} />
                                            <p style={{ fontFamily: 'var(--font-evolventa), sans-serif' }}>{currentLang === "RU" ? "Вы еще не вызывали специалиста" : "Siz hali mutaxassisni chaqirmagansiz"}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Logout Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={styles.logoutSection}
                >
                    <motion.button
                        className={styles.logoutButton}
                        onClick={() => setShowLogoutModal(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {t.logout}
                    </motion.button>
                </motion.div>
            </div>

            {/* Bot QR Modal */}
            <AnimatePresence>
                {showBotModal && (
                    <motion.div
                        className={styles.supportModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowBotModal(false)}
                    >
                        <motion.div
                            className={styles.supportContent}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: '400px', padding: '2.5rem 2rem' }}
                        >
                            <button className={styles.closeBtn} onClick={() => setShowBotModal(false)}><X /></button>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '1.5rem'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    background: 'rgba(196, 151, 160, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#C497A0'
                                }}>
                                    <Bot size={32} />
                                </div>

                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>HESSA Bot</h3>
                                    <p style={{ margin: 0, color: '#666' }}>Сканируйте QR-код для перехода</p>
                                </div>

                                <div style={{
                                    width: '200px',
                                    height: '200px',
                                    background: 'white',
                                    padding: '10px',
                                    borderRadius: '24px',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)',
                                    border: '1px solid #f0f0f0',
                                    position: 'relative'
                                }}>
                                    <Image
                                        src="/qr-code.jpeg"
                                        alt="HESSA Bot QR"
                                        fill
                                        style={{ objectFit: 'contain', padding: '10px' }}
                                    />
                                </div>

                                <button
                                    className={styles.primaryActionBtn}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={() => window.open('https://t.me/hessa_bot', '_blank')}
                                >
                                    <Bot size={18} />
                                    <span>Открыть в Telegram</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Support Modal (Mock) */}
            <AnimatePresence>
                {showSupport && (
                    <motion.div
                        className={styles.supportModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSupport(false)}
                    >
                        <motion.div
                            className={styles.supportContent}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={styles.closeBtn} onClick={() => setShowSupport(false)}><X /></button>
                            <h3>{t.support.title}</h3>
                            <p>{t.support.text}</p>
                            <a href="https://t.me/hessa_uz" target="_blank" className={styles.telegramLink}>
                                {t.support.open}
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Edit Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        className={styles.supportModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            className={styles.supportContent}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ textAlign: 'left', maxWidth: '500px' }}
                        >
                            <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}><X /></button>
                            <h3>{t.personal.edit}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className={styles.editField}>
                                    <label className={styles.cardItemLabel}>{t.personal.name}</label>
                                    <input
                                        className={styles.editInput}
                                        value={editValues.name || ''}
                                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                        placeholder={t.placeholders.name}
                                    />
                                </div>

                                <div className={styles.editField}>
                                    <label className={styles.cardItemLabel}>{t.personal.phone}</label>
                                    <input
                                        className={styles.editInput}
                                        value={editValues.phone || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 9) {
                                                setEditValues({ ...editValues, phone: val });
                                            }
                                        }}
                                        placeholder={t.placeholders.phone}
                                    />
                                    {editValues.phone && (
                                        <p className={styles.editPreview}>
                                            {t.preview} {formatPhoneNumber(editValues.phone)}
                                        </p>
                                    )}
                                </div>

                                <div className={styles.editField}>
                                    <label className={styles.cardItemLabel}>{t.personal.email}</label>
                                    <input
                                        className={styles.editInput}
                                        value={editValues.email || ''}
                                        onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                                        placeholder={t.placeholders?.email || "Email"}
                                    />
                                </div>

                                <div className={styles.editField}>
                                    <label className={styles.cardItemLabel}>{t.personal.address}</label>
                                    <input
                                        className={styles.editInput}
                                        value={editValues.address || ''}
                                        onChange={(e) => setEditValues({ ...editValues, address: e.target.value })}
                                        placeholder={t.personal.address}
                                    />
                                </div>

                                <button
                                    className={styles.primaryActionBtn}
                                    style={{ width: '100%', marginTop: '1rem' }}
                                    onClick={async () => {
                                        setSaving(true);
                                        // Save name
                                        if (editValues.name !== user.full_name) await handleSave('name');
                                        // Save phone
                                        if (editValues.phone !== user.phone) await handleSave('phone');
                                        // Save email
                                        if (editValues.email !== user.email) await handleSave('email');
                                        // Save address
                                        if (editValues.address !== user.address) await handleSave('address');

                                        setSaving(false);
                                        setShowEditModal(false);
                                    }}
                                    disabled={saving}
                                >
                                    {saving ? t.personal.saving : t.personal.save}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        className={styles.supportModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowLogoutModal(false)}
                    >
                        <motion.div
                            className={styles.supportContent}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                                textAlign: 'center', 
                                maxWidth: '400px', 
                                padding: '2.5rem 2rem',
                                borderRadius: '32px'
                            }}
                        >
                            <div style={{ 
                                width: '60px', 
                                height: '60px', 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                borderRadius: '18px',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: '#ef4444'
                            }}>
                                <LogOut size={28} />
                            </div>
                            
                            <h3 style={{ 
                                marginBottom: '1rem', 
                                fontFamily: 'var(--font-evolventa), sans-serif',
                                fontSize: '1.25rem'
                            }}>
                                {t.logoutConfirm.title}
                            </h3>
                            
                            <p style={{ 
                                marginBottom: '2rem', 
                                color: '#64748b',
                                fontSize: '0.95rem',
                                lineHeight: 1.6
                            }}>
                                {t.logoutConfirm.text}
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <button
                                    className={styles.primaryActionBtn}
                                    style={{ 
                                        width: '100%', 
                                        background: '#ef4444'
                                    }}
                                    onClick={() => {
                                        localStorage.removeItem("hessaUser");
                                        window.dispatchEvent(new Event("hessaAuthChange"));
                                        router.push("/");
                                    }}
                                >
                                    {t.logoutConfirm.confirm}
                                </button>
                                <button
                                    className={styles.logoutButton}
                                    style={{ 
                                        width: '100%', 
                                        border: '1.5px solid #e2e8f0',
                                        color: '#64748b',
                                        margin: 0
                                    }}
                                    onClick={() => setShowLogoutModal(false)}
                                >
                                    {t.logoutConfirm.cancel}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Support Chat Button Removed as requested */}

        </div>
    );
}
