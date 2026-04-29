"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { StaticPageForm } from "@/components/dashboard/static-page-form";
import { LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Language = "RU" | "UZ" | "EN";

export default function ContactsAdminPage() {
    const [lang, setLang] = useState<Language>("RU");

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <LayoutTemplate className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Редактор контактов</h1>
            </div>
        ),
        description: "Управление информацией на странице контактов",
        actions: (
            <div className="bg-muted/30 p-1 rounded-xl flex items-center border border-border shadow-none">
                {(['RU', 'UZ', 'EN'] as Language[]).map((l) => (
                    <motion.button
                        key={l}
                        onClick={() => setLang(l)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all min-w-[50px] relative",
                            lang === l
                                ? "text-primary"
                                : "text-muted-foreground hover:bg-background/20 hover:text-foreground"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {lang === l && (
                            <motion.div
                                layoutId="activeLang"
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
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden p-0 h-full bg-muted/30 scrollbar-none">
            <StaticPageForm lang={lang} pageKey="contacts_page" title="Контакты" />
        </div>
    );
}
