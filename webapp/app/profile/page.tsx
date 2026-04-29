"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    HelpCircle,
    Info,
    Crown,
    Stethoscope,
    Package,
    ChevronRight,
    Settings,
    User as UserIcon,
    Gift,
    Zap,
    Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useOrdersSheet } from "@/contexts/OrdersSheetContext";
import { useSupportSheet } from "@/contexts/SupportSheetContext";
import { useAboutSheet } from "@/contexts/AboutSheetContext";
import { useAnalysisSheet } from "@/contexts/AnalysisSheetContext";
import BottomNav from "@/components/BottomNav";
import clsx from "clsx";

function ProfileContent() {
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
        daysLeft: 24
    });

    useEffect(() => {
        try {
            const paramName = searchParams.get("name");
            const paramPhone = searchParams.get("phone");
            
            if (paramName || paramPhone) {
                setUser(prev => ({
                    ...prev,
                    name: paramName || prev.name,
                    phone: paramPhone || prev.phone
                }));
            }

            const tg = (window as any).Telegram?.WebApp;
            if (tg && tg.initDataUnsafe?.user) {
                const tgUser = tg.initDataUnsafe.user;
                const firstName = tgUser.first_name || "";
                const lastName = tgUser.last_name || "";
                const fullName = `${firstName} ${lastName}`.trim() || "Пользователь";
                const photoUrl = tgUser.photo_url || "";

                setUser(prev => ({
                    ...prev,
                    name: paramName || fullName,
                    photo: photoUrl,
                }));
            }
        } catch (e) {
            console.log("Error loading user profile context", e);
        }
    }, [searchParams]);

    const menuItems = [
        { id: "orders", icon: Package, label: "Мои заказы", color: "text-[#C497A0]" },
        { id: "analysis", icon: Stethoscope, label: "Анализы на дому", color: "text-[#C497A0]" },
        { id: "support", icon: HelpCircle, label: "Помощь и поддержка", color: "text-gray-400" },
        { id: "settings", icon: Settings, label: "Настройки", color: "text-gray-400" },
        { id: "about", icon: Info, label: "О Hessa", color: "text-gray-400" },
    ];

    const handleShare = () => {
        const text = "Дарю тебе скидку 20% на умные витамины Hessa! Забирай по ссылке 👇";
        const url = "https://t.me/hessa_health_bot?start=hessa_user_777";
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

        if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            (window as any).Telegram.WebApp.openTelegramLink(shareUrl);
        } else {
            window.open(shareUrl, "_blank");
        }
    };

    return (
        <main className="min-h-screen bg-transparent max-w-md mx-auto relative overflow-x-hidden flex flex-col font-manrope text-[#1a1a1a]">
            {/* Decorative Background Elements */}
            <div className="absolute top-[10%] left-[-10%] w-64 h-64 bg-[#C497A0]/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-80 h-80 bg-[#C497A0]/8 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 px-6 flex-1">
                <h1 className="text-[24px] font-bold leading-[1.1] text-[#1a1a1a] tracking-tight mb-6 mt-10">
                    Личный кабинет
                </h1>

                {/* Profile Header Card */}
                <div className="bg-white rounded-[32px] p-6 border border-gray-100 flex items-center gap-5 mb-8">
                    <div className="relative w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                        {user.photo ? (
                            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon size={32} className="text-gray-200" />
                        )}
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#C497A0] flex items-center justify-center border-2 border-white shadow-sm">
                            <Crown size={10} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold text-[#1a1a1a] leading-tight mb-0.5">{user.name}</h2>
                        <p className="text-[12px] font-bold text-[#C497A0] uppercase tracking-wider">{user.plan}</p>
                        {user.phone && <p className="text-[11px] font-medium text-gray-400 mt-0.5">{user.phone}</p>}
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { icon: Star, val: "12", label: "Стрик", color: "text-[#C497A0]" },
                        { icon: Package, val: "3", label: "Заказа", color: "text-blue-500" },
                        { icon: Zap, val: "0", label: "Бонусы", color: "text-orange-500" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-[24px] p-4 flex flex-col items-center text-center">
                            <stat.icon size={18} className={clsx(stat.color, "mb-2")} fill={stat.icon === Star || stat.icon === Zap ? "currentColor" : "none"} />
                            <span className="text-[16px] font-bold text-[#1a1a1a] leading-none mb-1">{stat.val}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Referral Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="w-full bg-[#1a1a1a] p-5 rounded-[28px] flex items-center justify-between mb-8 relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-[#C497A0] flex items-center justify-center text-white">
                            <Gift size={20} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[14px] font-bold text-white uppercase tracking-tight mb-0.5">Приведи друга</h4>
                            <p className="text-[10px] text-white/40 font-medium">Получите бонусы вместе</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-white relative z-10" />
                </motion.button>

                {/* Menu List */}
                <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden mb-12">
                    {menuItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === "orders") openOrders();
                                else if (item.id === "analysis") openAnalysis();
                                else if (item.id === "support") openSupport();
                                else if (item.id === "about") openAbout();
                            }}
                            className={clsx(
                                "w-full h-[60px] px-6 flex items-center justify-between active:bg-gray-50 transition-colors",
                                index !== menuItems.length - 1 && "border-b border-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={item.color} strokeWidth={2} />
                                <span className="font-bold text-[#1a1a1a] text-[15px]">{item.label}</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-200" strokeWidth={3} />
                        </button>
                    ))}
                </div>

                {/* Footer Credit */}
                <div className="pb-32 pt-0 flex flex-col items-center justify-center opacity-60">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">
                        powered by <span className="text-[#C497A0]">pixel studio</span>
                    </p>
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#C497A0]/40 to-transparent mt-1.5" />
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
