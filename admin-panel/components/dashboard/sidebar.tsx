"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Sparkles,
  LayoutDashboard,
  Calendar,
  Library,
  Users,
  Link as LinkIcon,
  Folder,
  ChevronDown,
  MessageSquare,
  Settings,
  HelpCircle,
  Check,
  Plus,
  ClipboardList,
  Megaphone,
  Briefcase,
  Inbox,
  CircleDashed,
  Layers,
  Map,
  LayoutGrid,
  SquareStack,
  LayoutTemplate,
  LayoutPanelTop,
  Undo2,
  MapPin,
  Flame,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
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
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Основное",
    items: [
      { title: "Дашборд", icon: LayoutDashboard, href: "/" },
      { title: "Пользователи", icon: Users, href: "/users" },
      { title: "Сотрудники", icon: Briefcase, href: "/employees" },
    ]
  },
  {
    label: "Управление",
    items: [
      { title: "Заказы", icon: ClipboardList, href: "/orders" },
      { title: "Анализы", icon: ClipboardList, href: "/analysis" },
      { title: "Товары", icon: SquareStack, href: "/products" },
      { title: "Боксы", icon: Library, href: "/sachets" },
      { title: "Категории", icon: Layers, href: "/categories" },
      { title: "Викторина", icon: HelpCircle, href: "/quiz" },
      { title: "Промокоды", icon: Megaphone, href: "/promo-codes" },
      { title: "Планы", icon: Sparkles, href: "/plans" },
    ]
  },
  {
    label: "Веб сайт",
    items: [
      {
        title: "Страницы",
        icon: LayoutTemplate,
        subItems: [
          { title: "Главная страница", href: "/main-page" },
          { title: "О нас", href: "/about" },
          { title: "Услуги", href: "/services" },
          { title: "FAQ", href: "/faq" },
          { title: "Футер", href: "/footer" },
          { title: "Компании", href: "/companies" },
          { title: "Контакты", href: "/contacts-info" },
          { title: "Возврат", href: "/return" },
        ],
      },
    ]
  },
  {
    label: "Система",
    items: [
      { title: "Обратная связь", icon: MessageSquare, href: "#" },
      { title: "Настройки", icon: Settings, href: "#" },
      { title: "Помощь", icon: HelpCircle, href: "#" },
    ]
  }
];

export const DashboardSidebar = memo(function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar className="lg:border-r-0! w-[260px]" collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-16 border-none px-6 flex items-center">
        <Link href="/" className="flex items-center gap-0 group">
          <span className="text-[18px] font-black tracking-[-0.02em] text-foreground font-[family-name:var(--font-unbounded)] uppercase">Hessa</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2.5 scrollbar-none space-y-4">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="p-0">
             <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 px-3 py-2 h-auto leading-none mb-1">
               {group.label}
             </SidebarGroupLabel>
             <SidebarMenu className="gap-0.5">
               {group.items.map((item) => (
                 item.subItems && item.subItems.length > 0 ? (
                   <Collapsible key={item.title} open={openItems.includes(item.title)} onOpenChange={() => toggleItem(item.title)}>
                     <SidebarMenuItem>
                       <CollapsibleTrigger asChild>
                         <SidebarMenuButton className="h-9 w-full justify-between px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl transition-colors">
                           <div className="flex items-center gap-2.5">
                             <item.icon className="size-4 opacity-70" />
                             <span className="text-[13px] tracking-tight">{item.title}</span>
                           </div>
                           <ChevronDown className={cn("size-3.5 transition-transform opacity-40", openItems.includes(item.title) && "rotate-180")} />
                         </SidebarMenuButton>
                       </CollapsibleTrigger>
                       <CollapsibleContent className="overflow-hidden">
                         <div className="mt-1 mb-1 flex flex-col gap-0.5 border-l border-border/30 ml-5 pl-2.5">
                           {item.subItems.map((sub: any) => (
                             <SidebarMenuButton 
                               key={sub.title} 
                               asChild
                               isActive={pathname === sub.href}
                               className={cn(
                                 "h-8 w-full justify-start px-3 text-[13px] font-medium transition-all rounded-lg",
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
                         "h-9 w-full justify-start px-3 text-sm font-medium transition-colors rounded-xl",
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

      <SidebarFooter className="p-4 border-t border-border/40">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton className="h-8 text-[12.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg px-3">
              <Bell className="size-4 opacity-60" />
              <span>Уведомления</span>
              <span className="ml-auto size-1.5 rounded-full bg-primary" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-8 text-[12.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg px-3">
              <Sparkles className="size-4 opacity-60" />
              <span>ИИ Инсайты</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
});
