"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUsdToPen, useCurrencySettings } from "@/lib/api/settings";

type FormValues = { usdToPen: number };

export function CurrencySettingsCard() {
  const { data } = useCurrencySettings();
  const form = useForm<FormValues>({ defaultValues: { usdToPen: data?.usdToPen ?? 3.75 } });

  useEffect(() => {
    if (data?.usdToPen) form.setValue("usdToPen", data.usdToPen);
  }, [data?.usdToPen, form]);

  async function onSubmit(values: FormValues) {
    try {
      await updateUsdToPen(values.usdToPen);
      toast.success("Tipo de cambio actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el tipo de cambio");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moneda</CardTitle>
        <p className="text-sm text-muted-foreground">Moneda base PEN. Actualiza manualmente el tipo de cambio USD a PEN.</p>
      </CardHeader>
      <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="grid flex-1 gap-2 text-sm font-medium">
          USD a PEN
          <input className="min-h-11 rounded-xl border bg-background px-3" type="number" step="0.001" min="0.001" {...form.register("usdToPen", { valueAsNumber: true })} />
        </label>
        <Button type="submit" disabled={form.formState.isSubmitting}>Guardar tipo de cambio</Button>
      </form>
    </Card>
  );
}
