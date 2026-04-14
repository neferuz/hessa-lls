"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
    const [index, setIndex] = useState(0);
    const phrases = [
        "Здоровье и Эстетика",
        "Природа и Наука",
        "Баланс и Энергия",
        "Красота и Сила"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (
        <section className="px-5 pt-4 pb-2">
            <div className="relative bg-white/60 backdrop-blur-xl rounded-[28px] p-5 flex items-center justify-between overflow-hidden border border-white/80">
                {/* Text Content */}
                <div className="relative z-10 flex-1 pr-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C497A0] mb-2 block">
                        Hessa Care
                    </span>
                    <h1 className="text-[19px] font-bold leading-[1.2] text-[#1a1a1a] tracking-tight font-unbounded uppercase mb-4 text-balance">
                        Твой путь <br/>к здоровью
                    </h1>
                    <Link href="/quiz" className="group flex items-center gap-3 bg-[#C497A0] text-white pl-5 pr-2 py-2 rounded-full active:scale-95 transition-all w-fit shadow-none">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Пройти тест</span>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                            <ArrowRight size={14} strokeWidth={3} className="text-[#C497A0]" />
                        </div>
                    </Link>
                </div>

                {/* Floating Image on Right */}
                <div className="relative w-28 h-28 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C497A0]/10 to-transparent blur-2xl rounded-full" />
                    <Image
                        src="/removemedicince.png"
                        alt="Health"
                        fill
                        className="object-contain animate-float-slow"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
