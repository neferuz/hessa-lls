"use client";

import { useState, useEffect } from "react";
import { 
  Store, MapPin, Phone, Globe, Camera,
  Instagram, MessageCircle, Save, Check, ChevronRight,
  Plus, X, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function RestaurantInfoContent() {
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingFilial, setIsAddingFilial] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Toolbar */}
      <div className="h-16 shrink-0 flex items-center justify-between px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-20 sticky top-0 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Store className="size-4" />
          </div>
          <span className="text-[14px] font-semibold tracking-tight">Информация о ресторане</span>
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          size="sm" 
          className="h-9 px-6 rounded-full text-[13px] font-semibold shadow-none bg-primary text-primary-foreground hover:opacity-90 transition-all min-w-[120px]"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="size-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Сохранение</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="size-4" />
              <span>Сохранить всё</span>
            </div>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-5 md:p-6 pb-20 transition-all duration-300">
        <div className="max-w-[1300px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* LEFT COLUMN: CORE INFO */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* General Info */}
              <div className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-6 border border-black/5 dark:border-white/10 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Store className="size-4" />
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight">Основные данные</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-wider">Название ресторана</Label>
                    <Input defaultValue="Sushi Lab" className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-wider">Тип заведения</Label>
                    <Input defaultValue="Японская кухня" className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-wider">Описание компании</Label>
                  <Textarea 
                    defaultValue="Лучшие роллы и суши в Ташкенте. Только свежие ингредиенты и быстрая доставка до вашей двери." 
                    className="min-h-[90px] rounded-2xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium resize-none p-4" 
                  />
                </div>
              </div>

              {/* Locations / Filials */}
              <div className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-6 border border-black/5 dark:border-white/10 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <MapPin className="size-4" />
                    </div>
                    <h3 className="text-[15px] font-semibold tracking-tight">Филиалы и адреса</h3>
                  </div>
                  <Button 
                    onClick={() => setIsAddingFilial(true)}
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 rounded-full text-[11px] font-semibold bg-primary/5 text-primary hover:bg-primary/10 transition-all active:scale-95"
                  >
                    + Добавить филиал
                  </Button>
                </div>

                <div className="space-y-3">
                   {[
                     { name: "Центральный", address: "ул. Амира Темура, 45", phone: "+998 71 234 56 78" },
                     { name: "Чиланзар", address: "9-й квартал, д. 12", phone: "+998 71 999 88 77" },
                     { name: "Юнусабад", address: "13-й квартал, ул. Темур Малика", phone: "+998 71 555 44 33" },
                   ].map((filial) => (
                     <div key={filial.name} className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="size-9 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-black/5 dark:border-white/10 text-[11px] font-bold text-muted-foreground/40 uppercase">
                              {filial.name[0]}
                           </div>
                           <div>
                              <p className="text-[13px] font-semibold tracking-tight">{filial.name} филиал</p>
                              <p className="text-[11px] text-muted-foreground/50 mt-0.5">{filial.address}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <p className="text-[11px] font-semibold tabular-nums text-muted-foreground/40">{filial.phone}</p>
                           <ChevronRight className="size-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: RECOGNITION & SOCIAL */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Logo Card */}
              <div className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-6 border border-black/5 dark:border-white/10 flex flex-col items-center text-center">
                 <div className="relative group mb-4">
                    <div className="size-24 rounded-[2.25rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden flex items-center justify-center p-2">
                       <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-[1.75rem] opacity-90" alt="Logo" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                       <Camera className="size-3.5" />
                    </button>
                 </div>
                 <h4 className="text-[14px] font-semibold tracking-tight">Логотип заведения</h4>
                 <p className="text-[10px] text-muted-foreground/40 mt-1 max-w-[180px]">PNG или JPG. Рекомендуется 512x512px</p>
              </div>

              {/* Social Links */}
              <div className="rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-6 border border-black/5 dark:border-white/10 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Instagram className="size-4" />
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight">Социальные сети</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-wider">Instagram</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 text-[13px] font-bold">@</span>
                      <Input defaultValue="sushilab.uz" className="h-10 pl-7 rounded-xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-wider">Telegram</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 text-[13px] font-bold leading-none">t.me/</span>
                      <Input defaultValue="sushilab_uz" className="h-10 pl-11 rounded-xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-wider">Веб-сайт</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/30" />
                      <Input defaultValue="www.sushilab.uz" className="h-10 pl-9 rounded-xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[13px] font-medium" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Status */}
              <div className="rounded-[1.75rem] bg-primary/5 dark:bg-primary/10 p-5 px-6 border border-primary/10 flex items-start gap-3">
                 <Globe className="size-4 text-primary mt-0.5" />
                 <p className="text-[11px] text-primary/70 dark:text-primary/60 leading-relaxed italic">
                    Информация на этой странице мгновенно обновляется на вашем сайте и в мобильном приложении.
                 </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ADD FILIAL SHEET */}
      <Sheet open={isAddingFilial} onOpenChange={setIsAddingFilial}>
        <SheetContent side="right" className="w-full sm:max-w-[440px] p-0 border-l border-black/5 dark:border-white/10 bg-white dark:bg-[#1c1c1e] [&>button]:hidden">
          <div className="flex flex-col h-full">
            <SheetHeader className="h-16 shrink-0 flex flex-row items-center justify-between px-6 border-b border-black/5 dark:border-white/5 space-y-0">
               <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <Plus className="size-4" />
                  </div>
                  <SheetTitle className="text-[15px] font-semibold tracking-tight">Новый филиал</SheetTitle>
               </div>
               <Button variant="ghost" size="icon" onClick={() => setIsAddingFilial(false)} className="size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <X className="size-4 text-muted-foreground/40" />
               </Button>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <Label className="text-[11px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-widest">Название филиала</Label>
                     <Input placeholder="Напр: Чиланзар" className="h-11 rounded-2xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[14px] font-medium" />
                  </div>
                  
                  <div className="space-y-2">
                     <Label className="text-[11px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-widest">Полный адрес</Label>
                     <Textarea 
                       placeholder="Введите точный адрес..." 
                       className="min-h-[110px] rounded-[22px] bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[14px] font-medium resize-none p-4" 
                     />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[11px] font-semibold px-1 text-muted-foreground/40 uppercase tracking-widest">Телефон филиала</Label>
                     <Input placeholder="+998 00 000 00 00" className="h-11 rounded-2xl bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 text-[14px] font-medium" />
                  </div>

                  <div className="p-5 rounded-[1.75rem] bg-primary/5 dark:bg-primary/10 border border-primary/5 flex items-start gap-4">
                     <Info className="size-4 text-primary mt-0.5 shrink-0" />
                     <p className="text-[11px] text-primary/70 dark:text-primary/60 leading-relaxed italic">
                        После создания филиала, вы сможете настроить для него отдельный график работы и зоны доставки.
                     </p>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-black/5 dark:border-white/5 bg-[#f2f2f7]/30 dark:bg-black/20">
               <div className="grid grid-cols-2 gap-3">
                  <Button variant="ghost" onClick={() => setIsAddingFilial(false)} className="h-11 rounded-2xl text-[13px] font-semibold hover:bg-black/5 dark:hover:bg-white/5">Отмена</Button>
                  <Button className="h-11 rounded-2xl text-[13px] font-semibold shadow-none bg-primary text-primary-foreground hover:opacity-90">Создать филиал</Button>
               </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
