import { useState, type FormEvent } from "react";
import { Eye, Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import { formatDate } from "@/lib/format";
import { isCalendarDate, validDemoCashAmount } from "@/lib/ledger";
import type { PaymentMethod } from "@/types/domain";

export function StudentPaymentPreview({ studentName, onClose }: { studentName: string; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [done, setDone] = useState(false);
  const errors = { amount: !validDemoCashAmount(amount), date: !isCalendarDate(date) };
  const review = (e: FormEvent) => { e.preventDefault(); setSubmitted(true); if (!errors.amount && !errors.date) setPreview(true); };
  return <section className="space-y-4 border-y py-5">
    <h3 className="font-bold">{preview ? uz.students.paymentPreview : uz.students.payment}</h3>
    <p className="text-sm text-info">{uz.students.paymentNote}</p>
    {done ? <><p role="status" className="text-sm">{uz.students.paymentDone}</p><Button variant="outline" onClick={onClose}>{uz.ledger.close}</Button></> : preview ? <>
      <p className="text-sm font-semibold">{studentName}</p><Money value={Number(amount)} tone="positive" className="block text-lg" />
      <dl className="space-y-3 text-sm"><div><dt className="text-muted-foreground">{uz.fields.effectiveDate}</dt><dd>{formatDate(date)}</dd></div><div><dt className="text-muted-foreground">{uz.fields.method}</dt><dd>{uz.paymentMethod[method]}</dd></div></dl>
      <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setPreview(false)}><Pencil aria-hidden />{uz.ledger.edit}</Button><Button onClick={() => setDone(true)}><Check aria-hidden />{uz.ledger.finish}</Button></div>
    </> : <form noValidate onSubmit={review} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="student-payment-amount">{uz.fields.amount}</Label><Input id="student-payment-amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={submitted && errors.amount} />{submitted && errors.amount && <p role="alert" className="text-xs text-danger">{uz.ledger.integerAmount}</p>}</div>
      <div className="space-y-2"><Label htmlFor="student-payment-date">{uz.fields.effectiveDate}</Label><Input id="student-payment-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={submitted && errors.date} />{submitted && errors.date && <p role="alert" className="text-xs text-danger">{uz.ledger.validDate}</p>}</div>
      <div className="space-y-2"><Label htmlFor="student-payment-method">{uz.fields.method}</Label><Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}><SelectTrigger id="student-payment-method"><SelectValue /></SelectTrigger><SelectContent>{(["cash", "card", "transfer"] as const).map((v) => <SelectItem key={v} value={v}>{uz.paymentMethod[v]}</SelectItem>)}</SelectContent></Select></div>
      <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={onClose}>{uz.actions.cancel}</Button><Button type="submit"><Eye aria-hidden />{uz.ledger.preview}</Button></div>
    </form>}
  </section>;
}