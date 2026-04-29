"use client";
import { Bell, MessageCircle, Calendar, User } from "lucide-react";
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

    const actionButtons = [
        { id: "notifications", icon: Bell, href: "/notifications" },
        { id: "support", icon: MessageCircle, href: "/chat" },
        { id: "calendar", icon: Calendar, href: "/calendar" },
    ];

    return (
        <header className="flex items-center justify-between px-6 pt-7 pb-4 bg-transparent shrink-0 z-50 relative">
            {/* Left Section: Avatar */}
            <Link href="/profile" className="relative active:scale-95 transition-transform group">
                <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center transition-all">
                    {user?.photo_url ? (
                        <Image
                            src={user.photo_url}
                            alt="User Avatar"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <User size={22} className="text-gray-300" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Right Section: 3 Circle Buttons */}
            <div className="flex items-center gap-2.5">
                {actionButtons.map((btn) => (
                    <Link 
                        key={btn.id} 
                        href={btn.href}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 active:scale-90 transition-all text-[#1a1a1a]"
                    >
                        <btn.icon size={18} strokeWidth={1.8} />
                    </Link>
                ))}
            </div>
        </header>
    );
}
