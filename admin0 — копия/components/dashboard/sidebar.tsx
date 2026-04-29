"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Sparkles,
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  User,
  Truck,
  Tag,
  BarChart3,
  Settings,
  ChefHat,
  PhoneCall,
  Globe,
  ChevronDown,
  MessageSquare,
  HelpCircle,
  ShoppingCart,
  Flame,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Основное",
    items: [
      { title: "Дашборд", icon: LayoutDashboard, href: "/" },
      { title: "Профиль", icon: User, href: "/profile" },
    ]
  },
  {
    label: "Контент и Меню",
    items: [
      {
        title: "Управление меню",
        icon: UtensilsCrossed,
        subItems: [
          { title: "Категории", href: "/categories" },
          { title: "Блюда", href: "/dishes" },
          { title: "Стоп-лист", href: "/stoplist" },
          { title: "Популярные позиции", href: "/popular" },
        ],
      },
    ]
  },
  {
    label: "Клиенты и Заказы",
    items: [
      { title: "Заказы", icon: ShoppingCart, href: "/orders" },
      { title: "Клиенты", icon: Users, href: "/clients" },
    ]
  },
  {
    label: "Маркетинг и Финансы",
    items: [
      {
        title: "Акции и маркетинг",
        icon: Tag,
        subItems: [
          { title: "Скидки", href: "/discounts" },
          { title: "Push-уведомления", href: "/push" },
        ],
      },
      {
        title: "Финансы и отчеты",
        icon: BarChart3,
        subItems: [
          { title: "Выручка", href: "/revenue" },
          { title: "Продажи по блюдам", href: "/sales-items" },
          { title: "Отмены и Возвраты", href: "/returns" },
        ],
      },
    ]
  },
  {
    label: "Система и Настройки",
    items: [
      {
        title: "Настройки",
        icon: Settings,
        subItems: [
          { title: "Информация о ресторане", href: "/restaurant-info" },
          { title: "Роли и Права", href: "/roles" },
          { title: "Интеграции", href: "/integrations" },
        ],
      },
    ]
  }
];

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((i) => i !== title) : [...prev, title]
    );
  };

  useEffect(() => {
    if (!mounted) return;
    NAV_GROUPS.forEach(group => {
      group.items.forEach(item => {
        if (item.subItems?.some(sub => sub.href === pathname)) {
          setOpenItems(prev => prev.includes(item.title) ? prev : [...prev, item.title]);
        }
      });
    });
  }, [pathname, mounted]);

  if (!mounted) return <Sidebar className="lg:border-r-0!" collapsible="offcanvas" {...props} />;

  return (
    <Sidebar className="lg:border-r-0!" collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-12 border-none">
        <Link href="/" className="flex h-full items-center gap-2.5 px-3">
          <div className="flex aspect-square size-6.5 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/5 transition-transform hover:scale-110 duration-500">
            <Flame className="size-3.5 fill-current" />
          </div>
          <div className="flex flex-col gap-0 leading-none">
            <span className="text-[11px] font-semibold tracking-tight text-foreground uppercase">SUSHI LAB</span>
            <div className="flex items-center gap-1.5 pt-0.5 leading-none">
              <span className="text-[7px] font-semibold text-muted-foreground uppercase tracking-widest opacity-30">System</span>
              <span className="size-1 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1.5 scrollbar-none space-y-2">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="p-0">
             <SidebarGroupLabel className="text-[9px] font-semibold uppercase tracking-tight text-muted-foreground/30 px-3 py-3 h-auto leading-none">
               {group.label}
             </SidebarGroupLabel>
             <SidebarMenu className="gap-0.5">
               {group.items.map((item) => (
                 item.subItems && item.subItems.length > 0 ? (
                   <Collapsible key={item.title} open={openItems.includes(item.title)} onOpenChange={() => toggleItem(item.title)}>
                     <SidebarMenuItem>
                       <CollapsibleTrigger asChild>
                         <SidebarMenuButton className="h-8.5 w-full justify-between px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors">
                           <div className="flex items-center gap-2.5">
                             <item.icon className="size-4 opacity-70" />
                             <span className="text-[13px] tracking-tight">{item.title}</span>
                           </div>
                           <ChevronDown className={cn("size-3 transition-transform opacity-40", openItems.includes(item.title) && "rotate-180")} />
                         </SidebarMenuButton>
                       </CollapsibleTrigger>
                       <CollapsibleContent className="overflow-hidden">
                         <div className="mt-0.5 mb-1 flex flex-col gap-0 border-l border-border/30 ml-4.5 pl-2">
                           {item.subItems.map((sub: any) => (
                             <SidebarMenuButton 
                               key={sub.title} 
                               asChild
                               isActive={pathname === sub.href}
                               className={cn(
                                 "h-8 w-full justify-start px-2.5 text-[13px] font-medium transition-all rounded-md",
                                 pathname === sub.href 
                                   ? "bg-primary/10 text-primary hover:bg-primary/15" 
                                   : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/40"
                               )}
                             >
                               <Link href={sub.href}>
                                 {sub.title}
                               </Link>
                             </SidebarMenuButton>
                           ))}
                         </div>
                       </CollapsibleContent>
                     </SidebarMenuItem>
                   </Collapsible>
                 ) : (
                   <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton 
                       asChild
                       isActive={pathname === item.href}
                       className={cn(
                         "h-8.5 w-full justify-start px-2.5 text-sm font-medium transition-colors rounded-lg",
                         pathname === item.href
                           ? "bg-primary/10 text-primary hover:bg-primary/15"
                           : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                       )}
                     >
                       <Link href={item.href || "#"}>
                         <div className="flex items-center gap-2.5">
                           <item.icon className="size-4 opacity-70" />
                           <span className="text-[13px] tracking-tight">{item.title}</span>
                         </div>
                       </Link>
                     </SidebarMenuButton>
                   </SidebarMenuItem>
                 )
               ))}
             </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/40">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton className="h-8 text-[12.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md px-2.5">
              <Bell className="size-3.5 opacity-60" />
              <span>Notifications</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-8 text-[12.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md px-2.5">
              <Sparkles className="size-3.5 opacity-60" />
              <span>AI Insights</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-8 text-[12.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md px-2.5">
              <HelpCircle className="size-3.5 opacity-60" />
              <span>Help Center</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
