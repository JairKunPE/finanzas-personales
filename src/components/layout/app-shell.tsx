import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, Home, PlusCircle, ReceiptText, Repeat, Tags, Wallet, LineChart } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transacciones", icon: ReceiptText },
  { href: "/categories", label: "Categorias", icon: Tags },
  { href: "/budgets", label: "Presupuestos", icon: Wallet },
  { href: "/reports", label: "Reportes", icon: LineChart },
  { href: "/fixed-expenses", label: "Gastos Fijos", icon: Repeat },
  { href: "/transactions/new", label: "Nuevo", icon: PlusCircle },
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
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full bg-card px-3 py-2 text-sm font-medium shadow-sm">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
