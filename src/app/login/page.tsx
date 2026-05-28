"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  password: z.string().min(1, "La contrasena es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });
      if (response.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        const payload = await response.json().catch(() => ({ message: "Error al iniciar sesion" }));
        setError(payload.message ?? "Error al iniciar sesion");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
            <Lock className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-card-foreground">Finanzas Personales</h1>
            <p className="text-sm text-muted-foreground">Ingresa tu contrasena</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              placeholder="Contrasena"
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              {...register("password")}
            />
            {errors.password && <p className="mt-1 text-xs text-expense">{errors.password.message}</p>}
          </div>

          {error && <p className="text-center text-sm text-expense">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
