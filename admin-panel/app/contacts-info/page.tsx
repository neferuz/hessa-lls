"use client";

import { useState, useEffect } from "react";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Save, Loader2, Check, Map as MapIcon, Navigation } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

export default function ContactsInfoPage() {
    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">Контактная информация</h1>
            </div>
        ),
        description: "Управление адресами, телефонами и координатами на карте"
    });

    const [contacts, setContacts] = useState<any>({
        address: "",
        address_uz: "",
        address_en: "",
        phone: "",
        email: "",
        map_lat: "",
        map_lng: "",
        working_hours: "",
        working_hours_uz: "",
        working_hours_en: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/content`);
            if (res.ok) {
                const data = await res.json();
                if (data.contacts) setContacts(data.contacts);
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const currentRes = await fetch(`${API_BASE_URL}/api/content`);
            const currentContent = await currentRes.json();
            
            const res = await fetch(`${API_BASE_URL}/api/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...currentContent, contacts }),
            });
            
            if (res.ok) toast.success("Контакты обновлены");
            else throw new Error("Save failed");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center p-20 w-full h-full"><Loader2 className="size-6 animate-spin text-primary/30" /></div>;

    return (
        <div className="flex-1 overflow-y-auto scrollbar-none p-5 sm:p-8 w-full bg-[#f8f8f9] dark:bg-[#000000]">
            <div className="max-w-4xl mx-auto space-y-6 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location Details */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-6 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <Navigation className="size-4 text-blue-500" />
                            <span className="text-[14px] font-bold">Локация</span>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">Адрес (RU)</Label>
                                <Input value={contacts.address} onChange={(e) => setContacts({...contacts, address: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">Lat</Label>
                                    <Input value={contacts.map_lat} onChange={(e) => setContacts({...contacts, map_lat: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">Lng</Label>
                                    <Input value={contacts.map_lng} onChange={(e) => setContacts({...contacts, map_lng: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Contacts Details */}
                    <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-6 shadow-none">
                        <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                            <Phone className="size-4 text-green-500" />
                            <span className="text-[14px] font-bold">Связь</span>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">Телефон</Label>
                                <Input value={contacts.phone} onChange={(e) => setContacts({...contacts, phone: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">Email</Label>
                                <Input value={contacts.email} onChange={(e) => setContacts({...contacts, email: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Working Hours */}
                <Card className="rounded-[1.5rem] border-black/[0.05] bg-white dark:bg-[#1c1c1e] p-6 space-y-6 shadow-none">
                    <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                        <Globe className="size-4 text-primary" />
                        <span className="text-[14px] font-bold">Рабочие часы</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">RU</Label>
                            <Input value={contacts.working_hours} onChange={(e) => setContacts({...contacts, working_hours: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">UZ</Label>
                            <Input value={contacts.working_hours_uz} onChange={(e) => setContacts({...contacts, working_hours_uz: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-muted-foreground/60 ml-1 uppercase">EN</Label>
                            <Input value={contacts.working_hours_en} onChange={(e) => setContacts({...contacts, working_hours_en: e.target.value})} className="h-9 bg-black/[0.02] border-0 rounded-lg text-[13px] font-medium shadow-none" />
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="h-11 px-8 rounded-full font-black bg-black dark:bg-white text-white dark:text-black shadow-none active:scale-95 transition-all"
                    >
                        {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                        Сохранить изменения
                    </Button>
                </div>
            </div>
        </div>
    );
}
