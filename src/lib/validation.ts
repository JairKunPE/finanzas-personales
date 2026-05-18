import { z } from "zod";

export const transactionTypeSchema = z.enum(["income", "expense"]);
export const currencySchema = z.enum(["PEN", "USD"]);
export const billingCycleSchema = z.enum(["monthly", "quarterly", "semiannual", "annual"]);

export const transactionInputSchema = z.object({
  type: transactionTypeSchema,
  amount: z.number().positive("El monto debe ser mayor a 0"),
  currency: currencySchema,
  exchangeRate: z.number().positive("El tipo de cambio debe ser mayor a 0").optional(),
  description: z.string().trim().min(1, "La descripcion es obligatoria"),
  categoryId: z.number().int().positive("Selecciona una categoria"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa una fecha valida"),
  isRecurring: z.boolean(),
  billingCycle: billingCycleSchema.optional(),
}).superRefine((value, context) => {
  if (value.isRecurring && value.type !== "expense") {
    context.addIssue({ code: "custom", path: ["isRecurring"], message: "Solo los gastos pueden marcarse como fijos" });
  }
  if (value.isRecurring && !value.billingCycle) {
    context.addIssue({ code: "custom", path: ["billingCycle"], message: "Selecciona un ciclo de facturacion" });
  }
});

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  type: transactionTypeSchema.optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  period: z.enum(["current-month", "previous-month", "last-3-months", "last-year", "custom"]).optional(),
  month: z.string().regex(/^\d{2}$/).optional(),
  year: z.string().regex(/^\d{4}$/).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const currencySettingsSchema = z.object({
  usdToPen: z.coerce.number().positive("El tipo de cambio debe ser mayor a 0"),
});

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  color: z.string().trim().min(1),
});

export const budgetInputSchema = z.object({
  categoryId: z.number().int().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  limitAmount: z.number().positive(),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
