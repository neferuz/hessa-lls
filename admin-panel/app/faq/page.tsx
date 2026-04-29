"use client";

import { useState, useEffect } from "react";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Plus, Trash2, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqAdminPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <HelpCircle className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Управление FAQ</h1>
            </div>
        ),
        description: "Редактирование часто задаваемых вопросов и ответов на всех языках"
    });
    const [faq, setFaq] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFaq();
    }, []);

    const fetchFaq = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/content`);
            if (res.ok) {
                const data = await res.json();
                if (data.faq) setFaq(data.faq);
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const currentRes = await fetch(`${API_BASE_URL}/api/content`);
            const currentContent = await currentRes.json();
            const res = await fetch(`${API_BASE_URL}/api/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...currentContent, faq }),
            });
            if (res.ok) toast.success("FAQ сохранено");
            else throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    const addFaq = () => setFaq([...faq, { question: "", question_uz: "", question_en: "", answer: "", answer_uz: "", answer_en: "" }]);
    const removeFaq = (idx: number) => setFaq(faq.filter((_, i) => i !== idx));
    const updateFaq = (idx: number, f: string, v: any) => {
        const n = [...faq];
        n[idx] = { ...n[idx], [f]: v };
        setFaq(n);
    };

    if (loading) return <div className="flex items-center justify-center p-20 w-full h-full"><Loader2 className="size-6 animate-spin text-primary/30" /></div>;

    return (
        <>

            <div className="flex-1 overflow-y-auto scrollbar-none p-5 sm:p-8 w-full bg-[#f8f8f9] dark:bg-[#000000]">
                <div className="max-w-4xl mx-auto space-y-6 pb-32">
                    <AnimatePresence>
                        {faq.map((item, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                                <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-4 shadow-none relative group">
                                    <button onClick={() => removeFaq(idx)} className="absolute top-4 right-4 size-8 rounded-xl bg-red-500/5 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="size-4" /></button>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1"><Label className="text-[10px] font-bold opacity-30 ml-1">ВОПРОС (RU)</Label><Input value={item.question} onChange={(e) => updateFaq(idx, 'question', e.target.value)} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-bold" /></div>
                                            <div className="space-y-1"><Label className="text-[10px] font-bold opacity-30 ml-1">ANSWER (RU)</Label><Textarea value={item.answer} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} className="min-h-[80px] bg-black/[0.02] border-0 rounded-lg text-[12px]" /></div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <Button onClick={addFaq} variant="outline" className="w-full h-12 rounded-2xl border-dashed border-black/10 bg-white dark:bg-white/5 text-muted-foreground hover:bg-black/[0.02] transition-all shadow-none"><Plus className="size-4 mr-2" /> Добавить вопрос</Button>
                </div>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[280px]">
                <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.1] rounded-full p-1.5 flex items-center gap-1 shadow-none">
                    <div className="flex-1 px-3 flex items-center gap-2">
                        <div className={cn("size-2 rounded-full", saving ? "bg-amber-500 animate-pulse" : "bg-green-500")} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/50">{saving ? "Сохранение" : "Готово"}</span>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="h-8 px-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-[10px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all gap-1.5 shrink-0 border-0 shadow-none">
                        {saving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3.5" />}
                        Сохранить
                    </Button>
                </div>
            </div>
        </>
    );
}
