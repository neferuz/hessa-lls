"use client";
import { useState, useEffect } from "react";

import { Users, Clipboard, Wallet, FileText, ShoppingBag, XCircle, Flame, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { NumberFlow } from "@/components/ui/number-flow";

const iconMap = {
  users: Users,
  clipboard: Clipboard,
  wallet: Wallet,
  invoice: FileText,
  "shopping-bag": ShoppingBag,
  "x-circle": XCircle,
  flame: Flame,
  clock: Clock,
};

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof iconMap;
  trend?: {
    value: string;
    isUp: boolean;
  };
  chartData?: { value: number }[];
  color?: string;
}

export function StatCard({ title, value, icon, trend, chartData, color = "var(--primary)" }: StatCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-white dark:bg-zinc-950 p-5 transition-all hover:border-primary/40 shadow-none">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/40 group-hover:scale-105 transition-transform duration-300">
            <Icon className="size-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
        </div>
      </div>
      
      <div className="space-y-1 z-10 relative">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          <NumberFlow value={value} />
        </p>
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
            trend.isUp ? 'text-green-600' : 'text-red-500'
          )}>
            <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded border shadow-none",
               trend.isUp ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"
            )}>
               {trend.isUp ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
               <NumberFlow value={trend.value} />
            </div>
            <span className="text-muted-foreground/30 font-medium">vs week</span>
          </div>
        )}
      </div>

      {chartData && (
        <div className="absolute inset-x-0 bottom-0 h-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${icon}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                fill={`url(#gradient-${icon})`} 
                strokeWidth={1.5}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

