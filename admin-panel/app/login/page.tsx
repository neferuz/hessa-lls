"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Lock, User as UserIcon, AlertCircle, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { API_BASE_URL } from "@/lib/config";
import clsx from "clsx";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const admin = localStorage.getItem("hessaAdmin");
        if (admin) {
            router.push("/");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.detail || "Неверный логин или пароль");
                return;
            }

            localStorage.setItem("hessaAdmin", JSON.stringify(data));
            router.push("/");
        } catch (e) {
            console.error(e);
            setError("Ошибка сети при авторизации");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-[400px]"
            >
                <Card className="border-border/60 overflow-hidden shadow-none rounded-xl">
                    <div className="p-8 pt-10">
                        <div className="flex flex-col items-center mb-8 text-center">
                            <span className="text-[28px] font-black tracking-[-0.04em] text-foreground font-[family-name:var(--font-unbounded)] uppercase mb-2">Hessa</span>
                            <h1 className="text-sm font-semibold tracking-tight text-muted-foreground/60 uppercase tracking-widest">Admin Terminal</h1>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2.5 rounded-md text-xs font-medium flex items-center gap-2">
                                    <AlertCircle className="size-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="username" className="text-xs font-medium text-foreground/70">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="admin"
                                    className="h-10 rounded-md bg-background border-border focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-medium text-foreground/70">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="h-10 rounded-md bg-background border-border focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 rounded-md font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all mt-2"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </div>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground/50 font-medium">
                        HESSA LLS • Administration Terminal
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

