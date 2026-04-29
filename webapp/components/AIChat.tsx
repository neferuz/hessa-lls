"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, Loader2, ArrowUp, User, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import Typewriter from "./Typewriter";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const storageKey = "hessa_chat_history";

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem(storageKey);
        if (savedHistory) {
            try {
                setMessages(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse chat history", e);
                initChat();
            }
        } else {
            initChat();
        }
    }, []);

    // Save history to localStorage on every change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(messages));
        }
    }, [messages]);

    const initChat = () => {
        setMessages([
            { role: "assistant", content: "Здравствуйте! Я ваш персональный нутрициолог Hessa. Спросите меня о наших продуктах или расскажите о своем самочувствии, и я подберу лучшее решение." }
        ]);
    };

    const clearChat = () => {
        if (confirm("Очистить историю чата?")) {
            localStorage.removeItem(storageKey);
            initChat();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");

        const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const history = newMessages.map(m => ({ role: m.role, content: m.content }));

            const res = await fetch(`${API_BASE_URL}/api/chat/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: history })
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Извините, сейчас я не могу ответить. Пожалуйста, попробуйте позже." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden relative font-manrope h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-40 scroll-smooth">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto flex-row"}`}
                    >
                        {/* Avatar */}
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-auto mb-1 bg-[#fcf5f6] text-[#C497A0] border border-[#C497A0]/10">
                                <Bot size={14} />
                            </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`py-3 px-4 text-[14px] leading-relaxed relative ${msg.role === "user"
                            ? "bg-[#1a1a1a] text-white rounded-[20px] rounded-br-[2px]"
                            : "bg-[#fcf5f6] text-[#1a1a1a] rounded-[20px] rounded-bl-[2px] border border-[#C497A0]/5"
                            }`}>
                            {msg.role === "assistant" && idx === messages.length - 1 && isLoading === false && messages.length > 1 ? (
                                <Typewriter text={msg.content} speed={20} />
                            ) : (
                                msg.content
                            )}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mr-auto max-w-[90%]">
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[#fcf5f6] text-[#C497A0] mt-auto mb-1 border border-[#C497A0]/10">
                            <Bot size={14} />
                        </div>
                        <div className="bg-[#fcf5f6] py-3.5 px-5 rounded-[20px] rounded-bl-[2px] border border-[#C497A0]/5">
                            <div className="flex gap-1.5">
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1 h-1 bg-[#C497A0] rounded-full" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 bg-[#C497A0] rounded-full" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 bg-[#C497A0] rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area - Compact Hessa Style */}
            <div className="absolute bottom-0 left-0 right-0 z-40 px-6 pb-8 flex flex-col items-center pointer-events-none">
                <button 
                    onClick={clearChat}
                    className="pointer-events-auto mb-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                    <RotateCcw size={12} />
                    Очистить чат
                </button>
                <div className="pointer-events-auto w-full bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-[28px] p-1.5 flex items-end gap-2 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Написать сообщение..."
                        className="flex-1 bg-transparent max-h-[120px] min-h-[44px] py-3 pl-4 text-[14px] font-medium text-[#1a1a1a] placeholder:text-gray-300 outline-none resize-none scrollbar-hide"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="w-11 h-11 shrink-0 bg-[#C497A0] hover:bg-[#b3868f] text-white rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:scale-100"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={3} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
