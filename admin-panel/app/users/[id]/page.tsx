"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Shield,
    User as UserIcon,
    Package,
    Wallet,
    ShoppingBag,
    History,
    Settings,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    FileText,
    Sparkles,
    Wallet as WalletIcon,
    Calendar as CalendarIcon,
    CreditCard,
    MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageHeader } from "@/components/dashboard/use-page-header";
import { QuizComponent } from "@/components/dashboard/quiz-component";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";

const mockPeople: any[] = [];
const getRecommendations = (answers: any): any[] => [];
type Order = any;

const statusConfig = {
    pending: { label: "Ожидает", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    processing: { label: "В обработке", icon: Loader2, color: "text-blue-500", bg: "bg-blue-500/10" },
    completed: { label: "Завершен", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    cancelled: { label: "Отменен", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

function formatDate(dateString: string | Date) {
    if (!dateString) return 'Не указано';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return 'Не указано';
    return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;
    
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [programData, setProgramData] = useState<any>(null);
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    usePageHeader({
        title: (
            <div className="flex items-center gap-2">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="size-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors mr-1"
                >
                    <ArrowLeft className="size-4" />
                </Button>
                <UserIcon className="size-5 text-primary" />
                <h1 className="text-base font-bold tracking-tight text-[family-name:var(--font-unbounded)] uppercase">
                    {user ? user.full_name || user.username : "Профиль клиента"}
                </h1>
            </div>
        ),
        description: user ? `Управление профилем и историей заказов ${user.username}` : "Загрузка данных клиента..."
    });
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    
                    const checkoutData = localStorage.getItem("hessaCheckout");
                    if (checkoutData) {
                        try {
                            const checkout = JSON.parse(checkoutData);
                            if (checkout.email === userData.email) {
                                setProgramData({
                                    duration: checkout.duration || 1,
                                    address: checkout.address || userData.address,
                                    region: checkout.region || userData.region,
                                    products: getRecommendations([]), 
                                    purchaseDate: checkout.purchaseDate || userData.createdAt,
                                });
                            }
                        } catch (e) {
                            console.error("Failed to parse checkout data", e);
                        }
                    }
                } else {
                    const mockUser = mockPeople.find((p) => p.id === userId) || mockPeople[0];
                    setUser(mockUser);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                const mockUser = mockPeople.find((p) => p.id === userId) || mockPeople[0];
                setUser(mockUser);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return;
            
            setOrdersLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const orders = await response.json();
                    const formattedOrders = orders.map((order: any) => ({
                        id: order.id,
                        orderNumber: order.order_number,
                        status: order.status,
                        paymentStatus: order.payment_status,
                        paymentMethod: order.payment_method,
                        createdAt: order.created_at,
                        completedAt: order.completed_at,
                        totalAmount: `${order.total_amount?.toLocaleString('ru-RU')} сум` || '0 сум',
                        items: order.products ? order.products.map((product: any, index: number) => ({
                            id: product.id || `item-${index}`,
                            productName: product.name || product.productName || 'Товар',
                            quantity: product.quantity || 1,
                            price: `${product.price?.toLocaleString('ru-RU')} сум` || '0 сум',
                        })) : [],
                        region: order.region,
                        address: order.address,
                    }));
                    setUserOrders(formattedOrders);
                } else {
                    setUserOrders([]);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setUserOrders([]);
            } finally {
                setOrdersLoading(false);
            }
        };
        
        fetchOrders();
    }, [userId]);

    const mockQuizAnswers = [
        { questionId: "1", optionIds: ["1-1"] }, 
        { questionId: "2", optionIds: ["2-3"] }, 
        { questionId: "3", optionIds: ["3-1", "3-2"] }, 
        { questionId: "4", optionIds: ["4-2"] }, 
    ];

    const userRecommendations = programData?.products || getRecommendations(mockQuizAnswers);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        jobTitle: '',
    });

    useEffect(() => {
        if (user) {
            setEditedUser({
                name: user.username || user.email?.split('@')[0] || '',
                email: user.email || '',
                phone: user.phone ? `+998 ${user.phone}` : '',
                address: user.address || user.region ? `${user.region || ''}${user.region && user.address ? ', ' : ''}${user.address || ''}` : '',
                jobTitle: 'Пользователь',
            });
        }
    }, [user]);

    const paymentMethodLabels: Record<string, string> = {
        card: "Банковская карта",
        cash: "Наличные",
        bank_transfer: "Банковский перевод",
        online: "Онлайн платеж",
    };

    const paymentStatusLabels: Record<string, string> = {
        paid: "Оплачено",
        pending: "Ожидает оплаты",
        failed: "Ошибка оплаты",
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-muted-foreground">Загрузка...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-muted-foreground">Пользователь не найден</div>
            </div>
        );
    }

    return (
        <>

            <div className="w-full overflow-y-auto p-6 space-y-8 text-left">
                {/* Hero Section */}
                <div className="relative">
                    <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/5 overflow-hidden relative">
                        <div className="absolute inset-0 bg-grid-white/10" />
                        <div className="absolute bottom-0 right-0 p-8 opacity-10">
                            <UserIcon className="size-32" />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end gap-6 px-8 -mt-12 relative z-10">
                        <div className="size-24 sm:size-32 rounded-3xl bg-card border-4 border-background flex items-center justify-center overflow-hidden">
                            <UserIcon className="size-16 text-muted-foreground" />
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold tracking-tight">{user.username || user.email?.split('@')[0] || 'Пользователь'}</h2>
                                <div className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                )}>
                                    Активен
                                </div>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                <Shield className="size-3.5" />
                                Пользователь
                            </p>
                        </div>
                        <div className="flex gap-2 pb-2">
                            <Button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="h-10 rounded-2xl gap-2 font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Редактировать
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-10 w-10 rounded-2xl"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                    {/* Left Column: Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card border rounded-3xl p-6 space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Основная информация</h3>

                            <div className="space-y-4 font-normal">
                                <div className="flex items-center gap-4 group">
                                    <div className="size-10 rounded-2xl bg-muted/40 flex items-center justify-center transition-colors group-hover:bg-primary/5">
                                        <Mail className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Email</p>
                                        <p className="text-sm font-medium">{user.email || 'Не указано'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="size-10 rounded-2xl bg-muted/40 flex items-center justify-center transition-colors group-hover:bg-primary/5">
                                        <Phone className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Телефон</p>
                                        <p className="text-sm font-medium">{user.phone ? (user.phone.startsWith('+998') ? user.phone : `+998 ${user.phone}`) : 'Не указано'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="size-10 rounded-2xl bg-muted/40 flex items-center justify-center transition-colors group-hover:bg-primary/5">
                                        <MapPin className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Адрес доставки</p>
                                        <p className="text-sm font-medium">
                                            {user.region || user.address ? (
                                                <>
                                                    {user.region ? `${user.region}${user.address ? ', ' : ''}` : ''}
                                                    {user.address || ''}
                                                </>
                                            ) : (
                                                'Не указано'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Моя программа */}
                        {(programData || user.region || user.address) && (
                            <div className="bg-card border rounded-3xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Package className="size-4 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                                        Моя программа
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {programData?.purchaseDate && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarIcon className="size-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Дата оформления:</span>
                                            <span className="font-medium">
                                                {new Date(programData.purchaseDate).toLocaleDateString("ru-RU", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    {programData?.duration && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="size-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Период:</span>
                                            <span className="font-medium">{programData.duration} месяц(а)</span>
                                        </div>
                                    )}
                                    {(programData?.address || user.address || programData?.region || user.region) && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin className="size-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <span className="text-muted-foreground">Адрес доставки:</span>
                                                <p className="font-medium">
                                                    {(programData?.region || user.region) ? `${programData?.region || user.region}${(programData?.address || user.address) ? ', ' : ''}` : ''}
                                                    {programData?.address || user.address || ''}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {!programData && !user.region && !user.address && (
                                        <div className="text-sm text-muted-foreground">
                                            Программа не оформлена
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Orders */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Orders Section */}
                        <div className="bg-card border rounded-3xl overflow-hidden">
                            <div className="p-6 border-b flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="size-4 text-muted-foreground" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest">История заказов</h3>
                                </div>
                                <span className="text-sm text-muted-foreground">{userOrders.length} заказов</span>
                            </div>
                            <div className="divide-y divide-border">
                                {ordersLoading ? (
                                    <div className="p-6 text-center text-muted-foreground">
                                        Загрузка заказов...
                                    </div>
                                ) : userOrders.length > 0 ? (
                                    userOrders.map((order) => {
                                        const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                                        const StatusIcon = status.icon;
                                        return (
                                            <div key={order.id} className="p-6 hover:bg-muted/30 transition-colors">
                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                                                            >
                                                                {order.orderNumber}
                                                            </button>
                                                            <div className={cn(
                                                                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                                                status.bg,
                                                                status.color
                                                            )}>
                                                                <StatusIcon className="size-3" />
                                                                {status.label}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-muted-foreground">
                                                                Заказано: {order.createdAt ? formatDate(order.createdAt) : 'Не указано'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-foreground mb-1">
                                                            {order.totalAmount}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {order.items && order.items.length > 0 && (
                                                    <div className="space-y-2">
                                                        {order.items.map((item: any) => (
                                                            <div
                                                                key={item.id}
                                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center">
                                                                        <Package className="size-5 text-muted-foreground" />
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <p className="text-sm font-medium text-foreground">
                                                                            {item.productName}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Количество: {item.quantity}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-sm font-medium text-foreground tabular-nums">
                                                                    {item.price}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-muted-foreground">
                                        Заказов пока нет
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно с деталями заказа */}
            <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl text-left">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl">Детали заказа</DialogTitle>
                                <DialogDescription>
                                    Полная информация о заказе {selectedOrder.orderNumber}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <ShoppingBag className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Номер заказа</p>
                                                <p className="text-base font-semibold text-foreground">{selectedOrder.orderNumber}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                                            statusConfig[selectedOrder.status as keyof typeof statusConfig].bg,
                                            statusConfig[selectedOrder.status as keyof typeof statusConfig].color
                                        )}>
                                            {React.createElement(statusConfig[selectedOrder.status as keyof typeof statusConfig].icon, { className: "size-3" })}
                                            {statusConfig[selectedOrder.status as keyof typeof statusConfig].label}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CalendarIcon className="size-4 text-muted-foreground" />
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Дата заказа</p>
                                            </div>
                                            <p className="text-sm font-medium text-foreground">{formatDate(selectedOrder.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                        Товары в заказе
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item: any) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="size-12 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                                                        <Package className="size-6 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-foreground mb-1">
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Количество: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-foreground tabular-nums">{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-border bg-muted/30">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                        Информация об оплате
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <WalletIcon className="size-4 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">Способ оплаты</p>
                                            </div>
                                            <p className="text-sm font-medium text-foreground">
                                                {paymentMethodLabels[selectedOrder.paymentMethod]}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="size-4 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">Статус оплаты</p>
                                            </div>
                                            <div className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                selectedOrder.paymentStatus === "paid"
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : selectedOrder.paymentStatus === "pending"
                                                    ? "bg-amber-500/10 text-amber-600"
                                                    : "bg-red-500/10 text-red-600"
                                            )}>
                                                {paymentStatusLabels[selectedOrder.paymentStatus]}
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-border">
                                            <div className="flex items-center justify-between">
                                                <p className="text-base font-semibold text-foreground">Итого</p>
                                                <p className="text-xl font-bold text-foreground tabular-nums">{selectedOrder.totalAmount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Модальное окно редактирования пользователя */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-lg rounded-2xl text-left">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Редактировать пользователя</DialogTitle>
                        <DialogDescription>
                            Измените информацию о пользователе
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Имя</Label>
                            <Input
                                id="name"
                                value={editedUser.name}
                                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                placeholder="Введите имя"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editedUser.email}
                                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                placeholder="Введите email"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Телефон</Label>
                            <Input
                                id="phone"
                                value={editedUser.phone}
                                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                                placeholder="Введите телефон"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Адрес</Label>
                            <Input
                                id="address"
                                value={editedUser.address}
                                onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                                placeholder="Введите адрес"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Должность</Label>
                            <Input
                                id="jobTitle"
                                value={editedUser.jobTitle}
                                onChange={(e) => setEditedUser({ ...editedUser, jobTitle: e.target.value })}
                                placeholder="Введите должность"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={() => {
                                setIsEditModalOpen(false);
                            }}
                        >
                            Сохранить изменения
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
