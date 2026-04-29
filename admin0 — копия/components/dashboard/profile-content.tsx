"use client";

import { useState, useEffect } from "react";
import { 
  User, Shield, Mail, Bell, Moon, Sun, 
  Settings2, LogOut, Key, Smartphone,
  Activity, Clock, ChevronRight, Camera,
  ShieldCheck, SmartphoneNfc, Check,
  TrendingUp, TrendingDown, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

const AVATAR_OPTIONS = [
  { id: 1, type: "initials", color: "bg-black" },
  { id: 2, type: "initials", color: "bg-[#007aff]" },
  { id: 3, type: "initials", color: "bg-[#34c759]" },
  { id: 4, type: "initials", color: "bg-[#ff9500]" },
  { id: 5, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Felix" },
  { id: 6, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Aneka" },
  { id: 7, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Jasper" },
  { id: 8, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Sasha" },
  { id: 9, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Charlie" },
  { id: 10, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Milo" },
  { id: 11, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Zoe" },
  { id: 12, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Oliver" },
  { id: 13, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Maya" },
  { id: 14, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Leo" },
  { id: 15, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Runa" },
  { id: 16, type: "image", url: "https://api.dicebear.com/7.x/personas/svg?seed=Aiden" },
];

export function ProfileContent() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [profileData, setProfileData] = useState({
    name: "Сергей Воронов",
    email: "sergey@sushilab.uz",
    phone: "+998 90 123 45 67"
  });
  
  const [originalData, setOriginalData] = useState(profileData);
  const [selectedAvatarId, setSelectedAvatarId] = useState(1);
  const [originalAvatarId, setOriginalAvatarId] = useState(1);

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === selectedAvatarId) || AVATAR_OPTIONS[0];

  const hasChanges = 
    profileData.name !== originalData.name || 
    profileData.email !== originalData.email || 
    profileData.phone !== originalData.phone ||
    selectedAvatarId !== originalAvatarId;

  const handleSave = () => {
    setOriginalData(profileData);
    setOriginalAvatarId(selectedAvatarId);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f2f2f7] dark:bg-[#000000] relative overflow-hidden font-sans">
      
      {/* Mini Toolbar - Adaptive */}
      <div className="h-auto py-2.5 sm:h-16 sm:py-0 shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-5 bg-[#f2f2f7]/80 dark:bg-[#000000]/80 backdrop-blur-2xl z-30 sticky top-0 border-b border-black/5 dark:border-white/10 gap-3 sm:gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/20">
              <User className="size-4" />
            </div>
            <span className="text-[14px] font-bold tracking-tight">Профиль</span>
            <Badge variant="outline" className="h-[20px] px-2 text-[10px] font-bold bg-muted/40 border-border/60 rounded-full text-muted-foreground">
              Active
            </Badge>
          </div>
          
          <div className="sm:hidden flex items-center gap-1.5">
             <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-black/5 dark:bg-white/10 text-red-500 border-0" onClick={() => window.location.href = "/login"}>
               <LogOut className="size-3.5" />
             </Button>
             <Button 
                size="sm" 
                disabled={!hasChanges}
                onClick={handleSave}
                className={cn("h-8 px-3 rounded-full text-[11px] font-bold shadow-none", hasChanges ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/10 dark:bg-white/10 text-muted-foreground/30")}
              >
                Сохранить
              </Button>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <Button 
            onClick={() => window.location.href = "/login"}
            variant="outline" className="h-9 px-4 rounded-full text-[13px] font-bold border-0 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors shadow-none text-red-500"
          >
            <LogOut className="size-3.5 mr-1.5" /> Выход
          </Button>
          <Button 
            size="sm" 
            disabled={!hasChanges}
            onClick={handleSave}
            className={cn(
              "h-9 px-5 rounded-full text-[13px] font-bold transition-all shadow-none",
              hasChanges 
                ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-90" 
                : "bg-black/10 dark:bg-white/10 text-muted-foreground/40 cursor-not-allowed"
            )}
          >
            <Check className="size-4 mr-1.5" strokeWidth={2.5} /> Сохранить
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-3 sm:p-5 md:p-6 pb-20">
        <div className="max-w-[1200px] mx-auto space-y-4">
          
          {/* Hero Profile Card - Adaptive */}
          <div className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-5 sm:p-6 border border-black/5 dark:border-white/10 relative overflow-hidden group transition-all duration-500 shadow-none">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "size-8 rounded-full border-0 bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-all",
                  isEditing && "bg-[#007aff] text-white hover:bg-[#007aff]/90"
                )}
              >
                <Settings2 className="size-4" />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
              <div 
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="relative shrink-0 cursor-pointer group/avatar"
              >
                <div className={cn(
                  "size-20 sm:size-24 rounded-[1.75rem] sm:rounded-[2rem] flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/10 transition-all duration-500 bg-background",
                  currentAvatar.type === "initials" ? cn("text-white text-xl sm:text-2xl font-black", currentAvatar.color) : "bg-white",
                  showAvatarPicker && "ring-4 ring-[#007aff]/20 scale-105"
                )}>
                  {currentAvatar.type === "initials" ? (
                    getInitials(profileData.name)
                  ) : (
                    <img src={currentAvatar.url} alt="Avatar" className="size-full object-cover" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-[1.75rem] sm:rounded-[2rem] opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white text-[9px] font-black uppercase tracking-widest">
                  {showAvatarPicker ? "Закрыть" : "Сменить"}
                </div>
                <button className="absolute -bottom-1 -right-1 size-7 sm:size-8 rounded-xl bg-white dark:bg-[#2c2c2e] text-black dark:text-white flex items-center justify-center border border-black/5 dark:border-white/10 shadow-none z-20">
                  {showAvatarPicker ? <ChevronUp className="size-3.5" /> : <Camera className="size-3.5" />}
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                {isEditing ? (
                  <div className="space-y-3 max-w-[400px] w-full mx-auto md:mx-0">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest ml-1">Имя администратора</p>
                      <input 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-2 text-[14px] sm:text-[15px] font-bold focus:ring-1 focus:ring-[#007aff]/30 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest ml-1">Email</p>
                        <input 
                          value={profileData.email} 
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-medium focus:ring-1 focus:ring-[#007aff]/30 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest ml-1">Телефон</p>
                        <input 
                          value={profileData.phone} 
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-medium focus:ring-1 focus:ring-[#007aff]/30 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2.5 mb-2">
                       <h2 className="text-[20px] sm:text-[24px] font-bold tracking-tight uppercase">{profileData.name}</h2>
                       <Badge className="w-fit mx-auto md:mx-0 bg-[#007aff]/10 text-[#007aff] border-0 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-none">
                         Root Access
                       </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mt-4">
                      <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 w-fit mx-auto md:mx-0">
                        <Mail className="size-3.5 opacity-40 shrink-0" /> <span className="truncate max-w-[180px]">{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 w-fit mx-auto md:mx-0">
                        <Smartphone className="size-3.5 opacity-40 shrink-0" /> {profileData.phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inline Avatar Picker - Adaptive */}
            <div className={cn(
              "grid transition-all duration-500 ease-in-out px-1",
              showAvatarPicker ? "grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-black/5" : "grid-rows-[0fr] opacity-0"
            )}>
              <div className="overflow-hidden">
                <p className="text-[12px] sm:text-[13px] font-medium text-muted-foreground/60 mb-4 ml-1">Выберите стиль вашего профиля</p>
                <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-2 px-1">
                  {AVATAR_OPTIONS.map((av) => (
                    <div 
                      key={av.id}
                      onClick={() => { setSelectedAvatarId(av.id); setShowAvatarPicker(false); }}
                      className={cn(
                        "size-12 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 relative overflow-hidden",
                        selectedAvatarId === av.id 
                          ? "ring-2 ring-[#007aff] scale-105" 
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      )}
                    >
                      <div className={cn(
                        "size-full rounded-2xl overflow-hidden border border-black/5 dark:border-white/5",
                        av.type === "initials" ? cn("text-white text-base sm:text-lg font-black flex items-center justify-center", av.color) : "bg-white"
                      )}>
                        {av.type === "initials" ? (
                          getInitials(profileData.name)
                        ) : (
                          <img src={av.url} alt="Option" className="size-full object-cover" />
                        )}
                      </div>
                      {selectedAvatarId === av.id && (
                        <div className="absolute inset-0 bg-[#007aff]/10 flex items-center justify-center">
                           <Check className="size-4 text-[#007aff]" strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Stats Grid - Adaptive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { label: "Смен всего", value: 124, icon: Clock, trend: "+12%", isUp: true, color: "text-[#007aff]" },
              { label: "Действий", value: 4520, icon: Activity, trend: "+8%", isUp: true, color: "text-[#34c759]" },
              { label: "Доступ", value: "ADMIN", icon: Shield, trend: "Lv 10", isUp: true, color: "text-[#af52de]" },
              { label: "Тайминг", value: "08:42", icon: Clock, trend: "-2%", isUp: false, color: "text-[#ff9500]" },
            ].map((stat, i) => (
              <div key={i} className="rounded-[1.25rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-3 px-4 border border-black/5 dark:border-white/10 transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("size-8 rounded-xl flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5", stat.color)}>
                    <stat.icon className="size-4" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tabular-nums",
                    stat.isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                  )}>
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-semibold tracking-tight mb-0.5 whitespace-nowrap">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    {typeof stat.value === 'number' ? (
                      <AnimatedNumber value={stat.value} className="text-[16px] sm:text-[18px] font-bold tracking-tight" />
                    ) : (
                      <p className="text-[16px] sm:text-[18px] font-bold tracking-tight">{stat.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Settings Main Part */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden text-left shadow-none">
                 <div className="p-4 px-6 border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20">
                   <h3 className="text-[11px] sm:text-[12px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center sm:text-left">Системные параметры</h3>
                 </div>
                 <div className="divide-y divide-black/5 dark:divide-white/10">
                   {[
                     { label: "Темная тема интерфейса", icon: Moon, value: isDarkMode, setter: setIsDarkMode },
                     { label: "FaceID / TouchID", icon: SmartphoneNfc, value: true },
                     { label: "Критические ошибки", icon: Bell, value: true },
                     { label: "Двухфакторная защита", icon: Shield, value: false },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 px-5 sm:px-6 hover:bg-black/[0.02] transition-colors group">
                       <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                         <div className="size-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white opacity-40 shrink-0">
                           <item.icon className="size-3.5" />
                         </div>
                         <span className="text-[13px] sm:text-[14px] font-medium tracking-tight text-foreground/80 truncate">{item.label}</span>
                       </div>
                       <Switch 
                          checked={item.value} 
                          onCheckedChange={item.setter}
                          className="scale-90 data-[state=checked]:bg-[#007aff]" 
                       />
                     </div>
                   ))}
                 </div>
              </div>

              <div className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 sm:px-6 border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left shadow-none">
                <div className="size-11 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <Key className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold uppercase tracking-tight">Безопасность системы</p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground/50 font-medium uppercase tracking-widest">Пароль изменен 60 дней назад</p>
                </div>
                <Button variant="outline" className="h-9 px-6 rounded-full text-[12px] font-bold bg-black/5 hover:bg-black/10 border-0 transition-colors shadow-none text-foreground w-full sm:w-auto">Сменить</Button>
              </div>
            </div>

            {/* Activity Feed Feed */}
            <div className="lg:col-span-4 rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 overflow-hidden flex flex-col text-left shadow-none">
              <div className="p-4 border-b border-black/5 dark:border-white/10 bg-[#f2f2f7]/30 dark:bg-black/20 text-center sm:text-left">
                 <h3 className="text-[11px] sm:text-[12px] font-bold uppercase tracking-widest text-muted-foreground/60">Логи активности</h3>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/10 max-h-[300px] lg:max-h-none">
                {[
                  { action: "Правка меню: Филадельфия", time: "15м" },
                  { action: "Новая категория: Веган", time: "2ч" },
                  { action: "Вход: Safari / Mac OS", time: "3ч" },
                  { action: "Обновление системы", time: "1д" },
                  { action: "Выгрузка отчета за Март", time: "2д" },
                ].map((act, i) => (
                  <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-black/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className="size-1.5 rounded-full bg-[#007aff]/40 shrink-0" />
                       <p className="text-[13px] font-medium tracking-tight truncate text-foreground/80">{act.action}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground/30 uppercase tabular-nums">{act.time}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-[#007aff] hover:bg-black/5 transition-all mt-auto border-t border-black/5">
                СМОТРЕТЬ ВСЕ
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

