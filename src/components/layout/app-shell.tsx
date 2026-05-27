"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bell, FileBarChart, Home, ListFilter, Menu, Plus, Tags, Target, User } from "lucide-react";

import { SidebarDrawer } from "@/components/layout/sidebar-drawer";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Movimientos", icon: ListFilter },
  { href: "/transactions/new", label: "", icon: Plus, isFab: true },
  { href: "/budgets", label: "Presupuestos", icon: Target },
  { href: "/reports", label: "Reportes", icon: FileBarChart },
  { href: "/categories", label: "Categorias", icon: Tags },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Movimientos",
  "/categories": "Categorias",
  "/budgets": "Presupuestos",
  "/reports": "Reportes",
  "/cards": "Tarjetas",
  "/fixed-expenses": "Gastos Fijos",
  "/transactions/new": "Nueva transaccion",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAuthPage = pathname === "/login";

  const pageTitle = pageTitles[pathname] ?? (pathname.startsWith("/transactions/") ? "Editar transaccion" : "");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Top Header */}
      <header
        className="sticky top-0 z-30 bg-background/80 px-4 py-3 backdrop-blur"
        style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="leading-tight text-right">
              <p className="text-sm text-muted-foreground">{greeting()}!</p>
              <p className="text-base font-bold">{pageTitle}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-1">
          <ThemeToggle />
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface hover:bg-muted"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 px-4 pb-32 pt-4"
        style={{
          paddingBottom: "calc(8rem + env(safe-area-inset-bottom, 0px))",
          paddingLeft: "calc(1rem + env(safe-area-inset-left, 0px))",
          paddingRight: "calc(1rem + env(safe-area-inset-right, 0px))",
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface/90 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="relative mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {navItems.map((item) => {
            if (item.isFab) {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex flex-col items-center"
                  aria-label="Nuevo movimiento"
                >
                  <div
                    className={`relative -mt-8 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition ${
                      active
                        ? "bg-secondary text-secondary-foreground shadow-secondary/40"
                        : "bg-secondary text-secondary-foreground shadow-secondary/25"
                    }`}
                    style={{ boxShadow: active ? "0 4px 20px rgba(0,194,168,0.4)" : "0 4px 16px rgba(0,194,168,0.25)" }}
                  >
                    <Plus className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                  <span className="mt-1 text-[10px] text-muted-foreground">Nuevo</span>
                </Link>
              );
            }

            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5"
              >
                <item.icon
                  className={`h-5 w-5 transition ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-medium transition ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
