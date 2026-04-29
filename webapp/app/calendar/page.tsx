"use client";
import { useState, useEffect } from "react";
import { Zap, Star, Clock, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import clsx from "clsx";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [stats, setStats] = useState({ streak: 0, monthTotal: 0, percentage: 0 });
    const [takenDays, setTakenDays] = useState<Record<string, boolean>>({});
    const [reminderTime, setReminderTime] = useState("09:00");

    useEffect(() => {
        const saved = localStorage.getItem("vitamin_tracker");
        if (saved) setTakenDays(JSON.parse(saved));

        const savedReminder = localStorage.getItem("vitamin_reminders");
        if (savedReminder) {
            const { time } = JSON.parse(savedReminder);
            setReminderTime(time);
        }
    }, []);

    useEffect(() => {
        calculateStats();
    }, [takenDays]);

    const calculateStats = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const monthTotal = Object.keys(takenDays).filter(d => d.startsWith(`${year}-${month}`) && takenDays[d]).length;
        
        let streak = 0;
        let d = new Date();
        while (true) {
            const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (takenDays[dStr]) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }
        setStats({ streak, monthTotal, percentage: Math.round((monthTotal / 30) * 100) });
    };

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => {
        let firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const toggleDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
        const newTakenDays = { ...takenDays, [dateStr]: !takenDays[dateStr] };
        setTakenDays(newTakenDays);
        localStorage.setItem("vitamin_tracker", JSON.stringify(newTakenDays));
    };

    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const days = [];
    const firstDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) days.push(i);

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
    };

    return (
        <main className="min-h-screen pb-20 relative max-w-md mx-auto overflow-hidden font-manrope">
            <div className="absolute top-[10%] left-[-10%] w-64 h-64 bg-[#C497A0]/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-80 h-80 bg-[#C497A0]/8 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
                <Header />
                
                <div className="px-6">
                    <h1 className="text-[24px] font-bold leading-[1.1] text-[#1a1a1a] tracking-tight mb-5 mt-2">Трекер <br/>здоровья</h1>

                    <div className="relative bg-white rounded-[28px] p-5 border border-gray-100 mb-5 overflow-hidden">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="text-[38px] font-bold text-[#1a1a1a] leading-none mb-1">{stats.monthTotal}</div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Наборов за месяц</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#fcf5f6] flex items-center justify-center text-[#C497A0]"><Zap size={20} fill="currentColor" /></div>
                        </div>
                        <div className="bg-[#fcf5f6] rounded-[20px] p-3 flex items-center justify-between border border-[#C497A0]/5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-[#C497A0]/5"><Activity size={18} className="text-[#C497A0]" /></div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-[#1a1a1a]">Цель на месяц</h4>
                                    <p className="text-[10px] font-medium text-gray-400">{stats.percentage}% выполнено</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[28px] p-5 border border-gray-100 mb-5">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] tracking-tight">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                            <div className="flex gap-1.5">
                                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400"><ChevronLeft size={14} /></button>
                                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400"><ChevronRight size={14} /></button>
                            </div>
                        </div>
                        <div className="min-h-[240px]">
                            <div className="grid grid-cols-7 gap-y-2 gap-x-2">
                                {weekDays.map(wd => <div key={wd} className="text-[10px] font-black text-gray-300 uppercase text-center mb-1">{wd}</div>)}
                                {days.map((day, i) => {
                                    if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;
                                    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
                                    return (
                                        <button key={day} onClick={() => toggleDay(day)} className={clsx("aspect-square rounded-[12px] flex items-center justify-center text-[13px] font-bold transition-all border", takenDays[dateStr] ? "bg-[#1a1a1a] border-[#1a1a1a] text-white" : isToday(day) ? "bg-white border-[#C497A0] text-[#1a1a1a]" : "bg-white border-gray-50 text-gray-400")}>{day}</button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-white rounded-[22px] p-4 border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Стрик</p>
                                <p className="text-[16px] font-bold text-[#1a1a1a]">{stats.streak} дн.</p>
                            </div>
                            <Star size={18} className="text-[#C497A0]" fill="currentColor" />
                        </div>
                        <div className="bg-white rounded-[22px] p-4 border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Время</p>
                                <p className="text-[16px] font-bold text-[#1a1a1a]">{reminderTime}</p>
                            </div>
                            <Clock size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </main>
    );
}
