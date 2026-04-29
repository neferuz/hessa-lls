"use client";

import { useState, useEffect } from "react";
import { 
    Plus, Search, Users, 
    MoreHorizontal, Activity, Star, 
    Edit2, ShieldBan, MessageSquare, Globe, Gift, RefreshCw, Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    username: string;
    email: string;
    phone: string | null;
    full_name: string | null;
    telegram_id: string | null;
    tokens: number;
    is_active: boolean;
    created_at: string;
}

const STATUS_CONFIG = {
    Active: { label: "Активен", color: "text-green-600", bg: "bg-green-500/10", dot: "bg-green-500" },
    Suspended: { label: "В бане", color: "text-red-500", bg: "bg-red-500/10", dot: "bg-red-500" },
};

function CreateUserForm({ newUser, setNewUser, onSubmit, onCancel }: any) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4 text-left">
            <div className="space-y-3">
                <div className="space-y-1 text-left">
                    <Label className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/30 ml-1">ФИО клиента</Label>
                    <Input 
                        required
                        placeholder="Имя Фамилия" 
                        className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-zinc-800 transition-all shadow-none text-[13px] font-medium"
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/30 ml-1">Телефон</Label>
                        <Input 
                            required
                            placeholder="+998" 
                            className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-zinc-800 transition-all shadow-none text-[13px] font-medium"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/30 ml-1">Email</Label>
                        <Input 
                            required
                            placeholder="mail@example.com" 
                            className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-zinc-800 transition-all shadow-none text-[13px] font-medium"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2.5 pt-4">
                <Button 
                    type="button"
                    variant="ghost" 
                    className="flex-1 rounded-full h-12 font-bold text-[14px] hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={onCancel}
                >
                    Отмена
                </Button>
                <Button 
                    type="submit"
                    className="flex-1 rounded-full h-12 font-black text-[14px] bg-black dark:bg-white text-white dark:text-black transition-all active:scale-95 shadow-none"
                >
                    Создать клиента
                </Button>
            </div>
        </form>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const router = useRouter();

    usePageHeader({
        title: (
            <div className="flex items-center gap-2 text-left">
                <Users className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Клиентская база</h1>
            </div>
        )
    });

    const [newUser, setNewUser] = useState({
        username: "",
        full_name: "",
        email: "",
        phone: "",
        password: "password123",
        region: "Tashkent",
        source: "WebApp"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/users`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const payload = {
                ...newUser,
                username: newUser.email.split('@')[0] + Math.floor(Math.random() * 1000)
            };
            const res = await fetch(`${API_BASE_URL}/api/users/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Пользователь успешно создан");
                setIsCreateOpen(false);
                fetchUsers();
            } else {
                toast.error("Ошибка при создании");
            }
        } catch (e) {
            toast.error("Ошибка сети");
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.phone || "").includes(searchQuery) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = users.filter((u) => u.is_active).length;
    const suspendedCount = users.length - activeCount;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5 text-left">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <Users className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">База клиентов</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {users.length}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0 text-left">
                        <div className="relative group flex-1 sm:w-[260px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск клиентов..."
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
                        onClick={fetchUsers}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-9 px-5 rounded-full text-[13px] font-black bg-black dark:bg-white text-white dark:text-black shadow-none active:scale-95 transition-all">
                                <Plus className="size-4 mr-1.5 stroke-[2.5]" /> Добавить клиента
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[420px] rounded-[2.5rem] p-0 border-0 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden text-left">
                            <div className="w-full p-8 flex flex-col gap-6">
                                <DialogHeader className="p-0 border-0 space-y-2">
                                    <DialogTitle className="text-[17px] font-black tracking-tight text-left">Регистрация клиента</DialogTitle>
                                    <DialogDescription className="text-[11px] font-bold text-muted-foreground/50 leading-tight text-left uppercase tracking-widest">
                                        Система лояльности HESSA
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateUserForm 
                                    newUser={newUser} 
                                    setNewUser={setNewUser} 
                                    onSubmit={handleCreate} 
                                    onCancel={() => setIsCreateOpen(false)} 
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
                        {[
                            { label: "Всего клиентов", value: users.length, icon: Users, color: "text-[#007aff]", trend: "+12", isUp: true },
                            { label: "Активных", value: activeCount, icon: Activity, color: "text-green-500", trend: "+8%", isUp: true },
                            { label: "Новых сегодня", value: 5, icon: Star, color: "text-orange-500", trend: "+2", isUp: true },
                            { label: "В бане", value: suspendedCount, icon: ShieldBan, color: "text-red-500", trend: "0", isUp: false },
                        ].map((s) => (
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
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Покупатель</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Контакт</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Бонусы</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">Источник</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center w-28">Статус</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-32 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-16 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-full mx-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredUsers.map((user) => (
                                        <tr key={user.id} className="h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left" onClick={() => router.push(`/users/${user.id}`)}>
                                            <td className="py-2.5 px-5">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black border border-primary/10 uppercase tabular-nums">
                                                        {user.full_name?.[0] || user.username[0]}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[13px] font-bold text-foreground group-hover/row:text-primary transition-colors">{user.full_name || user.username}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 tabular-nums uppercase tracking-widest">ID: {user.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[13px] font-bold text-foreground/80 tabular-nums">{user.phone || "—"}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground/40">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <div className="flex items-center justify-center gap-2 text-foreground/80 font-bold text-[13px] tabular-nums">
                                                    <Gift className="size-3.5 text-orange-500/50" />
                                                    {user.tokens}
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                {user.telegram_id ? (
                                                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-[#007aff] tracking-wider">
                                                        <MessageSquare className="size-3" /> WebApp
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground/40 tracking-wider">
                                                        <Globe className="size-3" /> Site
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 text-center">
                                                <Badge variant="outline" className={cn(
                                                    "h-[22px] px-2.5 text-[9px] font-black border-0 rounded-md uppercase tracking-wider",
                                                    user.is_active ? STATUS_CONFIG.Active.bg + " " + STATUS_CONFIG.Active.color : STATUS_CONFIG.Suspended.bg + " " + STATUS_CONFIG.Suspended.color
                                                )}>
                                                    <span className={cn("size-1.5 rounded-full mr-1.5", user.is_active ? STATUS_CONFIG.Active.dot : STATUS_CONFIG.Suspended.dot)} />
                                                    {user.is_active ? STATUS_CONFIG.Active.label : STATUS_CONFIG.Suspended.label}
                                                </Badge>
                                            </td>
                                            <td className="pr-5 text-right">
                                                <UserActionsMenu user={user} onRefresh={fetchUsers} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="sm:hidden divide-y divide-black/5 dark:divide-white/10 text-left">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="p-4 flex flex-col gap-4 active:bg-black/5 transition-colors" onClick={() => router.push(`/users/${user.id}`)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black">
                                                {user.full_name?.[0] || user.username[0]}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-[14px] font-bold">{user.full_name || user.username}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground/40">{user.phone}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn(
                                            "h-[20px] px-2 text-[9px] font-black border-0 rounded-md uppercase tracking-wider",
                                            user.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {user.is_active ? "Активен" : "В бане"}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredUsers.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Search className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-black tracking-tight mb-2">Клиенты не найдены</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px] leading-relaxed">
                                    По запросу <span className="text-foreground font-bold italic">«{searchQuery}»</span> ничего не найдено.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserActionsMenu({ user, onRefresh }: { user: User, onRefresh: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors opacity-40 hover:opacity-100 data-[state=open]:opacity-100 ml-auto shrink-0 shadow-none">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-[1.75rem] border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl shadow-2xl">
                <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[12px] font-bold focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer text-left">
                    <Edit2 className="size-4 text-muted-foreground/60" />
                    Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5 bg-black/5 dark:bg-white/5" />
                <DropdownMenuItem className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 text-[12px] font-bold text-red-500 focus:bg-red-500/5 focus:text-red-500 cursor-pointer text-left">
                    <ShieldBan className="size-4" />
                    Заблокировать
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
