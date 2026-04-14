"use client";
import { Home, ShoppingCart, MessageCircle, User, Brain, Calendar, ScanLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useChat } from "@/contexts/ChatContext";
import { useCartSheet } from "@/contexts/CartSheetContext";
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] px-3 py-2.5 flex items-center justify-between border border-white/40 shadow-none w-full max-w-[280px]">
                {navItems.map((item) => {
                    const isChat = item.id === "chat";

                    const isActive = isChat
                        ? isChatOpen
                        : pathname === item.href;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={(e) => {
                                if (isChat) {
                                    e.preventDefault();
                                    toggleChat();
                                } else if (item.id === "scanner") {
                                    e.preventDefault();
                                    // Trigger Telegram Scanner
                                    const telegram = (window as any).Telegram?.WebApp;
                                    if (telegram) {
                                        if (telegram.isVersionAtLeast('6.4')) {
                                            telegram.showScanQrPopup({
                                                text: "Отсканируйте QR-код на сайте для входа"
                                            }, async (text: string) => {
                                                if (text) {
                                                    // Handle scan result - assume it's the token
                                                    try {
                                                        const user = telegram.initDataUnsafe?.user;
                                                        await fetch(`https://assembly-nasa-carried-hope.trycloudflare.com/api/auth/qr/authorize`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                token: text,
                                                                telegram_id: user?.id?.toString(),
                                                                username: user?.username,
                                                                full_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                                                            })
                                                        });
                                                        telegram.closeScanQrPopup();
                                                        telegram.showAlert("Вход выполнен успешно!");
                                                    } catch (err) {
                                                        telegram.showAlert("Ошибка при авторизации");
                                                    }
                                                }
                                                return true;
                                            });
                                        } else {
                                            telegram.showAlert("Ваша версия Telegram (" + telegram.version + ") слишком старая для работы сканера. Пожалуйста, обновите Telegram до версии 6.4 или выше.");
                                        }
                                    }
                                }
                            }}
                            className={clsx(
                                "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                                isActive ? "bg-[#C497A0] translate-y-[-4px] shadow-none" : "hover:bg-black/5"
                            )}
                        >
                            <item.icon
                                size={22}
                                strokeWidth={isActive ? 2.3 : 1.5}
                                className={isActive ? "text-white" : "text-[#1a1a1a]/40"}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
