"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="px-6 pt-2 pb-4">
            <h1 className="text-[28px] font-bold leading-[1.1] text-[#1a1a1a] tracking-tight mb-6 max-w-[250px]">
                Найдите свой идеальный набор
            </h1>

            <div className="relative bg-white rounded-[32px] p-6 border border-gray-100 overflow-hidden group">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="text-[42px] font-bold text-[#1a1a1a] leading-none mb-1">12+</div>
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Дней курса</p>
                    </div>
                    <Link href="/profile" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a1a] active:scale-90 transition-all">
                        <ArrowUpRight size={22} />
                    </Link>
                </div>

                {/* Sub-card/Status section */}
                <div className="bg-[#fcf5f6] rounded-[24px] p-3.5 flex items-center justify-between border border-[#C497A0]/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#C497A0]/5">
                            <Activity size={20} className="text-[#C497A0]" />
                        </div>
                        <div>
                            <h4 className="text-[14px] font-bold text-[#1a1a1a]">Мой прогресс</h4>
                            <p className="text-[11px] font-medium text-gray-400">85% завершено</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                </div>

                {/* Decorative element */}
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#C497A0]/5 blur-3xl rounded-full pointer-events-none" />
            </div>
        </section>
    );
}
