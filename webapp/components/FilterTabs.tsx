"use client";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import { Activity, Zap, Droplets, Wind, Brain, Heart, User, Sparkles } from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface FilterTabsProps {
    active: string;
    setActive: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
    "Все товары": Activity,
    "Иммунитет и энергия": Zap,
    "Здоровье крови": Droplets,
    "Нервная система": Wind,
    "Сердце и мозг": Brain,
    "Женское здоровье": Sparkles,
    "Мужской набор": User,
    "Фигура и метаболизм": Heart,
};

const DEFAULT_CATEGORIES = ["Все товары"];

export default function FilterTabs({ active, setActive }: FilterTabsProps) {
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/categories`);
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data: Category[] = await res.json();
                const fetchedNames = data.map(cat => cat.name);
                const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...fetchedNames]));
                setCategories(merged);
            } catch (error) {
                setCategories(DEFAULT_CATEGORIES);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="px-6 mb-8">
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-32 h-9 shrink-0 bg-gray-50 rounded-full animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 relative z-10 font-manrope">
            <div className="px-6 flex items-center justify-between mb-4">
                <h3 className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">Выберите набор</h3>
                <div className="flex items-center gap-1.5">
                    <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-gray-100 active:scale-90 transition-all text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-gray-100 active:scale-90 transition-all text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="21" y2="21"/><line x1="4" x2="20" y1="3" y2="3"/><line x1="12" x2="12" y1="21" y2="3"/></svg>
                    </button>
                </div>
            </div>

            <div className="px-6 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 min-w-max pb-2">
                    {categories.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat] || Zap;
                        const isActive = active === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={clsx(
                                    "relative px-4 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                                    isActive ? "text-[#C497A0]" : "text-[#94a3b8] hover:text-[#1a1a1a]"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-[#C497A0]/10 rounded-full"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                <div className="relative z-10 flex items-center gap-2">
                                    <Icon
                                        size={15}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className="transition-colors duration-300"
                                    />
                                    <span className={clsx(
                                        "text-[13px] whitespace-nowrap tracking-tight transition-all duration-300",
                                        isActive ? "font-bold" : "font-medium"
                                    )}>
                                        {cat}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
