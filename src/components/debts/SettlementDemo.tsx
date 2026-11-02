import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, HandCoins, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate } from "@/lib/format";
import { createSubmissionGate, settlementAmountError } from "@/lib/settlement-demo";
import { confirmSettlementDemo, listSettlementDemoScenarios, previewSettlementDemo } from "@/mocks/services";
import type { SettlementDemoResult, SettlementMethod } from "@/types/domain";

export function SettlementDemo({ onClose }: { onClose: () => void }) {
  const { data: scenarios, isError, refetch } = useQuery({ queryKey: ["settlement-demo-scenarios"], queryFn: listSettlementDemoScenarios });
  const [method, setMethod] = useState<SettlementMethod>("personal_repayment");
  const [mode, setMode] = useState("full");
  const [amount, setAmount] = useState("500000");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<SettlementDemoResult | null>(null);
  const [result, setResult] = useState<SettlementDemoResult | null>(null);
  const [outcome, setOutcome] = useState<"success" | "failure" | "stale">("success");
  const [busy, setBusy] = useState(false);
  const [stale, setStale] = useState(false);
  const gate = useRef(createSubmissionGate());
  const scenario = scenarios?.find((s) => s.method === method);
  const clear = () => { setPreview(null); setResult(null); setError(null); setStale(false); };
  const changeMethod = (value: SettlementMethod) => {
    const next = scenarios?.find((s) => s.method === value);
    if (!next) return;
    setMethod(value); setMode("full"); setAmount(String(next.fullAmount)); clear();
  };
  const showPreview = async () => {
    if (!scenario || !gate.current.enter()) return;
    const issue = settlementAmountError(amount, scenario);
    if (issue) {
      setError({ required: uz.validation.required, positive: uz.ledger.integerAmount, exceeds: uz.validation.amountExceedsOutstanding, unsupported: uz.settlementDemo.unsupported }[issue]);
      gate.current.leave(); return;
    }
    setBusy(true); setError(null);
    try { setPreview(await previewSettlementDemo(method, amount)); }
    catch { setError(uz.settlementDemo.failed); }
    finally { setBusy(false); gate.current.leave(); }
  };
  const confirm = async () => {
    if (!preview || stale || result || !gate.current.enter()) return;
    setBusy(true); setError(null);
    try {
      const response = await confirmSettlementDemo(preview, outcome);
      if (response.outcome === "success") { setResult(response.result); setPreview(null); }
      else if (response.outcome === "stale") { setStale(true); setError(uz.settlementDemo.staleNote); }
      else setError(uz.settlementDemo.failed);
    } catch { setError(uz.settlementDemo.failed); }
    finally { setBusy(false); gate.current.leave(); }
  };
  return <Dialog open onOpenChange={(open) => { if (!open && !busy) onClose(); }}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg" onEscapeKeyDown={(e) => { if (busy) e.preventDefault(); }} onPointerDownOutside={(e) => { if (busy) e.preventDefault(); }}>
    <DialogTitle className="pr-6">{uz.settlementDemo.title}</DialogTitle>
    <DialogDescription>{uz.settlementDemo.note}</DialogDescription>
    {!scenario ? <p role="status">{isError ? uz.fallback.errorDescription : uz.dashboard.loading}{isError && <Button onClick={() => void refetch()}>{uz.fallback.retry}</Button>}</p> : <>
      {!result && <fieldset disabled={busy} className="min-w-0 space-y-4">
        <div className="space-y-2"><Label htmlFor="settlement-method">{uz.fields.method}</Label><Select value={method} onValueChange={(value) => changeMethod(value as SettlementMethod)} disabled={busy}><SelectTrigger id="settlement-method" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{scenarios?.map((s) => <SelectItem key={s.method} value={s.method}>{uz.settlementMethod[s.method]}</SelectItem>)}</SelectContent></Select></div>
        <div className="border-y py-3"><p className="text-xs text-muted-foreground">{uz.settlementDemo.sample}</p><p className="mt-1 font-semibold">{scenario.debt.debtorName}</p><p className="mt-1 text-sm text-muted-foreground">{scenario.debt.reason}</p><p className="mt-3 text-xs text-danger">{uz.fields.outstanding}</p><Money value={scenario.debt.outstandingAmount} tone="debt" className="font-bold" /></div>
        <p className={method === "personal_repayment" ? "text-sm text-success" : "text-sm text-info"}>{method === "salary_deduction" ? uz.preview.salaryNote : method === "organization_budget" ? uz.settlementDemo.budgetNote : uz.settlementDemo.personalNote}</p>
        <div><Label>{uz.settlementDemo.mode}</Label><Tabs value={mode} onValueChange={(value) => { setMode(value); setAmount(String(value === "full" ? scenario.fullAmount : scenario.partialAmount)); clear(); }} className="mt-2"><TabsList className="w-full"><TabsTrigger value="full" disabled={busy} className="flex-1">{uz.settlementDemo.full}</TabsTrigger><TabsTrigger value="partial" disabled={busy} className="flex-1">{uz.settlementDemo.partial}</TabsTrigger></TabsList></Tabs></div>
        <div className="space-y-2"><Label htmlFor="settlement-amount">{uz.fields.amount}</Label><Input id="settlement-amount" inputMode="numeric" value={amount} aria-invalid={Boolean(error)} onChange={(e) => { setAmount(e.target.value); clear(); }} /><p className="text-xs text-muted-foreground">{uz.settlementDemo.full}: <Money value={scenario.fullAmount} /> · {uz.settlementDemo.partial}: <Money value={scenario.partialAmount} /></p></div>
        <p className="text-xs text-muted-foreground">{uz.settlementDemo.date}: {formatDate(scenario.effectiveDate)}</p>
      </fieldset>}
      {(preview || result) && <SettlementResult value={result ?? preview} final={Boolean(result)} />}
      {error && <p role="alert" className={stale ? "text-sm text-warning" : "text-sm text-danger"}>{error}</p>}
      {preview && !result && <div className="space-y-2"><Label htmlFor="settlement-outcome">{uz.settlementDemo.outcome}</Label><Select value={outcome} disabled={busy} onValueChange={(v) => setOutcome(v as typeof outcome)}><SelectTrigger id="settlement-outcome"><SelectValue /></SelectTrigger><SelectContent>{(["success", "failure", "stale"] as const).map((v) => <SelectItem key={v} value={v}>{uz.settlementDemo[v]}</SelectItem>)}</SelectContent></Select></div>}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" disabled={busy} onClick={onClose}>{uz.ledger.close}</Button>
        {result ? <Button onClick={clear}><HandCoins aria-hidden />{uz.settlementDemo.retry}</Button> : stale ? <Button onClick={() => { clear(); setOutcome("success"); }}>{uz.settlementDemo.reload}</Button> : <Button disabled={busy} onClick={() => void (preview ? confirm() : showPreview())}>{busy ? <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden /> : <Check aria-hidden />}{busy ? uz.settlementDemo.pending : preview ? uz.settlementDemo.confirm : uz.settlementDemo.preview}</Button>}
      </div>
    </>}
  </DialogContent></Dialog>;
}

function SettlementResult({ value, final }: { value: SettlementDemoResult | null; final: boolean }) {
  if (!value) return null;
  return <section className="space-y-3 border-y py-4">
    <h3 className="font-semibold">{final ? uz.settlementDemo.result : uz.ledger.previewTitle}</h3>
    <StatusBadge kind="debt" status={value.debt.status} />
    <div><p className="text-xs text-danger">{uz.settlementDemo.remaining}</p><Money value={value.debt.outstandingAmount} tone={value.debt.outstandingAmount ? "debt" : "muted"} /></div>
    <p className={value.cashTransaction ? "text-xs text-success" : "text-xs text-info"}>{value.cashTransaction ? uz.dashboard.cashIn : uz.dashboard.internalMovement}: <Money value={value.settlement.amount} className={value.cashTransaction ? "text-success" : "text-info"} /></p>
    {value.studentCredit && <div><p className="text-xs text-info">{uz.debts.studentCredit} · {value.debt.relatedStudentName}</p><Money value={value.studentCredit.amount} className="text-sm text-info" /><p className="text-xs text-muted-foreground">{value.studentCredit.description}</p></div>}
    {value.preservedDebt && <div><p className="text-xs text-danger">{uz.debts.preservedDebt}</p><Money value={value.preservedDebt.outstandingAmount} tone="debt" /><div className="mt-1"><StatusBadge kind="debt" status={value.preservedDebt.status} /></div></div>}
    {final && <p role="status" className="text-xs text-muted-foreground">{uz.settlementDemo.note}</p>}
  </section>;
}