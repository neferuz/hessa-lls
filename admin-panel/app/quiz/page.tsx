"use client";

import { useState, useEffect } from "react";
import { 
    Plus, 
    HelpCircle, 
    BrainCircuit,
    Loader2, 
    Trash2, 
    Pencil, 
    RefreshCw, 
    Search,
    ChevronRight,
    FileText,
    ListTodo,
    GripVertical,
    Archive,
    Save,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { API_BASE_URL } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface QuizOption {
    id: string;
    text: string;
    text_uz?: string;
    text_en?: string;
}

interface QuizQuestion {
    id: string;
    section: string;
    section_uz?: string;
    section_en?: string;
    label: string;
    label_uz?: string;
    label_en?: string;
    type: "input" | "options";
    placeholder?: string;
    placeholder_uz?: string;
    placeholder_en?: string;
    options?: QuizOption[];
    gender?: "both" | "male" | "female";
    multiple?: boolean;
    order: number;
}

export default function QuizPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <BrainCircuit className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Конструктор квизов</h1>
            </div>
        ),
        description: "Управление интерактивными опросами и подбором продуктов"
    });
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterGender, setFilterGender] = useState<string>("all");

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
    const [formData, setFormData] = useState<Partial<QuizQuestion>>({});

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [qToDelete, setQToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/quiz`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            const sorted = (data.questions || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setQuestions(sorted);
        } catch (err) {
            console.error(err);
            toast.error("Не удалось загрузить квиз");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, []);

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (q.section && q.section.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesGender = filterGender === "all" || q.gender === filterGender || q.gender === "both";
        return matchesSearch && matchesGender;
    });

    const handleOpenDrawer = (q: QuizQuestion | null = null) => {
        if (q) {
            setEditingQuestion(q);
            setFormData({ ...q });
        } else {
            setEditingQuestion(null);
            setFormData({
                id: `question-${Date.now()}`,
                label: "",
                type: "options",
                gender: "both",
                options: [],
                order: questions.length
            });
        }
        setIsDrawerOpen(true);
    };

    const handleSaveQuiz = async (updatedQuestions: QuizQuestion[]) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/quiz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions: updatedQuestions }),
            });
            return res.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!formData.label) {
            toast.warning("Введите текст вопроса");
            return;
        }

        setIsSubmitting(true);
        const updatedQuestions = editingQuestion
            ? questions.map(q => q.id === editingQuestion.id ? (formData as QuizQuestion) : q)
            : [...questions, formData as QuizQuestion];

        const success = await handleSaveQuiz(updatedQuestions);
        if (success) {
            setQuestions(updatedQuestions);
            setIsDrawerOpen(false);
            toast.success(editingQuestion ? "Вопрос обновлен" : "Вопрос добавлен");
        } else {
            toast.error("Ошибка при сохранении");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async () => {
        if (!qToDelete) return;
        setIsDeleting(true);
        const updatedQuestions = questions.filter(q => q.id !== qToDelete.id);
        const success = await handleSaveQuiz(updatedQuestions);
        if (success) {
            setQuestions(updatedQuestions);
            setIsDeleteDialogOpen(false);
            toast.success("Вопрос удален");
        } else {
            toast.error("Ошибка при удалении");
        }
        setIsDeleting(false);
        setQToDelete(null);
    };

    const handleReorder = async (newOrder: QuizQuestion[]) => {
        const reordered = newOrder.map((q, idx) => ({ ...q, order: idx }));
        setQuestions(reordered);
        await handleSaveQuiz(reordered);
    };

    const stats = [
        { label: "Всего вопросов", value: questions.length, icon: HelpCircle, color: "text-[#007aff]" },
        { label: "С вариантами", value: questions.filter(q => q.type === 'options').length, icon: ListTodo, color: "text-purple-500" },
        { label: "Текстовые", value: questions.filter(q => q.type === 'input').length, icon: FileText, color: "text-amber-500" },
    ];

    return (
        <>

            {/* Toolbar - Command Center Style */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto text-left">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <HelpCircle className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">База вопросов</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {questions.length}
                            </Badge>
                        </div>
                        
                        <div className="sm:hidden flex items-center gap-2">
                            <Button onClick={() => handleOpenDrawer()} size="sm" className="h-8 w-8 p-0 rounded-full bg-black dark:bg-white text-white dark:text-black">
                                <Plus className="size-4" strokeWidth={2.5} />
                            </Button>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative group flex-1 sm:w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск вопросов..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
                            />
                        </div>
                        
                        <div className="flex items-center gap-1 p-0.5 bg-black/5 dark:bg-white/10 rounded-xl">
                            {["all", "male", "female"].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setFilterGender(g)}
                                    className={cn(
                                        "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                        filterGender === g 
                                            ? "bg-white dark:bg-[#1c1c1e] text-primary shadow-sm" 
                                            : "text-muted-foreground/60 hover:text-muted-foreground"
                                    )}
                                >
                                    {g === "all" ? "Все" : g === "male" ? "М" : "Ж"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={fetchQuiz}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-none"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Button onClick={() => handleOpenDrawer()} size="sm" className="h-9 px-5 rounded-full text-[13px] font-bold shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none active:scale-95">
                        <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Добавить вопрос
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {stats.map((s) => (
                            <div key={s.label} className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left shadow-none hover:border-black/10 dark:hover:border-white/20">
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className={cn("size-8 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5", s.color)}>
                                        <s.icon className="size-4" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-semibold tracking-tight mb-0.5 whitespace-nowrap">{s.label}</p>
                                    <div className="flex items-baseline gap-1">
                                        <AnimatedNumber value={s.value} className="text-[18px] sm:text-[20px] font-black tracking-tight tabular-nums" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Questions Container */}
                    <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 shadow-none">
                        <div className="hidden sm:block">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                                    <tr>
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 w-10"></th>
                                        <th className="py-3 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Вопрос</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Параметры</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Тип</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        <Reorder.Group 
                            axis="y" 
                            values={filteredQuestions} 
                            onReorder={handleReorder}
                            className="divide-y divide-black/5 dark:divide-white/10"
                        >
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse h-16 bg-black/5 dark:bg-white/5 mx-5 my-2 rounded-xl" />
                                ))
                            ) : filteredQuestions.map((q) => (
                                <Reorder.Item 
                                    key={q.id} 
                                    value={q}
                                    className="h-16 group/row bg-white dark:bg-[#1c1c1e] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer flex items-center"
                                    onClick={() => handleOpenDrawer(q)}
                                >
                                    <div className="py-2.5 px-5 shrink-0 cursor-grab active:cursor-grabbing">
                                        <GripVertical className="size-4 text-muted-foreground/20 group-hover/row:text-muted-foreground/40" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 flex items-center gap-3">
                                        <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                                            {q.type === 'options' ? <ListTodo className="size-4.5" /> : <FileText className="size-4.5" />}
                                        </div>
                                        <div className="flex flex-col min-w-0 text-left">
                                            <span className="text-[13px] font-bold text-foreground group-hover/row:text-primary transition-colors truncate pr-4">{q.label}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 uppercase tracking-widest tabular-nums">#{q.id.split('-').pop()}</span>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-2 px-4 shrink-0">
                                        <Badge variant="outline" className={cn(
                                            "h-5 px-2 text-[9px] font-black uppercase tracking-widest border-0 rounded-full",
                                            q.gender === 'male' ? "bg-cyan-500/10 text-cyan-600" : q.gender === 'female' ? "bg-rose-500/10 text-rose-600" : "bg-slate-500/10 text-slate-600"
                                        )}>
                                            {q.gender === 'male' ? "Мужской" : q.gender === 'female' ? "Женский" : "Общий"}
                                        </Badge>
                                        {q.multiple && (
                                            <Badge variant="outline" className="h-5 px-2 text-[9px] font-black uppercase tracking-widest border-0 rounded-full bg-indigo-500/10 text-indigo-600">
                                                Множ
                                            </Badge>
                                        )}
                                        {q.type === 'options' && (
                                            <Badge variant="outline" className="h-5 px-2 text-[9px] font-black uppercase tracking-widest border-0 rounded-full bg-black/5 dark:bg-white/10 text-muted-foreground">
                                                {q.options?.length || 0} отв.
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="hidden sm:flex items-center justify-center w-32 shrink-0">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                            q.type === 'input' ? "text-amber-500 bg-amber-500/5" : "text-purple-500 bg-purple-500/5"
                                        )}>
                                            {q.type === 'input' ? "Текст" : "Выбор"}
                                        </span>
                                    </div>

                                    <div className="pr-5 shrink-0 ml-auto">
                                        <ChevronRight className="size-4 opacity-20 group-hover/row:opacity-100 transition-all" />
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {filteredQuestions.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Archive className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-semibold tracking-tight mb-2">Вопросы не найдены</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed">
                                    По вашему запросу ничего не найдено.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Detail Drawer */}
            <AnimatePresence mode="wait">
                {isDrawerOpen && (
                    <>
                        <motion.div
                            key="drawer-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            key="drawer-content"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-[#1c1c1e] z-[101] shadow-2xl flex flex-col text-left border-l border-black/5 dark:border-white/5"
                        >
                            {/* Compact Header */}
                            <div className="p-4 px-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-xl sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                        {editingQuestion ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-bold tracking-tight">
                                            {editingQuestion ? "Редактировать" : "Новый вопрос"}
                                        </h2>
                                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                            {editingQuestion ? `ID: #${editingQuestion.id.split('-').pop()}` : "Квиз-система"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="rounded-full size-8 hover:bg-black/5 dark:hover:bg-white/5"
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 py-5 space-y-6 scrollbar-none">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Вопрос (RU)</Label>
                                        <Textarea
                                            value={formData.label || ""}
                                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                            placeholder="Введите вопрос..."
                                            className="min-h-[70px] p-3.5 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-xl text-[13px] font-bold focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Тип ответа</Label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                                className="h-10 w-full rounded-xl border-0 bg-black/[0.03] dark:bg-white/[0.03] px-3 py-1 text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                                            >
                                                <option value="options">Варианты</option>
                                                <option value="input">Текст</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Для кого</Label>
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                                className="h-10 w-full rounded-xl border-0 bg-black/[0.03] dark:bg-white/[0.03] px-3 py-1 text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                                            >
                                                <option value="both">Для всех</option>
                                                <option value="male">Мужчины</option>
                                                <option value="female">Женщины</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5">
                                        <input
                                            type="checkbox"
                                            id="drawer-multiple"
                                            checked={formData.multiple || false}
                                            onChange={(e) => setFormData({ ...formData, multiple: e.target.checked })}
                                            className="size-4 rounded-full accent-primary"
                                        />
                                        <Label htmlFor="drawer-multiple" className="text-[11px] font-bold text-foreground/70 cursor-pointer">Множественный выбор</Label>
                                    </div>

                                    {formData.type === 'options' && (
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">Варианты ответов</Label>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => {
                                                        const opts = [...(formData.options || [])];
                                                        opts.push({ id: `opt-${Date.now()}`, text: "" });
                                                        setFormData({ ...formData, options: opts });
                                                    }}
                                                    className="h-6 px-2 rounded-lg text-[10px] font-black uppercase text-primary hover:bg-primary/5"
                                                >
                                                    Добавить
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {(formData.options || []).map((opt, idx) => (
                                                    <div key={opt.id} className="flex gap-2 group/opt">
                                                        <Input
                                                            value={opt.text}
                                                            onChange={(e) => {
                                                                const opts = [...formData.options!];
                                                                opts[idx].text = e.target.value;
                                                                setFormData({ ...formData, options: opts });
                                                            }}
                                                            placeholder={`Вариант ${idx + 1}`}
                                                            className="h-9 px-3 bg-black/[0.03] dark:bg-white/[0.03] border-0 rounded-lg text-[12px] font-semibold"
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                const opts = formData.options!.filter(o => o.id !== opt.id);
                                                                setFormData({ ...formData, options: opts });
                                                            }}
                                                            className="h-9 w-9 text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/5 rounded-lg shrink-0 opacity-0 group-hover/opt:opacity-100 transition-all"
                                                        >
                                                            <X className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 px-6 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-xl shrink-0">
                                <div className="flex gap-2">
                                    {editingQuestion && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setQToDelete(editingQuestion);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                            className="h-11 w-11 shrink-0 rounded-full text-red-500 hover:bg-red-500/5 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 h-11 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-[13px] shadow-xl shadow-black/5 active:scale-[0.98] transition-all gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                        {editingQuestion ? "Сохранить изменения" : "Создать вопрос"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Удалить вопрос?"
                description={`Вы собираетесь удалить вопрос "${qToDelete?.label}". Это действие необратимо.`}
            />
        </>
    );
}
