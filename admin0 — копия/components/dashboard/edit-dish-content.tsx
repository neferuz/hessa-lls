"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Activity, 
  Layers,
  UtensilsCrossed,
  DollarSign,
  Package,
  Weight,
  TrendingUp,
  Clock,
  ChevronRight,
  Info,
  PieChart,
  Target,
  Zap,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function EditDishContent({ id }: { id: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const INITIAL_DATA = {
    name: "Филадельфия Лайт",
    category: "Роллы",
    price: "32 000",
    weight: "280",
    isActive: true,
    description: "Классический ролл с нежным сливочным сыром, свежим огурцом и ломтиком лосося. Идеальное сочетание вкусов."
  };

  const formatCurrency = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const [name, setName] = useState(INITIAL_DATA.name);
  const [category, setCategory] = useState(INITIAL_DATA.category);
  const [price, setPrice] = useState(formatCurrency(INITIAL_DATA.price));
  const [weight, setWeight] = useState(INITIAL_DATA.weight);
  const [isActive, setIsActive] = useState(INITIAL_DATA.isActive);
  const [description, setDescription] = useState(INITIAL_DATA.description);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(formatCurrency(e.target.value));
  };

  const isChanged = 
    name !== INITIAL_DATA.name || 
    category !== INITIAL_DATA.category || 
    price !== INITIAL_DATA.price || 
    weight !== INITIAL_DATA.weight || 
    isActive !== INITIAL_DATA.isActive ||
    description !== INITIAL_DATA.description;

  const handleSave = () => {
    router.push("/dishes");
  };

  if (!mounted) return <div className="flex-1 bg-[#f2f2f7] dark:bg-[#000000]" />;

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* 1. Transparent Header Bar - Compact */}
      <div className="sticky top-0 z-50 px-5 pt-2 pb-1">
         <div className="max-w-[1300px] mx-auto h-9 flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
             <Button onClick={() => router.push("/dishes")} variant="ghost" size="icon" className="size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 border-0 shadow-none transition-all">
               <ArrowLeft className="size-3.5 text-muted-foreground/70" />
             </Button>
             <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold tracking-tight leading-none text-foreground uppercase pt-0.5">Редактирование: <span className="font-medium text-muted-foreground/50 NORMAL-CASE">{name}</span></span>
                <Badge variant="outline" className="h-[18px] px-1.5 text-[9px] font-semibold bg-black/5 dark:bg-white/10 border-0 rounded-full text-muted-foreground/40 tracking-widest uppercase">ID: {id}</Badge>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <Button variant="ghost" onClick={() => router.push("/dishes")} className="h-8 px-4 rounded-[10px] text-[12px] font-semibold text-muted-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all">Отмена</Button>
             <Button 
               onClick={handleSave} 
               disabled={!isChanged}
               className={cn(
                 "h-8 px-6 rounded-[10px] text-[12px] font-semibold transition-all shadow-none active:scale-95",
                 isChanged 
                   ? "bg-[#007aff] text-white hover:bg-[#007aff]/90" 
                   : "bg-black/5 dark:bg-white/10 text-muted-foreground/30"
               )}
             >
               Сохранить
             </Button>
           </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 md:p-5 pt-1">
        <div className="max-w-[1300px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-6">
               <div className="bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-none">
                  <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                     <div className="relative size-24 rounded-[1.25rem] overflow-hidden border border-border/50 bg-[#f2f2f7] dark:bg-black/20 shrink-0 group">
                        <Image src="/rolls.png" alt={name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer backdrop-blur-[2px]">
                           <Upload className="size-6 text-white" />
                        </div>
                     </div>
                     <div className="flex-1 w-full space-y-1">
                        <Label className="text-[11px] font-semibold uppercase text-muted-foreground/50 tracking-wider">Название блюда</Label>
                        <Input 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="h-10 text-[20px] font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none w-full tabular-nums"
                        />
                     </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground/70 uppercase">Категория</Label>
                           <Select value={category} onValueChange={setCategory}>
                             <SelectTrigger className="h-11 rounded-[10px] bg-black/5 dark:bg-white/5 border-0 shadow-none text-[14px] font-semibold">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-black/5 shadow-2xl bg-white/95 backdrop-blur-xl">
                               <SelectItem value="Роллы">Роллы</SelectItem>
                               <SelectItem value="Сеты">Сеты</SelectItem>
                               <SelectItem value="Напитки">Напитки</SelectItem>
                               <SelectItem value="Горячее">Горячее</SelectItem>
                             </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground/70 uppercase">Цена (UZS)</Label>
                           <Input 
                             value={price} 
                             onChange={handlePriceChange} 
                             className="h-11 rounded-[10px] bg-black/5 dark:bg-white/5 border-0 shadow-none text-[15px] font-semibold tabular-nums" 
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground/70 uppercase">Вес (GR)</Label>
                           <Input 
                             value={weight} 
                             onChange={(e) => setWeight(e.target.value)} 
                             className="h-11 rounded-[10px] bg-black/5 dark:bg-white/5 border-0 shadow-none text-[15px] font-semibold tabular-nums" 
                           />
                        </div>
                     </div>

                     <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                           <Label className="text-[11px] font-bold text-muted-foreground/70 uppercase">Описание состава</Label>
                           <span className="text-[11px] text-muted-foreground/50">240 символов макс.</span>
                        </div>
                        <textarea 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full min-h-[120px] rounded-[10px] bg-black/5 dark:bg-white/5 border-0 shadow-none text-[14px] font-medium leading-relaxed p-4 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                          placeholder="Ингредиенты, особенности, вкус..."
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Side Analytics & Controls Column */}
            <div className="lg:col-span-4 space-y-6">
               
               {/* Controls */}
               <div className="bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-none p-6">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsActive(!isActive)}>
                     <div className="space-y-0.5">
                        <Label className="text-[14px] font-bold cursor-pointer">Блюдо в продаже</Label>
                        <p className="text-[12px] text-muted-foreground">Клиенты могут заказать в приложении</p>
                     </div>
                     <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-green-500" />
                  </div>
               </div>

               {/* Analytics */}
               <div className="bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-none divide-y divide-black/5 dark:divide-white/10">
                  <div className="p-4 px-6 bg-[#f2f2f7]/30 dark:bg-black/20 text-[11px] font-bold uppercase text-muted-foreground/70">
                     Аналитика за 30 дней
                  </div>
                  <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="size-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                              <TrendingUp className="size-5" />
                           </div>
                           <span className="text-[13px] font-bold text-muted-foreground">Выручка</span>
                        </div>
                        <span className="text-[16px] font-semibold tabular-nums tracking-tight">1 245 000 { } UZS</span>
                     </div>
                     
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="size-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                              <PieChart className="size-5" />
                           </div>
                           <span className="text-[13px] font-bold text-muted-foreground">Продажи</span>
                        </div>
                        <span className="text-[16px] font-semibold tabular-nums tracking-tight">852 ШТ</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#1c1c1e] rounded-[1.5rem] border border-black/5 dark:border-white/10 p-6 relative overflow-hidden group shadow-none">
                  <div className="relative z-10 flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-[#007aff]/10 flex items-center justify-center">
                           <Target className="size-4 text-[#007aff] animate-pulse" />
                        </div>
                        <span className="text-[12px] font-semibold text-muted-foreground/60 uppercase tracking-[0.1em]">Эффективность</span>
                     </div>
                     <p className="text-[24px] font-semibold leading-none text-foreground">62.4%</p>
                     <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">
                        Высокая маржинальность. Блюдо входит в ТОП-5 в категории «<span className="font-bold text-foreground">{category}</span>».
                     </p>
                  </div>
                  <div className="absolute -top-10 -right-10 size-32 bg-[#007aff]/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>



            </div>

          </div>
        </div>
      </div>

      {/* System Footer */}
      <div className="h-10 shrink-0 bg-[#f2f2f7] dark:bg-[#000000] border-t border-black/5 dark:border-white/10 flex items-center justify-between px-8 text-[9px] font-semibold text-muted-foreground/30 uppercase select-none tracking-[0.2em]">
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
               <div className="size-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" /> 
               System Active: Terminal 04
            </span>
            <span className="opacity-50">Sushi Lab Operation Center</span>
         </div>
         <span className="tracking-[0.4em] opacity-40">Secure Connection</span>
      </div>
    </div>
  );
}
