"use client";
import { Home, MessageCircle, User, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";
import clsx from "clsx";

export default function BottomNav() {
    const pathname = usePathname();
    const { isOpen: isChatOpen, toggleChat } = useChat();

    const navItems = [
        { id: "home", icon: Home, href: "/", label: "Главная" },
        { id: "calendar", icon: Calendar, href: "/calendar", label: "Трекер" },
        { id: "chat", icon: MessageCircle, href: "/chat", label: "Чат" },
        { id: "profile", icon: User, href: "/profile", label: "Профиль" },
    ];

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center max-w-[260px]">
            <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-full p-1.5 flex items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.25)] w-full">
                {navItems.map((item) => {
                    const isChat = item.id === "chat";
                    const isActive = isChat ? isChatOpen : pathname === item.href;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={(e) => {
                                if (isChat) {
                                    e.preventDefault();
                                    toggleChat();
                                }
                            }}
                            className={clsx(
                                "relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
                                isActive ? "bg-white text-[#1a1a1a]" : "text-white/30 hover:text-white/50"
                            )}
                        >
                            <item.icon
                                size={18}
                                strokeWidth={isActive ? 2 : 1.5}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
