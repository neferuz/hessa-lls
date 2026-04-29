"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Activity, 
  LayoutDashboard,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "1", name: "Филадельфия Лайт", price: "32 000 сум", status: "active", image: "/rolls.png", weight: "280г" },
  { id: "2", name: "Калифорния краб", price: "28 000 сум", status: "active", image: "/rolls.png", weight: "240г" },
  { id: "3", name: "Ролл Дракон", price: "45 000 сум", status: "out", image: "/rolls.png", weight: "310г" },
  { id: "4", name: "Темпура креветка", price: "35 000 сум", status: "active", image: "/rolls.png", weight: "260г" },
];

export function EditCategoryContent({ id }: { id: string }) {
  const router = useRouter();
  const [name, setName] = useState("Фирменные Роллы");
  const [slug, setSlug] = useState("rolls");
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    router.push("/categories");
  };

  return (
    <div className="w-full h-full flex flex-col bg-muted/20 animate-in fade-in duration-500 overflow-y-auto overflow-x-hidden">
      
      {/* 1. Header (Flat) */}
      <div className="flex items-center justify-between px-6 py-4 bg-background border-b border-border/60 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push("/categories")} variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted border border-border/60">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-[13px] font-medium tracking-tight text-foreground">Редактирование раздела</h1>
            <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest leading-none">{name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push("/categories")} className="h-9 px-4 text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all">Отмена</Button>
          <Button onClick={handleSave} className="h-9 px-8 gap-2 text-[10px] font-medium uppercase tracking-widest rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-none active:scale-95">
            <Save className="size-3.5" />
            Сохранить
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* 2. Stats Dashboard Cards (Premium Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Всего товаров", value: PRODUCTS.length, sub: "Позиций добавлено", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Статус раздела", value: isActive ? "Активен" : "Скрыт", sub: "Видимость в приложении", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Системный путь", value: "/" + slug, sub: "URL категории", icon: LayoutDashboard, color: "text-primary", bg: "bg-primary/5" }
          ].map((stat, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 shadow-none">
               <div className="flex items-center gap-4 relative z-10">
                 <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0 border border-border/40 group-hover:scale-110 transition-transform", stat.bg)}>
                    <stat.icon className={cn("size-5", stat.color)} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.15em] mb-0.5">{stat.label}</p>
                    <p className="text-[16px] font-bold tracking-tight">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground/30 font-bold uppercase tracking-tight">{stat.sub}</p>
                 </div>
               </div>
               {/* Subtle Background Accent */}
               <div className={cn("absolute -right-4 -bottom-4 size-24 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity", stat.bg.replace('/10', '/40').replace('/5', '/20'))} />
            </div>
          ))}
        </div>

        {/* 3. Main Configuration Card (Flat) */}
        <div className="bg-background border border-border/50 rounded-xl overflow-hidden">
          <div className="px-5 h-11 border-b border-border/40 bg-muted/5 flex items-center gap-2">
             <Layers className="size-3.5 text-muted-foreground/60" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Основная конфигурация</span>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
             <div className="lg:col-span-2 text-center lg:text-left">
                <div className="relative size-24 rounded-2xl overflow-hidden border border-border/40 bg-muted group mx-auto lg:mx-0">
                  <Image src="/rolls.png" alt="Edit" fill className="object-cover transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Upload className="size-4 text-white" />
                  </div>
                </div>
             </div>
             <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1.5">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 ml-0.5">Название раздела</Label>
                   <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 px-3 rounded-lg border-border/40 bg-muted/10 text-[14px] font-medium focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none border" />
                </div>
                <div className="space-y-1.5">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 ml-0.5">Путь (Slug)</Label>
                   <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="h-9 px-3 rounded-lg border-border/40 bg-muted/10 text-[13px] font-mono text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none border" />
                </div>
                <div className="space-y-1.5">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 ml-0.5">Статус</Label>
                   <div className="flex items-center gap-4 h-9">
                      <span className={cn("text-[11px] font-bold uppercase tracking-tight", isActive ? "text-green-600" : "text-muted-foreground/30")}>{isActive ? 'Активен' : 'Скрыт'}</span>
                      <Switch checked={isActive} onCheckedChange={setIsActive} className="scale-75" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* 4. Products List (Table Flat) */}
        <div className="bg-background border border-border/50 rounded-xl overflow-hidden">
          <div className="px-5 h-12 border-b border-border/40 bg-muted/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Package className="size-3.5 text-muted-foreground/60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Товары в категории</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/40" />
                  <Input placeholder="Найти продукт..." className="h-8 w-60 pl-8 text-[11px] bg-background border-border/40 rounded-lg shadow-none" />
                </div>
                <Button size="sm" className="h-8 px-4 gap-2 text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-none border border-border/40 bg-background hover:bg-muted">
                  <Plus className="size-3" />
                  Добавить
                </Button>
             </div>
          </div>

          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="w-[60px] h-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 pl-6">Фото</TableHead>
                <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">Название товара</TableHead>
                <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">Вес</TableHead>
                <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">Цена</TableHead>
                <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">Статус</TableHead>
                <TableHead className="w-[100px] h-10 text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRODUCTS.map((product) => (
                <TableRow key={product.id} className="group border-border/30 hover:bg-primary/[0.01] transition-colors h-10">
                  <TableCell className="py-1 pl-6">
                    <div className="relative size-7 rounded-md overflow-hidden border border-border/30 bg-muted shrink-0 shadow-none">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="py-1 text-[13px] font-medium text-foreground tracking-tight">{product.name}</TableCell>
                  <TableCell className="py-1 text-[11px] font-medium text-muted-foreground/60">{product.weight}</TableCell>
                  <TableCell className="py-1">
                    <span className="text-[12px] font-medium text-primary tracking-tight">{product.price}</span>
                  </TableCell>
                  <TableCell className="py-1">
                    <Badge variant="outline" className={cn(
                      "h-3.5 px-1.5 text-[8px] font-medium uppercase tracking-widest border-none rounded-sm bg-transparent",
                      product.status === 'active' ? "bg-green-500/10 text-green-600" : "bg-muted text-zinc-400 opacity-60"
                    )}>
                      {product.status === 'active' ? 'В наличии' : 'Стоп'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1 px-6 text-right overflow-hidden">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 ease-out">
                      <Button variant="ghost" size="icon" className="size-7.5 rounded-md hover:bg-background border border-transparent hover:border-border/40 active:scale-95 transition-all">
                        <Edit2 className="size-3 text-muted-foreground/50 hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7.5 rounded-md hover:bg-background border border-transparent hover:border-border/40 active:scale-95 transition-all text-destructive/40">
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>

      {/* 5. Minimal Footer */}
      <div className="h-10 mt-auto border-t border-border/40 flex items-center justify-between px-8 bg-background opacity-50">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Sushi Lab Admin Console</p>
        <div className="flex items-center gap-4">
           <div className="size-1.5 rounded-full bg-green-500" />
           <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Connected</span>
        </div>
      </div>
    </div>
  );
}
