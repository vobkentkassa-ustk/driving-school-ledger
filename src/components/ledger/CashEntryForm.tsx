import { useState, type FormEvent } from "react";
import { Check, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import { formatDate } from "@/lib/format";
import { isCalendarDate, validDemoCashAmount } from "@/lib/ledger";

export function CashEntryForm({ open, onClose, onFinish }: { open: boolean; onClose: () => void; onFinish: () => void }) {
  const [type, setType] = useState("cash_in");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(false);
  const errors = {
    amount: validDemoCashAmount(amount) ? "" : uz.ledger.integerAmount,
    date: isCalendarDate(date) ? "" : uz.ledger.validDate,
    description: description.trim() ? "" : uz.validation.required,
  };
  function review(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setPreview(true);
  }
  return <Sheet open={open} onOpenChange={(value) => { if (!value) onClose(); }}><SheetContent className="w-full overflow-y-auto sm:max-w-md">
    <SheetTitle className="pr-6">{preview ? uz.ledger.previewTitle : uz.ledger.demoEntry}</SheetTitle>
    <SheetDescription className="mt-3 text-info">{uz.ledger.demoNote}</SheetDescription>
    {preview ? <div className="mt-6 space-y-6">
      <div className="border-y py-6"><p className={type === "cash_out" ? "text-danger" : "text-success"}>{type === "cash_out" ? uz.ledgerType.cash_out : uz.ledgerType.cash_in}</p><Money value={Number(amount)} tone={type === "cash_out" ? "debt" : "positive"} className="mt-2 block text-xl font-semibold" /></div>
      <dl className="space-y-4 text-sm"><div><dt className="text-muted-foreground">{uz.fields.effectiveDate}</dt><dd className="mt-1">{formatDate(date)}</dd></div><div><dt className="text-muted-foreground">{uz.ledger.descriptionField}</dt><dd className="mt-1 break-words">{description}</dd></div></dl>
      <div className="flex gap-2"><Button variant="outline" onClick={() => setPreview(false)}><Pencil aria-hidden />{uz.ledger.edit}</Button><Button onClick={onFinish}><Check aria-hidden />{uz.ledger.finish}</Button></div>
    </div> : <form noValidate onSubmit={review} className="mt-6 space-y-5">
      <div className="space-y-2"><Label htmlFor="entry-type">{uz.ledger.type}</Label><Select value={type} onValueChange={setType}><SelectTrigger id="entry-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash_in">{uz.ledgerType.cash_in}</SelectItem><SelectItem value="cash_out">{uz.ledgerType.cash_out}</SelectItem></SelectContent></Select></div>
      <div className="space-y-2"><Label htmlFor="entry-amount">{uz.fields.amount} ({uz.currency.suffix})</Label><Input id="entry-amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={submitted && Boolean(errors.amount)} aria-describedby={submitted && errors.amount ? "amount-error" : undefined} />{submitted && errors.amount && <p id="amount-error" className="text-xs text-danger">{errors.amount}</p>}</div>
      <div className="space-y-2"><Label htmlFor="entry-date">{uz.fields.effectiveDate}</Label><Input id="entry-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={submitted && Boolean(errors.date)} aria-describedby={submitted && errors.date ? "date-error" : undefined} />{submitted && errors.date && <p id="date-error" className="text-xs text-danger">{errors.date}</p>}</div>
      <div className="space-y-2"><Label htmlFor="entry-description">{uz.ledger.descriptionField}</Label><Textarea id="entry-description" maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={submitted && Boolean(errors.description)} aria-describedby={submitted && errors.description ? "description-error" : undefined} />{submitted && errors.description && <p id="description-error" className="text-xs text-danger">{errors.description}</p>}</div>
      <div className="flex gap-2"><Button type="button" variant="outline" onClick={onClose}>{uz.actions.cancel}</Button><Button type="submit"><Eye aria-hidden />{uz.ledger.preview}</Button></div>
    </form>}
  </SheetContent></Sheet>;
}