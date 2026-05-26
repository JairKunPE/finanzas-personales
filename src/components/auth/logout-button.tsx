"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
      aria-label="Cerrar sesion"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden lg:inline">{loading ? "Saliendo..." : "Salir"}</span>
    </button>
  );
}
