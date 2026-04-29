"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Library,
    Package,
    Search,
    RefreshCw,
    Plus,
    FlaskConical,
    ChevronRight,
    Layers,
    Info,
    CheckCircle2,
    Archive,
    Eye,
    EyeOff,
    Trash2,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/config";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Sachet {
    id: number;
    name: string;
    dosage: string;
    description_short: string;
    is_active: boolean;
    cost_price: number;
    image_url: string;
}

export default function SachetsPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Каталог саше</h1>
            </div>
        )
    });
    const [sachets, setSachets] = useState<Sachet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [sachetToDelete, setSachetToDelete] = useState<Sachet | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const router = useRouter();

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/sachets`);
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

    const handleEdit = (sachet: Sachet) => {
        router.push(`/sachets/new?edit=${sachet.id}`);
    };

    const handleToggleStatus = async (e: React.MouseEvent, sachet: Sachet) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${API_BASE_URL}/api/sachets/${sachet.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !sachet.is_active })
            });
            if (res.ok) {
                toast.success(sachet.is_active ? "Саше скрыто" : "Саше активировано");
                fetchData();
            }
        } catch (err) {
            toast.error("Ошибка обновления статуса");
        }
    };

    const openDeleteDialog = (e: React.MouseEvent, sachet: Sachet) => {
        e.stopPropagation();
        setSachetToDelete(sachet);
    };

    const handleDeleteConfirm = async () => {
        if (!sachetToDelete) return;
        
        try {
            setIsDeleting(true);
            const res = await fetch(`${API_BASE_URL}/api/sachets/${sachetToDelete.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Саше удалено");
                fetchData();
                setSachetToDelete(null);
            }
        } catch (err) {
            toast.error("Ошибка при удалении");
        } finally {
            setIsDeleting(false);
        }
    };

    const stats = [
        { label: "Всего саше", value: sachets.length, icon: Library, color: "text-[#007aff]", trend: "В каталоге", isUp: true },
        { label: "Активных", value: sachets.filter(s => s.is_active).length, icon: CheckCircle2, color: "text-green-500", trend: "В наличии", isUp: true },
        { label: "Средняя цена", value: Math.round(sachets.reduce((acc, s) => acc + (s.cost_price || 0), 0) / (sachets.length || 1)), suffix: "UZS", icon: FlaskConical, color: "text-purple-500", trend: "Себестоимость", isUp: false },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5 text-left">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <FlaskConical className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap text-left">Компоненты</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {sachets.length}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0 text-left">
                        <div className="relative group flex-1 sm:w-[260px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск по боксам..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 h-9 w-full text-[12px] font-medium bg-black/5 dark:bg-white/10 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-none"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={fetchData}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-none"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Link href="/sachets/new">
                        <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-medium shadow-none bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-none active:scale-95">
                            <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Добавить
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
                        {stats.map((s) => (
                            <div key={s.label} className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left shadow-none hover:border-black/10 dark:hover:border-white/20">
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className={cn("size-8 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5", s.color)}>
                                        <s.icon className="size-4" />
                                    </div>
                                    <div className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full", s.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500")}>
                                        {s.trend}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-medium tracking-tight mb-0.5 whitespace-nowrap text-left">{s.label}</p>
                                    <div className="flex items-baseline gap-1">
                                        <AnimatedNumber value={s.value} className="text-[18px] sm:text-[20px] font-medium tracking-tight tabular-nums text-left" />
                                        {s.suffix && <span className="text-[10px] font-medium opacity-40 italic">{s.suffix}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Container */}
                    <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 shadow-none text-left">
                        <div className="hidden sm:block">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20 text-left">
                                    <tr>
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Бокс / Набор</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Дозировка</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Описание</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Себестоимость</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center w-28">Статус</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10 text-left">
                                    {loading ? (
                                        [...Array(6)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-24 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-40 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-24 bg-black/5 dark:bg-white/5 rounded-full mx-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredSachets.map((sachet) => (
                                        <tr 
                                            key={sachet.id} 
                                            onClick={() => handleEdit(sachet)}
                                            className="h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
                                        >
                                            <td className="py-2.5 px-5 text-left">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div 
                                                        onClick={(e) => {
                                                            if (sachet.image_url) {
                                                                e.stopPropagation();
                                                                setPreviewImage(sachet.image_url);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "size-10 rounded-xl flex items-center justify-center border border-black/5 overflow-hidden transition-transform active:scale-95",
                                                            sachet.image_url ? "cursor-zoom-in" : "bg-primary/10 text-primary border-primary/10"
                                                        )}
                                                    >
                                                        {sachet.image_url ? (
                                                            <img src={sachet.image_url} alt={sachet.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <FlaskConical className="size-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[13px] font-medium text-foreground group-hover/row:text-primary transition-colors">{sachet.name}</span>
                                                        <span className="text-[10px] font-medium text-muted-foreground/40 mt-0.5 tabular-nums uppercase tracking-widest">ID: {sachet.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 text-left">
                                                <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground/60 text-left">
                                                    <Layers className="size-3.5 opacity-40" />
                                                    {sachet.dosage}
                                                </div>
                                            </td>
                                            <td className="px-4 text-left">
                                                <div className="flex items-center gap-2.5 text-left">
                                                    <div className="size-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5">
                                                        <Info className="size-3 text-muted-foreground/60" />
                                                    </div>
                                                    <span className="text-[12px] font-medium text-foreground/80 truncate max-w-[200px] text-left">
                                                        {sachet.description_short}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <div className="text-[13px] font-medium tabular-nums">
                                                    {(sachet.cost_price || 0).toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground/40 italic text-left">UZS</span>
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <Badge variant="outline" className={cn(
                                                    "h-[22px] px-2.5 text-[9px] font-medium border-0 rounded-md uppercase tracking-wider whitespace-nowrap text-left",
                                                    sachet.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                                                )}>
                                                    <span className={cn("size-1.5 rounded-full mr-1.5 text-left", sachet.is_active ? "bg-green-500" : "bg-red-500")} />
                                                    {sachet.is_active ? "В наличии" : "Скрыт"}
                                                </Badge>
                                            </td>
                                            <td className="pr-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-20 group-hover/row:opacity-100 transition-all">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-36 rounded-xl border-black/5 shadow-2xl">
                                                            <DropdownMenuItem onClick={(e) => handleToggleStatus(e, sachet)} className="text-[11px] font-bold py-2 gap-2 cursor-pointer">
                                                                {sachet.is_active ? <EyeOff className="size-3.5 text-amber-500" /> : <Eye className="size-3.5 text-green-500" />}
                                                                {sachet.is_active ? "Скрыть" : "Показать"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => openDeleteDialog(e, sachet)} className="text-[11px] font-medium py-2 gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50">
                                                                 <Trash2 className="size-3.5" />
                                                                 Удалить
                                                             </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-20 group-hover/row:opacity-100 transition-all">
                                                        <ChevronRight className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10 text-left">
                            {filteredSachets.map((sachet) => (
                                <div key={sachet.id} className="p-4 flex flex-col gap-4 active:bg-black/5 transition-colors text-left" onClick={() => handleEdit(sachet)}>
                                    <div className="flex items-center justify-between text-left">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                                <FlaskConical className="size-5" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-[14px] font-bold">{sachet.name}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground/40">ID: {sachet.id}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn(
                                            "h-[20px] px-2 text-[9px] font-black border-0 rounded-md uppercase tracking-wider text-left",
                                            sachet.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {sachet.is_active ? "В наличии" : "Скрыт"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-left">
                                        <div className="flex items-center gap-2 text-left">
                                            <div className="size-6 rounded-full bg-black/5 flex items-center justify-center">
                                                <Layers className="size-3 text-muted-foreground/60" />
                                            </div>
                                            <span className="text-[12px] font-bold text-muted-foreground/70 text-left">
                                                {sachet.dosage}
                                            </span>
                                        </div>
                                        <div className="text-[14px] font-black tabular-nums text-left">
                                            {(sachet.cost_price || 0).toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground/40 text-left">UZS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredSachets.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Archive className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-semibold tracking-tight mb-2 text-left">Саше не найдены</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed text-left">
                                    По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!sachetToDelete}
                onClose={() => setSachetToDelete(null)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title="Удаление саше"
                description={`Вы уверены, что хотите удалить "${sachetToDelete?.name}"? Это действие нельзя будет отменить.`}
            />

            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-0 shadow-none sm:rounded-[2rem]">
                    <div className="sr-only">
                        <DialogTitle>Предпросмотр изображения</DialogTitle>
                        <DialogDescription>Просмотр полноразмерного фото саше</DialogDescription>
                    </div>
                    {previewImage && (
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-auto object-contain max-h-[80vh] rounded-[1.5rem]" 
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
