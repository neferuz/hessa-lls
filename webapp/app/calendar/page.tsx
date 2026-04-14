"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X, Calendar as CalendarIcon, Info, Bell, Clock, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import clsx from "clsx";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [stats, setStats] = useState({ streak: 0, monthTotal: 0, percentage: 0, missed: 0 });
    const [takenDays, setTakenDays] = useState<Record<string, boolean>>({});
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState("09:00");

    // Load data from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("vitamin_tracker");
        if (saved) setTakenDays(JSON.parse(saved));

        const savedReminder = localStorage.getItem("vitamin_reminders");
        if (savedReminder) {
            const { enabled, time } = JSON.parse(savedReminder);
            setReminderEnabled(enabled);
            setReminderTime(time);
        }
    }, []);

    // Save data to localStorage and recalculate stats
    useEffect(() => {
        localStorage.setItem("vitamin_tracker", JSON.stringify(takenDays));
        calculateStats();
    }, [takenDays]);

    // Save reminders to localStorage
    useEffect(() => {
        localStorage.setItem("vitamin_reminders", JSON.stringify({
            enabled: reminderEnabled,
            time: reminderTime
        }));
    }, [reminderEnabled, reminderTime]);

    const calculateStats = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const dayOfMonth = today.getDate();
        const monthStr = `${year}-${month}`;

        // Month total
        const monthTotal = Object.keys(takenDays).filter(d => d.startsWith(`${year}-${month}`) && takenDays[d]).length;

        // Progress towards the 30-day goal
        const percentage = Math.round((monthTotal / 30) * 100);
        const missed = dayOfMonth - monthTotal;

        // Streak calculation
        let streak = 0;
        let d = new Date();
        while (true) {
            const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (takenDays[dStr]) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                if (streak === 0) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
                    if (takenDays[yStr]) {
                        d = yesterday;
                        continue;
                    }
                }
                break;
            }
        }

        setStats({ streak, monthTotal, percentage, missed });
    };

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const toggleDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
        setTakenDays(prev => ({
            ...prev,
            [dateStr]: !prev[dateStr]
        }));
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    let firstDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) days.push(i);

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
    };

    const isTaken = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
        return takenDays[dateStr];
    };

    const [showFullMonth, setShowFullMonth] = useState(false);

    return (
        <main className="min-h-screen pb-24 bg-transparent relative max-w-lg mx-auto overflow-x-hidden pt-6 px-6 font-manrope text-[#1a1a1a]">
            {/* Ambient Background Accents */}
            <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] bg-[#C497A0]/15 blur-[100px] rounded-full z-0 opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-[-15%] w-[250px] h-[250px] bg-[#C497A0]/10 blur-[80px] rounded-full z-0 opacity-30 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Minimal Header */}
                <header className="w-full flex items-center justify-between mb-8 pt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#C497A0] uppercase tracking-[0.2em] leading-none mb-1">Health Tracker</span>
                        <h1 className="text-[22px] font-bold tracking-tight text-[#1a1a1a] font-unbounded uppercase leading-none">Прогресс</h1>
                    </div>
                    <motion.div 
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-[#C497A0]"
                    >
                        <Zap size={18} fill="currentColor" />
                    </motion.div>
                </header>

                {/* Refined Central Progress Ring */}
                <div className="relative w-56 h-56 flex items-center justify-center mb-10 group mt-4">
                    {/* Glowing background under ring */}
                    <div className="absolute inset-4 bg-[#C497A0]/10 blur-[50px] rounded-full group-hover:scale-110 transition-transform duration-700" />
                    
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="112"
                            cy="112"
                            r="96"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-[#C497A0]/10"
                        />
                        <motion.circle
                            cx="112"
                            cy="112"
                            r="96"
                            stroke="#C497A0"
                            strokeWidth="12"
                            strokeLinecap="round"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 96}
                            initial={{ strokeDashoffset: 2 * Math.PI * 96 }}
                            animate={{ strokeDashoffset: (2 * Math.PI * 96) * (1 - stats.monthTotal / 30) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Выполнено</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[48px] font-bold font-unbounded text-[#1a1a1a] leading-none">{stats.monthTotal}</span>
                        </div>
                        <span className="text-[12px] font-bold text-[#C497A0] uppercase tracking-widest mt-2">{Math.round((stats.monthTotal/30)*100)}% плана</span>
                    </div>
                </div>

                {/* Weekly Strip - More Integrated */}
                <div className="w-full mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500">История <span className="opacity-30 ml-2 font-medium">Март</span></h3>
                        <span className="text-[10px] font-bold text-[#C497A0] uppercase tracking-widest cursor-pointer">Весь месяц</span>
                    </div>
                    <div className="flex justify-between gap-2 no-scrollbar">
                        {[...Array(7)].map((_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            const isChosen = isTaken(d.getDate());
                            const isCurr = isToday(d.getDate());
                            return (
                                <motion.button 
                                    key={i}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleDay(d.getDate())}
                                    className={clsx(
                                        "flex-1 h-[56px] rounded-2xl flex flex-col items-center justify-center transition-all",
                                        isChosen ? "bg-[#1a1a1a] text-white shadow-lg" : isCurr ? "bg-white border border-[#C497A0]/30 text-[#1a1a1a]" : "bg-white/40 border border-white/20 text-gray-400"
                                    )}
                                >
                                    <span className={clsx("text-[8px] font-bold mb-1 uppercase opacity-60")}>
                                        {weekDays[(d.getDay() + 6) % 7]}
                                    </span>
                                    <span className="text-[14px] font-bold">{d.getDate()}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Final Stats Pills */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-white/40 backdrop-blur-md rounded-[28px] p-5 border border-white/60 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Стрик</span>
                            <span className="text-[20px] font-bold text-[#1a1a1a]">{stats.streak} дн.</span>
                        </div>
                        <Star size={20} className="text-[#C497A0]" fill="currentColor" />
                    </div>

                    <div className="bg-white/40 backdrop-blur-md rounded-[28px] p-5 border border-white/60 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Время</span>
                            <span className="text-[20px] font-bold text-[#1a1a1a]">{reminderTime}</span>
                        </div>
                        <Clock size={20} className="text-gray-400" strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
            <BottomNav />
        </main>
    );
}
