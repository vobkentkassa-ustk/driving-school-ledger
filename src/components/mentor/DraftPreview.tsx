import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate } from "@/lib/format";
import { draftFormErrors } from "@/lib/mentor";
import type { PaymentMethod, Student } from "@/types/domain";

const methods: PaymentMethod[] = ["cash", "card", "transfer"];

export function DraftPreview({ open, onOpenChange, students }: { open: boolean; onOpenChange: (o: boolean) => void; students: Student[] }) {
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [tried, setTried] = useState(false);
  const [shown, setShown] = useState(false);
  const e = draftFormErrors({ studentId, amount, date });
  const invalid = e.studentId || e.amount || e.date;
  const touch = () => setShown(false);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto">
    <DialogHeader><DialogTitle>{uz.mentor.draftTitle}</DialogTitle><DialogDescription>{uz.mentor.draftNote}</DialogDescription></DialogHeader>
    <form noValidate className="space-y-4" onSubmit={(ev) => { ev.preventDefault(); setTried(true); setShown(!invalid); }}>
      <div className="space-y-2"><Label htmlFor="d-student">{uz.fields.student}</Label><Select value={studentId} onValueChange={(v) => { setStudentId(v); touch(); }}><SelectTrigger id="d-student" aria-invalid={tried && e.studentId}><SelectValue placeholder={uz.fields.student} /></SelectTrigger><SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>)}</SelectContent></Select>{tried && e.studentId && <p className="text-sm text-danger">{uz.validation.required}</p>}</div>
      <div className="space-y-2"><Label htmlFor="d-amount">{uz.fields.amount}</Label><Input id="d-amount" inputMode="numeric" value={amount} onChange={(ev) => { setAmount(ev.target.value); touch(); }} aria-invalid={tried && e.amount} />{tried && e.amount && <p className="text-sm text-danger">{uz.mentor.amountInvalid}</p>}</div>
      <div className="space-y-2"><Label htmlFor="d-date">{uz.fields.effectiveDate}</Label><Input id="d-date" type="date" value={date} onChange={(ev) => { setDate(ev.target.value); touch(); }} aria-invalid={tried && e.date} />{tried && e.date && <p className="text-sm text-danger">{uz.mentor.dateInvalid}</p>}</div>
      <div className="space-y-2"><Label htmlFor="d-method">{uz.fields.method}</Label><Select value={method} onValueChange={(v) => { setMethod(v as PaymentMethod); touch(); }}><SelectTrigger id="d-method"><SelectValue /></SelectTrigger><SelectContent>{methods.map((m) => <SelectItem key={m} value={m}>{uz.paymentMethod[m]}</SelectItem>)}</SelectContent></Select></div>
      <Button type="submit" className="w-full">{uz.mentor.previewButton}</Button>
    </form>
    {shown && <div role="status" className="space-y-2 rounded-md border border-info/40 bg-info-soft p-4 text-sm">
      <div className="flex items-center justify-between gap-2"><p className="font-semibold text-info">{uz.mentor.previewTitle}</p><StatusBadge kind="payment" status="draft" /></div>
      <dl className="grid grid-cols-2 gap-1"><dt className="text-muted-foreground">{uz.fields.student}</dt><dd>{students.find((s) => s.id === studentId)?.fullName}</dd><dt className="text-muted-foreground">{uz.fields.amount}</dt><dd><Money value={Number(amount)} /></dd><dt className="text-muted-foreground">{uz.fields.effectiveDate}</dt><dd>{formatDate(date)}</dd><dt className="text-muted-foreground">{uz.fields.method}</dt><dd>{uz.paymentMethod[method]}</dd></dl>
      <p className="text-xs text-muted-foreground">{uz.mentor.previewNote}</p>
    </div>}
  </DialogContent></Dialog>;
}
