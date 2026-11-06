import { useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime } from "@/lib/format";
import { createSubmissionGate } from "@/lib/settlement-demo";
import { previewRequestReview, previewUserStatus } from "@/mocks/services";
import type { AdminRequestRow, RequestReviewDecision, RequestReviewPreview, User, UserStatusPreview } from "@/types/domain";

export function RequestReviewDialog({ row, onClose }: { row: AdminRequestRow; onClose: () => void }) {
  const [decision, setDecision] = useState<RequestReviewDecision>("approved");
  const [comment, setComment] = useState("");
  const [result, setResult] = useState<RequestReviewPreview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const gate = useRef(createSubmissionGate());
  const pending = row.request.status === "pending";
  const preview = async () => {
    if (!pending || !gate.current.enter()) return;
    if (decision === "rejected" && !comment.trim()) { setError(uz.requests.rejectionRequired); gate.current.leave(); return; }
    setBusy(true); setError("");
    try { const next = await previewRequestReview(row.request.id, decision, comment); setResult(next); if (!next) setError(uz.requests.notPending); }
    catch { setError(uz.fallback.errorDescription); }
    finally { setBusy(false); gate.current.leave(); }
  };
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-h-[90dvh] overflow-y-auto">
    <DialogHeader><DialogTitle>{uz.requests.reviewTitle}</DialogTitle><DialogDescription>{uz.requests.note}</DialogDescription></DialogHeader>
    <div className="space-y-3 border-y py-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold">{row.studentName}</p><StatusBadge kind="payment" status={row.request.status} /></div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm"><dt className="text-muted-foreground">{uz.requests.recordId}</dt><dd>{row.request.id}</dd><dt className="text-muted-foreground">{uz.fields.mentor}</dt><dd>{row.mentorName}</dd><dt className="text-muted-foreground">{uz.fields.group}</dt><dd>{row.groupName}</dd><dt className="text-muted-foreground">{uz.fields.amount}</dt><dd><Money value={row.request.grossAmount} /></dd><dt className="text-muted-foreground">{uz.fields.method}</dt><dd>{uz.paymentMethod[row.request.method]}</dd><dt className="text-muted-foreground">{uz.fields.effectiveDate}</dt><dd>{formatDate(row.request.effectiveDate)}</dd><dt className="text-muted-foreground">{uz.fields.createdAt}</dt><dd>{formatDateTime(row.request.createdAt)}</dd></dl>
      {row.request.reviewComment && <p className="text-sm text-danger">{uz.requests.comment}: {row.request.reviewComment}</p>}
    </div>
    {pending && !result && <form noValidate className="space-y-4" onSubmit={(e) => { e.preventDefault(); void preview(); }}>
      <div className="space-y-2"><Label>{uz.requests.decision}</Label><Tabs value={decision} onValueChange={(v) => { setDecision(v as RequestReviewDecision); setError(""); }}><TabsList className="w-full"><TabsTrigger disabled={busy} className="flex-1" value="approved">{uz.actions.confirm}</TabsTrigger><TabsTrigger disabled={busy} className="flex-1" value="rejected">{uz.actions.reject}</TabsTrigger></TabsList></Tabs></div>
      <div className="space-y-2"><Label htmlFor="review-comment">{uz.requests.comment}</Label><Textarea id="review-comment" value={comment} disabled={busy} aria-invalid={Boolean(error)} maxLength={1000} onChange={(e) => { setComment(e.target.value); setError(""); }} /></div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" /> : <Check aria-hidden />}{busy ? uz.dashboard.loading : uz.requests.preview}</Button>
    </form>}
    {result && <section role="status" className="space-y-2 border-y py-4"><h3 className="font-semibold text-info">{uz.requests.result}</h3><StatusBadge kind="payment" status={result.decision} />{result.comment && <p className="break-words text-sm">{result.comment}</p>}<p className="text-sm text-muted-foreground">{uz.requests.note}</p></section>}
    <p className="text-xs text-muted-foreground">{uz.requests.accountingDeferred}</p>
    <Button variant="outline" onClick={onClose}>{uz.ledger.close}</Button>
  </DialogContent></Dialog>;
}

export function UserStatusDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const proposedStatus = user.status === "active" ? "blocked" : "active";
  const [result, setResult] = useState<UserStatusPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const gate = useRef(createSubmissionGate());
  const preview = async () => {
    if (result || !gate.current.enter()) return;
    setBusy(true); setError("");
    try { const next = await previewUserStatus(user.id, proposedStatus); setResult(next); if (!next) setError(uz.fallback.errorDescription); }
    catch { setError(uz.fallback.errorDescription); }
    finally { setBusy(false); gate.current.leave(); }
  };
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent><DialogHeader><DialogTitle>{uz.users.titlePreview}</DialogTitle><DialogDescription>{uz.users.note}</DialogDescription></DialogHeader>
    <p className="font-bold">{user.fullName}</p><p className="text-sm text-muted-foreground">{uz.roles[user.role]}</p>
    <dl className="grid grid-cols-2 gap-3 border-y py-4 text-sm"><dt>{uz.users.current}</dt><dd><StatusBadge kind="user" status={user.status} /></dd><dt>{uz.users.proposed}</dt><dd><StatusBadge kind="user" status={proposedStatus} /></dd></dl>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    {result && <div role="status" className="space-y-2"><p className="font-semibold text-info">{uz.users.result}</p><StatusBadge kind="user" status={result.proposedStatus} /><p className="text-sm text-muted-foreground">{uz.users.note}</p></div>}
    <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={onClose}>{uz.ledger.close}</Button>{!result && <Button disabled={busy} onClick={() => void preview()}>{busy ? <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" /> : <Check aria-hidden />}{busy ? uz.dashboard.loading : uz.users.preview}</Button>}</div>
  </DialogContent></Dialog>;
}