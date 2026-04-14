"use client";
import { Bell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [user, setUser] = useState<{
        first_name?: string;
        last_name?: string;
        photo_url?: string;
        username?: string;
    } | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            const tgUser = (window as any).Telegram.WebApp.initDataUnsafe?.user;
            if (tgUser) {
                setUser(tgUser);
            }
        }
    }, []);

    const getDisplayName = () => {
        if (!user) return "Юзер";
        if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
        if (user.first_name) return user.first_name;
        if (user.username) return user.username;
        return "Юзер";
    };

    return (
        <header className="flex items-center justify-between px-6 pt-5 pb-2 bg-transparent shrink-0 z-50 relative">
            {/* Left Section: Avatar and Greeting */}
            <div className="flex items-center gap-3">
                <Link href="/profile" className="relative active:scale-95 transition-transform group">
                    <div className="w-[42px] h-[42px] rounded-full border border-white/50 overflow-hidden bg-white/40 backdrop-blur-md flex items-center justify-center transition-all shadow-sm">
                        {user?.photo_url ? (
                            <Image
                                src={user.photo_url}
                                alt="User Avatar"
                                width={42}
                                height={42}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={20} className="text-[#C497A0]" />
                        )}
                    </div>
                </Link>
                <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider mb-0.5">
                        Привет
                    </span>
                    <span className="text-[16px] font-bold text-[#1a1a1a] leading-none tracking-tight">
                        {getDisplayName()}
                    </span>
                </div>
            </div>

            {/* Right Section: Bonus Points */}
            <div className="flex items-center">
                <div className="flex items-center gap-1.5 bg-white py-1.5 px-3.5 rounded-full border border-gray-100 active:scale-95 transition-all">
                    <span className="text-[14px] font-black text-[#1C1C1E]">0</span>
                    <div className="flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="11" fill="url(#coinGradient)" />
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
                                <linearGradient id="coinGradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#C497A0" />
                                    <stop offset="1" stopColor="#E5C1C8" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    );
}
