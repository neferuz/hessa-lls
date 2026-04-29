"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { StaticPageForm } from "@/components/dashboard/static-page-form";
import { SquareStack } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Language = "RU" | "UZ" | "EN";

export default function ServicesAdminPage() {
    const [lang, setLang] = useState<Language>("RU");

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <SquareStack className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Редактор услуг</h1>
            </div>
        ),
        description: "Управление списком и описанием предоставляемых услуг",
        actions: (
            <div className="bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-xl flex items-center border border-black/[0.05] shadow-none">
                {(['RU', 'UZ', 'EN'] as Language[]).map((l) => (
                    <motion.button
                        key={l}
                        onClick={() => setLang(l)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all min-w-[50px] relative",
                            lang === l
                                ? "text-primary"
                                : "text-muted-foreground/40 hover:text-muted-foreground"
                        )}
                    >
                        {lang === l && (
                            <motion.div
                                layoutId="activeServLang"
                                className="absolute inset-0 bg-white dark:bg-white/10 rounded-lg shadow-none"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{l}</span>
                    </motion.button>
                ))}
            </div>
        )
    });
    return (
        <>
            <div className="w-full overflow-y-auto overflow-x-hidden p-0 h-full bg-muted/30 scrollbar-none">
                <StaticPageForm lang={lang} pageKey="services_page" title="Наши услуги" />
            </div>
        </>
    );
}
