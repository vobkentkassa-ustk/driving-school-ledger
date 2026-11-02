import type { SettlementDemoScenario } from "@/types/domain";

/** Input checks only. No balances or settlement effects are calculated here. */
export function settlementAmountError(value: string, scenario: SettlementDemoScenario): "required" | "positive" | "exceeds" | "unsupported" | null {
  if (!value.trim()) return "required";
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) <= 0) return "positive";
  if (Number(value) > scenario.debt.outstandingAmount) return "exceeds";
  if (Number(value) !== scenario.fullAmount && Number(value) !== scenario.partialAmount) return "unsupported";
  return null;
}

/** Synchronous latch prevents duplicate clicks before React can re-render. */
export function createSubmissionGate() {
  let busy = false;
  return {
    enter: () => { if (busy) return false; busy = true; return true; },
    leave: () => { busy = false; },
  };
}