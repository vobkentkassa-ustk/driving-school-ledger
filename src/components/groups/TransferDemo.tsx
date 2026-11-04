import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import type { TransferDemo as Demo } from "@/types/domain";

export function TransferDemo({ demos }: { demos: Demo[] }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(demos[0]?.studentId ?? "");
  const [done, setDone] = useState(false);
  const d = demos.find((x) => x.studentId === id);
  if (!demos.length) return null;
  return <>
    <Button variant="outline" onClick={() => { setOpen(true); setDone(false); }}>{uz.groups.transfer}</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{uz.groups.transfer}</DialogTitle><DialogDescription>{uz.groups.transferNote}</DialogDescription></DialogHeader>
      <div className="space-y-2"><Label htmlFor="t-student">{uz.fields.student}</Label><Select value={id} onValueChange={(v) => { setId(v); setDone(false); }}><SelectTrigger id="t-student"><SelectValue /></SelectTrigger><SelectContent>{demos.map((x) => <SelectItem key={x.studentId} value={x.studentId}>{x.studentName}</SelectItem>)}</SelectContent></Select></div>
      {d && <div className="space-y-3 rounded-md border p-4 text-sm">
        <div className="flex flex-wrap items-center gap-2"><span><span className="text-muted-foreground">{uz.groups.from}: </span>{d.fromGroup.name}</span><ArrowRight className="size-4 text-info" aria-hidden /><span><span className="text-muted-foreground">{uz.groups.to}: </span>{d.toGroup.name}</span></div>
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
          <dt className="text-muted-foreground">{uz.groups.oldContract}</dt><dd><Money value={d.oldContract} tone="muted" /></dd>
          <dt className="text-muted-foreground">{uz.groups.newContract}</dt><dd><Money value={d.newContract} /></dd>
          <dt className="text-muted-foreground">{uz.groups.paidCarried}</dt><dd className="text-info"><Money value={d.paidCarried} className="text-info" /></dd>
          <dt className="font-semibold">{uz.groups.newRemaining}</dt><dd><Money value={d.newRemaining} tone="debt" className="font-semibold" /></dd>
        </dl>
      </div>}
      <Button onClick={() => setDone(true)} disabled={done}>{uz.actions.confirm}</Button>
      {done && <p role="status" className="text-sm text-info">{uz.groups.transferDone}</p>}
    </DialogContent></Dialog>
  </>;
}
