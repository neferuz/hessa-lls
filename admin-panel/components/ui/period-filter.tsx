"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PERIODS = ["Сегодня", "Неделя", "Месяц", "Год"] as const;
type Period = typeof PERIODS[number];

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

function getRange(period: Period, selectedMonth: number, selectedYear: number): { from: string; to: string } {
  const now = new Date();
  switch (period) {
    case "Сегодня":
      return { from: formatDate(now), to: formatDate(now) };
    case "Неделя": {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay() + 1);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { from: formatDate(start), to: formatDate(end) };
    }
    case "Месяц": {
      const start = new Date(selectedYear, selectedMonth, 1);
      const end = new Date(selectedYear, selectedMonth, getDaysInMonth(selectedYear, selectedMonth));
      return { from: formatDate(start), to: formatDate(end) };
    }
    case "Год": {
      return { from: `01.01.${selectedYear}`, to: `31.12.${selectedYear}` };
    }
  }
}

interface PeriodFilterProps {
  onPeriodChange?: (period: string, range: { from: string; to: string }) => void;
  isCompact?: boolean;
}

export function PeriodFilter({ onPeriodChange, isCompact }: PeriodFilterProps) {
  const [period, setPeriod] = useState<Period>("Месяц");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [appliedRange, setAppliedRange] = useState<{ from: string; to: string }>(getRange("Месяц", new Date().getMonth(), new Date().getFullYear()));
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePeriodClick = (p: Period) => {
    setPeriod(p);
    const newRange = getRange(p, selectedMonth, selectedYear);
    if (p === "Месяц") {
      setIsPickerOpen(!isPickerOpen);
    } else {
      setIsPickerOpen(false);
      setAppliedRange(newRange);
      onPeriodChange?.(p, newRange);
    }
  };

  const handleDateClick = (day: number) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
    } else {
      if (day < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(day);
      } else if (day === rangeStart) {
        setRangeStart(null);
      } else {
        setRangeEnd(day);
      }
    }
  };

  const isInRange = (day: number) => {
    if (!rangeStart || !rangeEnd) return false;
    return day > rangeStart && day < rangeEnd;
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setRangeStart(null);
    setRangeEnd(null);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setRangeStart(null);
    setRangeEnd(null);
  };

  const handleApply = () => {
    setIsPickerOpen(false);
    let newRange = appliedRange;
    if (rangeStart && rangeEnd) {
      const from = `${String(rangeStart).padStart(2, "0")}.${String(selectedMonth + 1).padStart(2, "0")}.${selectedYear}`;
      const to = `${String(rangeEnd).padStart(2, "0")}.${String(selectedMonth + 1).padStart(2, "0")}.${selectedYear}`;
      newRange = { from, to };
    } else if (rangeStart) {
      const date = `${String(rangeStart).padStart(2, "0")}.${String(selectedMonth + 1).padStart(2, "0")}.${selectedYear}`;
      newRange = { from: date, to: date };
    }
    setAppliedRange(newRange);
    onPeriodChange?.("Месяц", newRange);
  };

  return (
    <div className="relative z-[50]" ref={pickerRef}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button 
          onClick={() => handlePeriodClick("Месяц")}
          className={cn(
            "flex items-center px-2.5 sm:px-4 h-[36px] rounded-full border border-black/5 dark:border-white/5 transition-all shrink-0 active:scale-95 group/calendar",
            period === "Месяц" 
              ? "bg-white dark:bg-zinc-800 text-black dark:text-white border-transparent" 
              : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-muted-foreground"
          )}
        >
          <Calendar className={cn("size-3.5 transition-colors", period === "Месяц" ? "text-black dark:text-white" : "text-muted-foreground/40 group-hover/calendar:text-muted-foreground/60")} />
          <span className="text-[11px] font-bold tabular-nums hidden sm:block ml-2">
            {appliedRange.from} {appliedRange.from !== appliedRange.to ? ` — ${appliedRange.to}` : ""}
          </span>
        </button>

        {!isCompact && (
          <div className="flex items-center p-[3px] bg-black/5 dark:bg-white/10 rounded-full border border-black/5 dark:border-white/5 overflow-hidden shrink-0">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodClick(p)}
                className={cn(
                  "px-3.5 sm:px-5 h-[30px] rounded-full text-[11px] sm:text-[12px] font-bold transition-all whitespace-nowrap",
                  period === p 
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-none" 
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-black/[0.02]"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Month Picker Dropdown */}
      {isPickerOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-[1.25rem] bg-white dark:bg-[#1c1c1e] p-4 space-y-4 border border-black/5 dark:border-white/10 shadow-none">
          
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <button 
              onClick={prevMonth}
              className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </button>
            <div className="text-center">
              <p className="text-[14px] font-medium tracking-tight uppercase">{MONTH_NAMES[selectedMonth]}</p>
              <p className="text-[11px] font-medium text-muted-foreground/40">{selectedYear}</p>
            </div>
            <button 
              onClick={nextMonth}
              className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 px-1">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <span key={day} className="text-[9px] font-medium text-muted-foreground/40 text-center uppercase">{day}</span>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-1 min-h-[194px]">
            {/* Actual days */}
            {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() === 0 ? 6 : new Date(selectedYear, selectedMonth, 1).getDay() - 1 }).map((_, idx) => (
              <div key={`empty-${idx}`} className="size-8" />
            ))}
            
            {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = dayNum === rangeStart || dayNum === rangeEnd;
              const covered = isInRange(dayNum);
              
              return (
                <button
                  key={i}
                  onClick={() => handleDateClick(dayNum)}
                  className={cn(
                    "size-8 rounded-full text-[13px] font-medium transition-all flex items-center justify-center relative",
                    isSelected ? "bg-black dark:bg-white text-white dark:text-black z-10" : covered ? "bg-black/10 dark:bg-white/10 text-foreground" : "hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => {
                setRangeStart(null);
                setRangeEnd(null);
              }}
              className="px-4 h-[42px] rounded-xl bg-black/5 dark:bg-white/5 text-muted-foreground text-[12px] font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              Сброс
            </button>
            <button 
              onClick={handleApply}
              className="flex-1 h-[42px] rounded-xl bg-black dark:bg-white text-white dark:text-black text-[13px] font-bold uppercase tracking-wider hover:opacity-90 transition-colors"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
