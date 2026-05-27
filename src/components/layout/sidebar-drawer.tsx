"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;

const menuItems = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/transactions", label: "Movimientos", icon: "ListFilter" },
  { href: "/categories", label: "Categorias", icon: "Tags" },
  { href: "/fixed-expenses", label: "Gastos Fijos", icon: "Repeat" },
  { href: "/budgets", label: "Presupuestos", icon: "Target" },
  { href: "/reports", label: "Reportes", icon: "PieChart" },
  { href: "/cards", label: "Tarjetas", icon: "CreditCard" },
];

type SidebarDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function SidebarDrawer({ open, onClose }: SidebarDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-surface transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <LucideIcons.User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="leading-tight">
                <p className="text-base font-bold">Admin</p>
                <p className="text-xs text-muted-foreground">admin@finanzas.local</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Cerrar menu"
            >
              <LucideIcons.X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-8 flex-1 space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon] || LucideIcons.CircleEllipsis;
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-primary-foreground" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mx-4 mb-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-primary hover:bg-muted transition"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <LucideIcons.LogOut className="h-5 w-5" />
            Cerrar sesion
          </button>
        </div>
      </div>
    </>
  );
}
