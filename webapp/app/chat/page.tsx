"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MoreHorizontal, Bot, Sparkles } from "lucide-react";
import AIChat from "@/components/AIChat";

export default function ChatPage() {
    const router = useRouter();

    return (
        <main className="h-screen bg-white relative max-w-md mx-auto overflow-hidden flex flex-col font-manrope">
            {/* Premium Chat Header */}
            <div className="shrink-0 z-50 bg-white border-b border-gray-100 sticky top-0">
                <div className="px-5 py-4 flex items-center gap-1">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a1a] active:scale-95 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex-1 flex items-center gap-3 pl-2">
                        <div className="w-9 h-9 rounded-full bg-[#fcf5f6] flex items-center justify-center text-[#C497A0] relative border border-[#C497A0]/10">
                            <Bot size={18} />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-[#34C759] rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-0.5">
                            <h1 className="text-[14px] font-black text-[#1a1a1a] leading-none flex items-center gap-1.5 uppercase tracking-tight">
                                HESSA AI
                            </h1>
                            <span className="text-[10px] font-bold text-gray-400 leading-none tracking-wide uppercase">
                                Персональный нутрициолог
                            </span>
                        </div>
                    </div>

                    <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a1a] active:scale-95 transition-all">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>

            <AIChat />
        </main>
    );
}
