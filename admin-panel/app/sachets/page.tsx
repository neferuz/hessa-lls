"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Library,
    Search,
    RefreshCw,
    Plus,
    MoreHorizontal,
    Box,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle2,
    FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Sachet {
    id: number;
    name: string;
    dosage: string;
    description_short: string;
    is_active: boolean;
    cost_price: number;
}

export default function SachetsPage() {
    const [sachets, setSachets] = useState<Sachet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [sachetToDelete, setSachetToDelete] = useState<Sachet | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://127.0.0.1:8000/api/sachets');
            const data = await res.json();
            setSachets(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredSachets = sachets.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description_short.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async () => {
        if (!sachetToDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`http://127.0.0.1:8000/api/sachets/${sachetToDelete.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("Компонент удален");
                fetchData();
            } else {
                toast.error("Ошибка при удалении");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сети");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setSachetToDelete(null);
        }
    };

    const handleToggleActive = async (sachet: Sachet, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/sachets/${sachet.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !sachet.is_active })
            });
            if (res.ok) {
                toast.success(sachet.is_active ? "Компонент скрыт" : "Компонент активирован");
                fetchData();
            } else {
                toast.error("Ошибка обновления статуса");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка соединения");
        }
    };

    const handleEdit = (sachet: Sachet) => {
        router.push(`/sachets/new?edit=${sachet.id}`);
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "tween", ease: "easeOut", duration: 0.3 },
        },
    };

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-3">
                                <Library className="size-5 text-muted-foreground" />
                                <h1 className="text-base font-medium tracking-tight">Боксы (Наборы)</h1>
                            </div>
                        }
                        actions={
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchData}
                                    className="h-9 w-9 rounded-full p-0 border-border/50 hover:bg-background"
                                >
                                    <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
                                </Button>
                                <Link href="/sachets/new">
                                    <Button
                                        size="sm"
                                        className="h-9 px-5 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-95"
                                    >
                                        <Plus className="size-4 mr-2 stroke-[2.5]" />
                                        Добавить бокс
                                    </Button>
                                </Link>
                            </div>
                        }
                    />
                    <div className="flex-1 w-full overflow-y-auto">
                        <motion.div
                            className="bg-background/50 p-6 space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Stats Overview */}
                            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5" variants={itemVariants}>
                                {[
                                    { label: "Всего боксов", value: sachets.length, icon: Library, color: "text-primary", bg: "bg-primary/5" },
                                    { label: "Активных", value: sachets.filter(s => s.is_active).length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/5" },
                                    { label: "Средняя стоимость", value: (sachets.reduce((acc, s) => acc + (s.cost_price || 0), 0) / (sachets.length || 1)).toLocaleString('ru-RU') + " UZS", icon: FlaskConical, color: "text-blue-600", bg: "bg-blue-500/5" },
                                ].map((stat, idx) => (
                                    <Card key={idx} className="rounded-2xl border-border/60 bg-card/50 p-5 shadow-none flex items-center justify-between hover:border-border transition-colors">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{stat.label}</p>
                                            <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                                        </div>
                                        <div className={cn("size-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                            <stat.icon className={cn("size-6", stat.color)} />
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>

                            {/* Search and Filters */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="relative flex-1 w-full max-w-md">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Поиск по названию..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-11 rounded-xl bg-card border-border/60 shadow-none focus-visible:ring-1"
                                        />
                                    </div>
                                </div>

                                <Card className="rounded-2xl border-border/60 bg-card overflow-hidden shadow-none">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border/50 bg-muted/20">
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Название</th>
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Дозировка</th>
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Описание (кор.)</th>
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Себестоимость</th>
                                                    <th className="py-4 px-4 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground w-[60px]">Статус</th>
                                                    <th className="py-4 px-6 text-right text-[11px] font-bold uppercase tracking-widest text-muted-foreground w-[100px]"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/40">
                                                {loading ? (
                                                    [...Array(5)].map((_, i) => (
                                                        <tr key={i}>
                                                            <td className="p-6"><div className="h-4 w-48 bg-muted/50 rounded animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-4 w-24 bg-muted/50 rounded animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-4 w-64 bg-muted/50 rounded animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-4 w-20 bg-muted/50 rounded animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-8 w-8 bg-muted/50 rounded mx-auto animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-10 bg-muted/50 rounded" /></td>
                                                        </tr>
                                                    ))
                                                ) : filteredSachets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-24 text-center">
                                                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground max-w-xs mx-auto">
                                                                <div className="size-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-2">
                                                                    <Library className="size-8 opacity-20" />
                                                                </div>
                                                                <h3 className="font-semibold text-lg text-foreground">Боксы не найдены</h3>
                                                                <p className="text-sm text-center">
                                                                    Добавьте свой первый бокс для конструктора.
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <AnimatePresence mode="popLayout">
                                                        {filteredSachets.map((sachet, index) => (
                                                            <motion.tr
                                                                key={sachet.id}
                                                                className="group hover:bg-muted/20 transition-colors cursor-pointer"
                                                                onClick={() => handleEdit(sachet)}
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.03 }}
                                                            >
                                                                <td className="py-4 px-6">
                                                                    <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                                                                        {sachet.name}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-6 whitespace-nowrap">
                                                                    <Badge variant="outline" className="px-2 py-0.5 text-[11px] bg-muted/30 font-mono text-foreground font-medium border-border/50">
                                                                        {sachet.dosage}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-6 text-sm text-muted-foreground line-clamp-1">
                                                                    {sachet.description_short}
                                                                </td>
                                                                <td className="py-4 px-6 text-sm font-medium tabular-nums">
                                                                    {(sachet.cost_price || 0).toLocaleString()} UZS
                                                                </td>
                                                                <td className="py-4 px-4 text-center">
                                                                    <div className="flex justify-center">
                                                                        <div className={cn(
                                                                            "size-2.5 rounded-full",
                                                                            sachet.is_active === false 
                                                                                ? "bg-muted-foreground/30" 
                                                                                : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                                                                        )} title={sachet.is_active === false ? "Неактивен" : "Активен"} />
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={(e) => handleToggleActive(sachet, e)}
                                                                            className={cn(
                                                                                "size-8 rounded-lg transition-all shadow-none",
                                                                                sachet.is_active === false
                                                                                    ? "text-gray-400 hover:text-emerald-600 hover:bg-emerald-500/10"
                                                                                    : "text-emerald-600 hover:text-gray-500 hover:bg-gray-500/10"
                                                                            )}
                                                                            title={sachet.is_active === false ? "Активировать" : "Скрыть"}
                                                                        >
                                                                            {sachet.is_active === false ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                                        </Button>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" size="icon" className="size-9 rounded-lg">
                                                                                    <MoreHorizontal className="size-4 text-muted-foreground" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-48 p-1">
                                                                                <DropdownMenuLabel className="px-2 text-xs text-muted-foreground">Действия</DropdownMenuLabel>
                                                                                <DropdownMenuItem onClick={() => handleEdit(sachet)} className="rounded-lg cursor-pointer">
                                                                                    <Pencil className="size-4 mr-2" />
                                                                                    Редактировать
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem onClick={() => { setSachetToDelete(sachet); setIsDeleteDialogOpen(true); }} className="rounded-lg text-red-600 cursor-pointer">
                                                                                    <Trash2 className="size-4 mr-2" />
                                                                                    Удалить
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </AnimatePresence>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Удалить бокс?"
                description={`Вы уверены, что хотите удалить "${sachetToDelete?.name}"?`}
                confirmText="Удалить"
                cancelText="Отмена"
                variant="destructive"
                isLoading={isDeleting}
            />
        </SidebarProvider>
    );
}
