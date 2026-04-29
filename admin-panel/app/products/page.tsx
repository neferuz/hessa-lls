"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Plus, Search, Edit2, Box, RefreshCw, Archive, 
    ChevronRight, LayoutGrid, List, Activity, Star, 
    Package, ShoppingBag, Eye, Trash2, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import { AnimatedNumber } from "@/components/ui/animated-number";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Каталог товаров</h1>
            </div>
        ),
        description: "Управление ассортиментом и ценами"
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name_ru?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.article?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/${path}`;
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-auto pb-3 sm:pb-0 sm:h-14 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 text-left">
                    <div className="flex items-center justify-between w-full sm:w-auto h-12 sm:h-auto">
                        <div className="flex items-center gap-2.5 text-left">
                            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <Package className="size-4" />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap">Товары</span>
                            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground ml-1 tabular-nums">
                                {products.length}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto px-0.5 sm:px-0 text-left">
                        <div className="relative group flex-1 sm:w-[320px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Поиск по названию или артикулу..."
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
                        onClick={fetchProducts}
                        className="size-9 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <RefreshCw className={cn("size-3.5 text-muted-foreground", loading && "animate-spin")} />
                    </Button>
                    <Button 
                        onClick={() => router.push('/products/new')} 
                        size="sm" 
                        className="h-9 px-5 rounded-full text-[13px] font-black bg-black dark:bg-white text-white dark:text-black shadow-none active:scale-95 transition-all"
                    >
                        <Plus className="size-4 mr-1.5 stroke-[2.5]" /> Добавить
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 pb-20 bg-[#f2f2f7] dark:bg-[#000000]">
                <div className="w-full space-y-5 text-left">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
                        {[
                            { label: "Всего товаров", value: products.length, icon: Package, color: "text-[#007aff]", trend: "В каталоге", isUp: true },
                            { label: "Категории", value: Array.from(new Set(products.map(p => p.category_id))).length, icon: Activity, color: "text-green-500", trend: "Разделы", isUp: true },
                            { label: "Новинки", value: products.slice(0, 5).length, icon: Star, color: "text-orange-500", trend: "Недавно", isUp: true },
                            { label: "Активных", value: products.length, icon: ShoppingBag, color: "text-emerald-500", trend: "В продаже", isUp: true },
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
                                        <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 w-16 text-center">Фото</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Наименование</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Артикул</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Категория</th>
                                        <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right">Цена</th>
                                        <th className="py-3 pr-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                    {loading ? (
                                        [...Array(8)].map((_, i) => (
                                            <tr key={i} className="animate-pulse h-16">
                                                <td className="py-2.5 px-5"><div className="size-10 bg-black/5 dark:bg-white/5 rounded-lg mx-auto" /></td>
                                                <td className="py-2.5 px-4"><div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded-xl" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-24 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-32 bg-black/5 dark:bg-white/5 rounded-lg" /></td>
                                                <td className="py-2.5 px-4"><div className="h-8 w-24 bg-black/5 dark:bg-white/5 rounded-lg ml-auto" /></td>
                                                <td className="py-2.5 pr-5"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 rounded-full ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : filteredProducts.map((p) => (
                                        <tr key={p.id} className="h-16 group/row hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left" onClick={() => router.push(`/products/${p.id}`)}>
                                            <td className="py-2.5 px-5">
                                                <div className="size-10 rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden flex items-center justify-center border border-black/5 dark:border-white/10 mx-auto">
                                                    {p.images?.[0] ? (
                                                        <img src={getImageUrl(p.images[0])} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <Box className="size-4 opacity-20" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[13px] font-bold text-foreground group-hover/row:text-primary transition-colors line-clamp-1">{p.name_ru}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 tabular-nums uppercase tracking-widest">#{p.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4">
                                                <Badge variant="outline" className="h-[22px] px-2.5 text-[9px] font-black border-0 bg-black/5 dark:bg-white/5 rounded-md uppercase tracking-wider text-muted-foreground">
                                                    {p.article || "—"}
                                                </Badge>
                                            </td>
                                            <td className="px-4">
                                                <span className="text-[12px] font-medium text-foreground/60">{p.category_name || "Общая"}</span>
                                            </td>
                                            <td className="px-4 text-right">
                                                <span className="text-[14px] font-black tabular-nums">
                                                    {p.price?.toLocaleString()} <span className="text-[10px] font-medium opacity-30 ml-0.5">сум</span>
                                                </span>
                                            </td>
                                            <td className="pr-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-40 hover:opacity-100 transition-opacity ml-auto" onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/products/${p.id}/edit`);
                                                    }}>
                                                        <Edit2 className="size-4" />
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
                            {filteredProducts.map((p) => (
                                <div key={p.id} className="p-4 flex items-center gap-4 active:bg-black/5 transition-colors" onClick={() => router.push(`/products/${p.id}`)}>
                                    <div className="size-14 rounded-2xl bg-black/5 dark:bg-white/5 overflow-hidden flex items-center justify-center border border-black/5 dark:border-white/10 shrink-0">
                                        {p.images?.[0] ? (
                                            <img src={getImageUrl(p.images[0])} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <Box className="size-6 opacity-20" />
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[14px] font-bold line-clamp-1">{p.name_ru}</span>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[12px] font-black tabular-nums">{p.price?.toLocaleString()} сум</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/40">{p.article}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && !loading && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center bg-transparent">
                                <div className="size-24 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border-0 flex items-center justify-center mb-6">
                                    <Archive className="size-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-[18px] font-black tracking-tight mb-2">Товары не найдены</h3>
                                <p className="text-[13px] text-muted-foreground/70 max-w-[280px]">
                                    Попробуйте изменить параметры поиска или добавьте новый товар.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
