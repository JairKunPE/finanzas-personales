import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, Home, PlusCircle, ReceiptText, Tags, Wallet, LineChart } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transacciones", icon: ReceiptText },
  { href: "/budgets", label: "Presupuestos", icon: Wallet },
  { href: "/reports", label: "Reportes", icon: LineChart },
  { href: "/categories", label: "Categorias", icon: Tags },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r bg-card/80 p-6 backdrop-blur lg:block">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold">Finanzas</p>
            <p className="text-sm text-muted-foreground">Control local</p>
          </div>
        </div>
        <nav className="mt-8 grid gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">App personal</p>
              <h1 className="text-xl font-bold">Finanzas Personales</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 px-4 pb-28 pt-6 lg:px-8 lg:pb-6">{children}</main>
        <Link
          href="/transactions/new"
          className="fixed bottom-20 right-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-105 lg:bottom-6 lg:right-8"
          aria-label="Nueva transaccion"
        >
          <PlusCircle className="h-7 w-7" />
        </Link>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-background/95 px-2 py-2 backdrop-blur lg:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
