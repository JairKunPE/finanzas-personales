import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SummaryCards } from "@/components/dashboard/summary-cards";

describe("SummaryCards", () => {
  it("renders balance, income and expenses", () => {
    render(<SummaryCards balance={1500} monthlyIncome={2500} monthlyExpenses={1000} />);

    expect(screen.getByText("Saldo actual")).toBeInTheDocument();
    expect(screen.getByText("Ingresos del mes")).toBeInTheDocument();
    expect(screen.getByText("Gastos del mes")).toBeInTheDocument();
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });
});
