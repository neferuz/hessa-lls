"use client";
import { useState, useEffect } from "react";

import { Users, Clipboard, Wallet, FileText, ShoppingBag, XCircle, Flame, Clock, TrendingUp, TrendingDown, ClipboardList, Briefcase, HelpCircle, Megaphone, Sparkles, LayoutDashboard } from "lucide-react";
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
  "clipboard-list": ClipboardList,
  briefcase: Briefcase,
  "help-circle": HelpCircle,
  megaphone: Megaphone,
  sparkles: Sparkles,
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
  const Icon = iconMap[icon] || LayoutDashboard;

  // Convert string trend to object if needed
  const parsedTrend = typeof trend === 'string' 
    ? { value: trend.startsWith('+') || trend.startsWith('-') ? trend.substring(1) : trend, isUp: trend.startsWith('+') }
    : trend;

  return (
    <div className="group relative overflow-hidden rounded-[2.25rem] border border-border/40 bg-white dark:bg-[#1c1c1e] p-4 transition-all hover:border-primary/20 shadow-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-muted/30 border border-border/40 group-hover:scale-105 transition-transform duration-300">
            <Icon className="size-4 text-foreground/70 group-hover:text-primary transition-colors" />
          </div>
          <p className="text-[11px] font-semibold text-foreground/50 tracking-tight">{title}</p>
        </div>
        {parsedTrend && (
          <div className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-lg border border-transparent shadow-none text-[10px] font-semibold tracking-tight",
            parsedTrend.isUp ? "bg-green-500/5 text-green-600 border-green-500/10" : "bg-red-500/5 text-red-500 border-red-500/10"
          )}>
            {parsedTrend.isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            <NumberFlow value={parsedTrend.value} />
          </div>
        )}
      </div>
      
      <div className="space-y-0.5 z-10 relative">
        <div className="text-xl font-semibold text-foreground tracking-tight">
          <NumberFlow value={value} />
        </div>
        <p className="text-[10px] font-medium text-foreground/20 tracking-tight">Прогноз на неделю</p>
      </div>

      {chartData && (
        <div className="absolute inset-x-0 bottom-0 h-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
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
                strokeWidth={1}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

