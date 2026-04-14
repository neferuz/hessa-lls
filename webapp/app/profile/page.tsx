"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    HelpCircle,
    Info,
    Calendar,
    Crown,
    Stethoscope,
    Package,
    ChevronRight,
    Settings,
    User,
    Gift,
    Share,
    Users,
    Zap,
    Heart,
    Star,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrdersSheet } from "@/contexts/OrdersSheetContext";
import { useSupportSheet } from "@/contexts/SupportSheetContext";
import { useAboutSheet } from "@/contexts/AboutSheetContext";
import { useAnalysisSheet } from "@/contexts/AnalysisSheetContext";
import BottomNav from "@/components/BottomNav";
import clsx from "clsx";

import { Suspense } from "react";

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { openOrders } = useOrdersSheet();
    const { openSupport } = useSupportSheet();
    const { openAbout } = useAboutSheet();
    const { openAnalysis } = useAnalysisSheet();
    const [user, setUser] = useState({
        name: "Пользователь",
        phone: "",
        photo: "",
        plan: "Hessa Premium",
        daysLeft: 24,
        purchaseDate: "10.01.2024"
    });

    useEffect(() => {
        try {
            const tg = (window as any).Telegram?.WebApp;
            if (tg && tg.initDataUnsafe?.user) {
                const tgUser = tg.initDataUnsafe.user;
                const firstName = tgUser.first_name || "";
                const lastName = tgUser.last_name || "";
                const fullName = `${firstName} ${lastName}`.trim() || "Пользователь";
                const photoUrl = tgUser.photo_url || "";

                setUser(prev => ({
                    ...prev,
                    name: fullName,
                    photo: photoUrl,
                }));
            }
        } catch (e) {
            console.log("Not in Telegram WebApp context");
        }
    }, []);

    useEffect(() => {
        const open = searchParams.get("open");
        if (open === "orders") {
            openOrders();
        }
    }, [searchParams, openOrders]);

    const menuItems = [
        { id: "orders", icon: Package, label: "Мои заказы", color: "bg-blue-500/10 text-blue-500" },
        { id: "analysis", icon: Stethoscope, label: "Анализы на дому", color: "bg-[#C497A0]/10 text-[#C497A0]" },
        { id: "support", icon: HelpCircle, label: "Помощь и поддержка", color: "bg-indigo-500/10 text-indigo-500" },
        { id: "settings", icon: Settings, label: "Настройки", color: "bg-gray-500/10 text-gray-500" },
        { id: "about", icon: Info, label: "О Hessa", color: "bg-orange-500/10 text-orange-500" },
    ];

    const generateReferralLink = () => {
        const refId = "hessa_user_777";
        return `https://t.me/hessa_health_bot?start=${refId}`;
    };

    const handleShare = () => {
        const text = "Дарю тебе скидку 20% на умные витамины Hessa! Забирай по ссылке 👇";
        const url = generateReferralLink();
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

        if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            (window as any).Telegram.WebApp.openTelegramLink(shareUrl);
        } else {
            window.open(shareUrl, "_blank");
        }
    };

    return (
        <main className="min-h-screen bg-transparent max-w-lg mx-auto relative overflow-x-hidden flex flex-col font-manrope text-[#1a1a1a]">
            {/* Ambient background accents - subtle but deep */}
            <div className="absolute top-[-5%] right-[-10%] w-[350px] h-[350px] bg-[#C497A0]/10 blur-[120px] rounded-full z-0 opacity-40 pointer-events-none" />
            <div className="absolute top-[30%] left-[-20%] w-[300px] h-[300px] bg-[#C497A0]/5 blur-[100px] rounded-full z-0 opacity-30 pointer-events-none" />

            <div className="relative z-10 flex-1 flex flex-col pt-6 px-6">
                {/* Header Section */}
                <header className="flex items-center justify-between mb-8 px-1">
                    <h1 className="text-[24px] font-bold tracking-tight font-unbounded uppercase text-[#1a1a1a]">Аккаунт</h1>
                    <div className="flex items-center gap-1.5 bg-white py-1.5 px-3.5 rounded-full border border-gray-100 active:scale-95 transition-all">
                        <span className="text-[14px] font-black text-[#1C1C1E]">0</span>
                        <div className="flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="11" fill="url(#coinGradientProfile)" />
                                <text 
                                    x="12" 
                                    y="16" 
                                    fontFamily="Unbounded, sans-serif" 
                                    fontSize="12" 
                                    fontWeight="bold" 
                                    fill="white" 
                                    textAnchor="middle"
                                >H</text>
                                <defs>
                                    <linearGradient id="coinGradientProfile" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#C497A0" />
                                        <stop offset="1" stopColor="#E5C1C8" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </header>

                <div className="flex-1 pb-32">
                    {/* Simplified User Info */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative w-24 h-24 rounded-full bg-white/40 p-1 backdrop-blur-md border border-white/60 mb-4"
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                                {user.photo ? (
                                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-gray-300" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-[#C497A0] border-2 border-white flex items-center justify-center">
                                <Crown size={12} className="text-white" />
                            </div>
                        </motion.div>
                        <h2 className="text-[20px] font-bold font-unbounded uppercase text-[#1a1a1a] mb-1">{user.name}</h2>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{user.plan}</span>
                    </div>

                    {/* Compact Status Dashboard - New */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[24px] p-4 flex flex-col items-center text-center">
                            <Star size={18} className="text-[#C497A0] mb-2" fill="currentColor" />
                            <span className="text-[14px] font-bold font-unbounded leading-none mb-1">12</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Стрик</span>
                        </div>
                        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[24px] p-4 flex flex-col items-center text-center">
                            <Package size={18} className="text-blue-500 mb-2" />
                            <span className="text-[14px] font-bold font-unbounded leading-none mb-1">3</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Заказа</span>
                        </div>
                        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[24px] p-4 flex flex-col items-center text-center">
                            <Zap size={18} className="text-orange-500 mb-2" fill="currentColor" />
                            <span className="text-[14px] font-bold font-unbounded leading-none mb-1">0</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Бонусы</span>
                        </div>
                    </div>

                    {/* Referral Mini-Card - More Professional */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShare}
                        className="w-full bg-[#1a1a1a] p-5 rounded-[32px] flex items-center justify-between group overflow-hidden relative mb-8"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C497A0]/10 blur-3xl rounded-full" />
                        <div className="relative z-10 flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-2xl bg-[#C497A0] flex items-center justify-center text-white">
                                <Gift size={20} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-white uppercase font-unbounded mb-0.5">Приведи друга</h4>
                                <p className="text-[10px] text-white/50 font-medium font-manrope">Получите бонусы вместе</p>
                            </div>
                        </div>
                        <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                            <ChevronRight size={18} />
                        </div>
                    </motion.button>

                    {/* iOS Style Menu - Very Clean */}
                    <div className="bg-white/30 backdrop-blur-md border border-white/60 rounded-[32px] overflow-hidden">
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={item.id}
                                whileTap={{ backgroundColor: "rgba(255,255,255,0.4)" }}
                                onClick={() => {
                                    if (item.id === "orders") openOrders();
                                    else if (item.id === "analysis") openAnalysis();
                                    else if (item.id === "support") openSupport();
                                    else if (item.id === "about") openAbout();
                                }}
                                className={clsx(
                                    "w-full h-[60px] px-6 flex items-center justify-between transition-colors",
                                    index !== menuItems.length - 1 && "border-b border-white/40"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon size={20} className={clsx("opacity-40", item.color.split(" ")[1])} strokeWidth={2} />
                                    <span className="font-bold text-[#1a1a1a] text-[15px] font-manrope">{item.label}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300" strokeWidth={3} />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            <BottomNav />
        </main>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="h-screen bg-transparent flex items-center justify-center font-manrope font-bold text-gray-400">Загрузка...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
