import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DashboardMonthSelector } from "@/components/dashboard/dashboard-month-selector";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("DashboardMonthSelector", () => {
  it("pushes selected month to the dashboard query string", () => {
    render(<DashboardMonthSelector selectedMonth="2026-05" />);
    fireEvent.change(screen.getByLabelText("Mes del dashboard"), { target: { value: "2026-04" } });
    expect(push).toHaveBeenCalledWith("/?month=2026-04");
  });
});
