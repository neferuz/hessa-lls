"use client";

import { useState, useEffect } from "react";
import { 
    Stethoscope, Clock, ChevronRight, MapPin, X, 
    Upload, FileText, Search, Activity, CheckCircle2, 
    Calendar, ClipboardList, ArrowUpRight, RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface AnalysisRequest {
    id: number;
    user_id: number;
    address: string;
    status: string;
    scheduled_date: string | null;
    result_file_url: string | null;
    doctor_notes: string | null;
    created_at: string;
    completed_at: string | null;
}

const STATUS_CONFIG: Record<string, any> = {
    pending: { label: "Ожидает", color: "text-amber-600", bg: "bg-amber-500/10", dot: "bg-amber-500" },
    scheduled: { label: "В плане", color: "text-blue-600", bg: "bg-blue-500/10", dot: "bg-blue-500" },
    completed: { label: "Готово", color: "text-green-600", bg: "bg-green-500/10", dot: "bg-green-500" },
    canceled: { label: "Отмена", color: "text-red-600", bg: "bg-red-500/10", dot: "bg-red-500" },
};

export default function AnalysisPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Анализы Hessa</h1>
            </div>
        )
    });
    const [requests, setRequests] = useState<AnalysisRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<AnalysisRequest | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [usersMap, setUsersMap] = useState<Record<number, any>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (selectedRequest) {
            fetchUser(selectedRequest.user_id);
        } else {
            setSelectedUser(null);
        }
    }, [selectedRequest]);

    const fetchUser = async (userId: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const [reqRes, usersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/analysis/all`),
                fetch(`${API_BASE_URL}/api/users`)
            ]);

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                const map: Record<number, any> = {};
                usersData.forEach((u: any) => { map[u.id] = u; });
                setUsersMap(map);
            }

            if (reqRes.ok) {
                const data = await reqRes.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (reqId: number, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/analysis/${reqId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                const updated = await res.json();
                setRequests(prev => prev.map(r => r.id === reqId ? updated : r));
                if (selectedRequest?.id === reqId) {
                    setSelectedRequest(updated);
                }
                toast.success("Статус обновлен");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !selectedRequest) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
                method: "POST",
                body: formData
            });

            if (uploadRes.ok) {
                const data = await uploadRes.json();
                const updateRes = await fetch(`${API_BASE_URL}/api/analysis/${selectedRequest.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ result_file_url: data.url })
                });

                if (updateRes.ok) {
                    const updated = await updateRes.json();
                    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? updated : r));
                    setSelectedRequest(updated);
                    toast.success("Результаты загружены");
                }
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    const filteredRequests = requests.filter(r => {
        const user = usersMap[r.user_id];
        const search = searchQuery.toLowerCase();
        return (
            (user?.full_name || "").toLowerCase().includes(search) ||
            (user?.username || "").toLowerCase().includes(search) ||
            (r.address || "").toLowerCase().includes(search) ||
            r.id.toString().includes(search)
        );
    });

    const stats = [
        { label: "Всего заявок", value: requests.length, icon: Stethoscope, color: "text-[#007aff]", trend: "Общий поток", isUp: true },
        { label: "Ожидают", value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: "text-amber-500", trend: "В очереди", isUp: true },
        { label: "В плане", value: requests.filter(r => r.status === 'scheduled').length, icon: Calendar, color: "text-blue-500", trend: "Выезды", isUp: true },
        { label: "Готово", value: requests.filter(r => r.status === 'completed').length, icon: CheckCircle2, color: "text-green-500", trend: "Завершено", isUp: true },
    ];

    const getFileUrl = (url: string | null) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/static')) return `${API_BASE_URL}${url}`;
        const clean = url.startsWith('/') ? url.slice(1) : url;
        return `${API_BASE_URL}/static/${clean}`;
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <Stethoscope className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Анализы на дому</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {requests.length}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0">
                        <div className="relative group flex-1 sm:w-[260px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск заявок..."
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
                        onClick={fetchRequests}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-none"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
                        {stats.map((s) => (
                            <div key={s.label} className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left shadow-none hover:border-black/10 dark:hover:border-white/20">
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className={cn("size-8 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5", s.color)}>
                                        <s.icon className="size-4" />
                                    </div>
                                    <div className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", s.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500")}>
                                        {s.trend}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-semibold tracking-tight mb-0.5 whitespace-nowrap text-left">{s.label}</p>
                                    <div className="flex items-baseline gap-1">
                                        <AnimatedNumber value={s.value} className="text-[18px] sm:text-[20px] font-black tracking-tight tabular-nums" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Container */}
                    <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1c1e] overflow-hidden border border-black/5 dark:border-white/10 shadow-none text-left">
                        <div className="hidden sm:block">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                                    <tr>
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Заявка</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Клиент</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Дата и Адрес</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center w-28">Статус</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                    {loading ? (
                                        [...Array(6)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="h-10 w-32 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-10 w-40 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-full mx-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredRequests.map((req) => {
                                        const user = usersMap[req.user_id];
                                        const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                                        return (
                                            <tr 
                                                key={req.id} 
                                                className="h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
                                                onClick={() => setSelectedRequest(req)}
                                            >
                                                <td className="py-2.5 px-5">
                                                    <div className="flex items-center gap-3 text-left">
                                                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                                            <ClipboardList className="size-5" />
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-[13px] font-bold text-foreground group-hover/row:text-primary transition-colors">#{req.id}</span>
                                                            <span className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 tabular-nums uppercase tracking-widest">Analysis Visit</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4">
                                                    <div className="flex items-center gap-2.5 text-left">
                                                        <div className="size-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 text-[11px] font-black text-muted-foreground/60 uppercase">
                                                            {user?.full_name?.[0] || user?.username?.[0] || '?'}
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-[13px] font-bold text-foreground/80 truncate max-w-[140px]">
                                                                {user?.full_name || user?.username || `User ${req.user_id}`}
                                                            </span>
                                                            <span className="text-[10px] font-medium text-muted-foreground/40">{user?.phone || 'Нет телефона'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4">
                                                    <div className="flex flex-col text-left">
                                                        <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground/60 text-left">
                                                            <Clock className="size-3.5 opacity-40" />
                                                            {new Date(req.created_at).toLocaleDateString("ru-RU")}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 mt-0.5 truncate max-w-[200px] text-left">
                                                            <MapPin className="size-3" />
                                                            {req.address || "Не указан"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 text-center">
                                                    <Badge variant="outline" className={cn(
                                                        "h-[22px] px-2.5 text-[9px] font-black border-0 rounded-md uppercase tracking-wider whitespace-nowrap",
                                                        status.bg, status.color
                                                    )}>
                                                        <span className={cn("size-1.5 rounded-full mr-1.5", status.dot)} />
                                                        {status.label}
                                                    </Badge>
                                                </td>
                                                <td className="pr-5 text-right">
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-20 group-hover/row:opacity-100 transition-all ml-auto">
                                                        <ChevronRight className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                            </table>
                        </div>

                        {filteredRequests.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <ClipboardList className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-semibold tracking-tight mb-2 text-left">Заявок не найдено</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed text-left">
                                    По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска или обновить страницу.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Detail Drawer */}
            <AnimatePresence>
                {selectedRequest && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl z-[61] border-l border-black/5 dark:border-white/10 shadow-2xl flex flex-col text-left"
                        >
                            <div className="p-6 h-20 shrink-0 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                                        <ClipboardList className="size-5" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <h2 className="text-[16px] font-bold tracking-tight">Заявка #{selectedRequest.id}</h2>
                                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Medical Visit</span>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setSelectedRequest(null)}
                                    className="size-10 rounded-full bg-black/5 dark:bg-white/10"
                                >
                                    <X className="size-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-none p-6 space-y-8">
                                {/* Status Flow */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] ml-1">Статус визита</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['pending', 'scheduled', 'completed', 'canceled'].map(s => (
                                            <Button
                                                key={s}
                                                variant="outline"
                                                onClick={() => updateStatus(selectedRequest.id, s)}
                                                className={cn(
                                                    "h-12 rounded-2xl border-0 text-[12px] font-bold transition-all shadow-none",
                                                    selectedRequest.status === s 
                                                        ? (STATUS_CONFIG[s]?.bg + " " + STATUS_CONFIG[s]?.color)
                                                        : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                                                )}
                                            >
                                                <div className={cn("size-1.5 rounded-full mr-2", selectedRequest.status === s ? STATUS_CONFIG[s]?.dot : "bg-muted-foreground/20")} />
                                                {STATUS_CONFIG[s]?.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Customer Card */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] ml-1">Пациент</h3>
                                    <div className="p-4 bg-black/5 dark:bg-white/5 rounded-[1.75rem] flex items-center gap-4 border border-black/5 text-left">
                                        <div className="size-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-black/5 text-[18px] font-black text-primary uppercase">
                                            {selectedUser?.full_name?.[0] || selectedUser?.username?.[0] || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-[15px] font-bold text-foreground truncate">
                                                {selectedUser?.full_name || selectedUser?.username || `User ${selectedRequest.user_id}`}
                                            </p>
                                            <span className="text-[12px] font-medium text-muted-foreground/60 tabular-nums">{selectedUser?.phone || 'Телефон не указан'}</span>
                                        </div>
                                        <Button 
                                            asChild
                                            variant="ghost" 
                                            size="icon" 
                                            className="size-10 rounded-full bg-white dark:bg-zinc-800 border border-black/5"
                                        >
                                            <Link href={`/users/${selectedRequest.user_id}`}>
                                                <ArrowUpRight className="size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Logistics */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] ml-1">Локация забора</h3>
                                    <div className="p-4 bg-black/5 dark:bg-white/5 rounded-[1.5rem] flex items-start gap-4 border border-black/5 text-left">
                                        <div className="size-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-black/5 shrink-0 mt-0.5">
                                            <MapPin className="size-5 text-muted-foreground/60" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[13px] font-bold text-foreground leading-snug">Адрес для забора анализов</span>
                                            <span className="text-[11px] font-medium text-muted-foreground/50 mt-1">{selectedRequest.address || "Не указан"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Section */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] ml-1">Результаты анализа</h3>
                                    
                                    {selectedRequest.result_file_url ? (
                                        <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-[1.75rem] flex flex-col gap-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-green-500/20 text-green-600">
                                                    <FileText className="size-5" />
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[13px] font-bold text-green-700">Файл загружен</span>
                                                    <span className="text-[10px] font-medium text-green-600/60 uppercase tracking-widest">Medical Report PDF</span>
                                                </div>
                                            </div>
                                            <Button 
                                                asChild
                                                className="w-full h-12 bg-white dark:bg-zinc-800 border border-green-500/20 text-green-700 hover:bg-green-50 rounded-2xl font-bold text-[12px] shadow-sm"
                                            >
                                                <a href={getFileUrl(selectedRequest.result_file_url)} target="_blank" rel="noopener noreferrer">
                                                    Открыть документ
                                                </a>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2rem] blur opacity-10"></div>
                                            <div className="relative p-8 border-2 border-dashed border-black/5 dark:border-white/10 rounded-[1.75rem] bg-white dark:bg-[#2c2c2e] flex flex-col items-center justify-center text-center gap-3 group-hover:border-primary/20 transition-all">
                                                <div className="size-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-1">
                                                    <Upload className="size-6 text-muted-foreground/30" />
                                                </div>
                                                <Label htmlFor="results-file" className="text-[13px] font-bold cursor-pointer hover:text-primary transition-colors">
                                                    Загрузить результаты
                                                </Label>
                                                <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">PDF, JPEG до 5 MB</p>
                                                <Input id="results-file" type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                                                {uploading && (
                                                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mt-2">
                                                        <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                        Загрузка...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 h-28 shrink-0 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-t border-black/5 dark:border-white/10 flex items-center">
                                <Button
                                    onClick={() => updateStatus(selectedRequest.id, 'completed')}
                                    className="w-full h-14 bg-[#007aff] hover:bg-[#007aff]/90 text-white rounded-full font-bold text-[14px] shadow-lg shadow-[#007aff]/20 active:scale-95 transition-all"
                                    disabled={selectedRequest.status === 'completed'}
                                >
                                    {selectedRequest.status === 'completed' ? 'Заявка завершена' : 'Завершить виезд'}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
