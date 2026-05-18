import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LatestTransactions } from "@/components/dashboard/latest-transactions";
import type { TransactionDto } from "@/lib/api/transactions";

describe("LatestTransactions", () => {
  it("renders an empty state", () => {
    render(<LatestTransactions transactions={[]} />);
    expect(screen.getByText("Aun no hay movimientos")).toBeInTheDocument();
  });

  it("renders populated transactions", () => {
    const transaction: TransactionDto = {
      id: 1,
      type: "expense",
      amount: 120,
      originalAmount: 120,
      currency: "PEN",
      exchangeRate: 1,
      amountPen: 120,
      isRecurring: false,
      billingCycle: null,
      nextBillingDate: null,
      description: "Supermercado",
      categoryId: 1,
      categoryName: "Comida",
      categoryIcon: "Utensils",
      categoryColor: "#f97316",
      date: "2026-05-17",
      createdAt: "2026-05-17T00:00:00.000Z",
      updatedAt: null,
    };

    render(<LatestTransactions transactions={[transaction]} />);
    expect(screen.getByText("Supermercado")).toBeInTheDocument();
    expect(screen.getByText(/Comida/)).toBeInTheDocument();
  });

  it("renders USD original amount and PEN equivalent", () => {
    const transaction: TransactionDto = {
      id: 2,
      type: "income",
      amount: 10,
      originalAmount: 10,
      currency: "USD",
      exchangeRate: 3.75,
      amountPen: 37.5,
      isRecurring: false,
      billingCycle: null,
      nextBillingDate: null,
      description: "Freelance",
      categoryId: 1,
      categoryName: "Otros",
      categoryIcon: "CircleEllipsis",
      categoryColor: "#64748b",
      date: "2026-05-17",
      createdAt: "2026-05-17T00:00:00.000Z",
      updatedAt: null,
    };

    render(<LatestTransactions transactions={[transaction]} />);
    expect(screen.getByText("Freelance")).toBeInTheDocument();
    expect(screen.getByText(/\$10\.00/)).toBeInTheDocument();
  });
});
