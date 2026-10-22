import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatMoney } from "./format";

describe("formatMoney", () => {
  it("separates thousands with spaces and adds soʻm", () => {
    expect(formatMoney(12450000)).toBe("12 450 000 soʻm");
  });
  it("handles small and zero amounts", () => {
    expect(formatMoney(500)).toBe("500 soʻm");
    expect(formatMoney(0)).toBe("0 soʻm");
  });
});

describe("formatDate", () => {
  it("formats calendar dates as DD.MM.YYYY without timezone shift", () => {
    expect(formatDate("2026-03-05")).toBe("05.03.2026");
  });
  it("formats timestamps in Tashkent time", () => {
    expect(formatDate("2026-10-21T20:30:00Z")).toBe("22.10.2026");
  });
});

describe("formatDateTime", () => {
  it("formats as DD.MM.YYYY HH:mm in Tashkent time", () => {
    expect(formatDateTime("2026-10-21T09:05:00Z")).toBe("21.10.2026 14:05");
  });
});
