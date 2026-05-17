"use client";

import { signOut } from "@/features/auth/services/authServices";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUiStore } from "@/store/uiStore";
import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await signOut();
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-[70px] border-b border-white/8 bg-background/80 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/10"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            SkiaFlow Workspace
          </p>
          <h2 className="font-semibold text-lg">
            {profile?.full_name ?? "Dashboard"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Link href="/notifications" className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <span className="hidden sm:block text-sm text-muted-foreground max-w-[180px] truncate">
          {user?.email}
        </span>

        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
