"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  CheckSquare,
  Image,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import { staggerNavItems } from "@/src/animations/sidebarAnimation";
import { ensureGsapRegistered } from "@/lib/gsap/register";

ensureGsapRegistered();

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", href: "/leads", icon: Briefcase },
  { title: "Clients", href: "/clients", icon: Users },
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { title: "Tasks", href: "/tasks", icon: CheckSquare },
  { title: "Assets", href: "/assets", icon: Image },
  { title: "Invoices", href: "/invoices", icon: Receipt },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navAnimated = useRef(false);

  useGSAP(
    () => {
      if (navAnimated.current) return;
      navAnimated.current = true;
      const tl = staggerNavItems(navRef.current);
      return () => {
        tl?.kill();
      };
    },
    { scope: navRef },
  );

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const tween = gsap.to(el, {
      width: collapsed ? 72 : 260,
      duration: 0.4,
      ease: "power3.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [collapsed]);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "relative hidden lg:flex flex-col min-h-screen border-r border-white/8 bg-black/20 backdrop-blur-xl",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      <div className="flex items-center justify-between p-5 border-b border-white/8">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">SkiaFlow</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Workspace
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      <nav ref={navRef} className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-nav-item
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-300",
                isActive
                  ? "bg-gradient-to-r from-pink-600/20 to-rose-600/10 text-pink-300 border border-pink-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
