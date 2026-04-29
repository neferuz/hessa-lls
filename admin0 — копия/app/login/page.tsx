"use client";

import { useState } from "react";
import { Flame, Mail, Lock, ChevronRight, Fingerprint, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
        window.location.href = "/";
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f2f2f7] dark:bg-[#000000] p-4 pt-16 font-sans">
      
      <div className="w-full max-w-[340px] relative">
        {/* Branding (Simple Logo) */}
        <div className="flex flex-col items-center mb-10">
          <div className="size-32 relative transition-transform hover:scale-105 duration-500 cursor-pointer">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Login Card (Compact, No Shadow) */}
        <div className="rounded-[2.5rem] bg-white dark:bg-[#1c1c1e] p-6 md:p-8 border border-black/5 dark:border-white/10 relative">
          <div className="mb-6 text-center">
            <h2 className="text-[16px] font-bold tracking-tight leading-tight uppercase">Админ-панель</h2>
            <p className="text-[10px] text-muted-foreground/30 font-bold mt-1 uppercase tracking-[0.2em]">Operation Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/30 px-4">Почта</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-foreground transition-colors" />
                <Input 
                  type="email"
                  placeholder="admin@sushilab.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10.5 pl-11 pr-4 rounded-[1.25rem] bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-black/5 dark:focus-visible:ring-white/5 text-[13px] font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/30 px-4">Пароль</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-foreground transition-colors" />
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10.5 pl-11 pr-4 rounded-[1.25rem] bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-black/5 dark:focus-visible:ring-white/5 text-[13px] font-medium transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-[13px] shadow-none hover:opacity-90 active:scale-[0.98] transition-all"
            >
              {isLoading ? (
                <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  Войти <ChevronRight className="size-4" />
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[7px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.5em] ml-[0.5em] leading-none">
          powered by pixel studio
        </p>
      </div>
    </div>
  );
}
