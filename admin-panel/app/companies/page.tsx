"use client";

import { usePageHeader } from "@/components/dashboard/use-page-header";
import { CompaniesForm } from "@/components/dashboard/companies-form";
import { Building2 } from "lucide-react";

export default function CompaniesPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Партнеры Hessa</h1>
            </div>
        ),
        description: "Управление логотипами и ссылками компаний-партнеров"
    });

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 bg-muted/30 scrollbar-none">
                <CompaniesForm />
            </div>
        </div>
    );
}
