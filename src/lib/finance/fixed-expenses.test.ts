import { describe, expect, it } from "vitest";

import { calculateMonthlyEquivalent, calculateNextBillingDate, isDueSoon } from "@/lib/finance/fixed-expenses";

describe("fixed expense calculations", () => {
  it("calculates monthly equivalent by cycle", () => {
    expect(calculateMonthlyEquivalent(120, "annual")).toBe(10);
    expect(calculateMonthlyEquivalent(60, "quarterly")).toBe(20);
  });

  it("calculates next billing date", () => {
    expect(calculateNextBillingDate("2026-01-15", "quarterly")).toBe("2026-04-15");
  });

  it("detects due soon dates", () => {
    expect(isDueSoon("2026-05-20", new Date("2026-05-17T00:00:00Z"))).toBe(true);
    expect(isDueSoon("2026-06-20", new Date("2026-05-17T00:00:00Z"))).toBe(false);
  });
});
