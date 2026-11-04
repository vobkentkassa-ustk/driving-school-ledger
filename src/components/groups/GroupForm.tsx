import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uz } from "@/i18n/uz";
import { formatDate } from "@/lib/format";
import { groupFormErrors } from "@/lib/groups";
import type { Group } from "@/types/domain";

export function GroupForm({ open, onOpenChange, group, mentors }: { open: boolean; onOpenChange: (o: boolean) => void; group: Group | null; mentors: Array<{ id: string; fullName: string }> }) {
  const [name, setName] = useState(group?.name ?? "");
  const [mentorId, setMentorId] = useState(group?.mentorId ?? "");
  const [capacity, setCapacity] = useState(String(group?.capacity ?? 25));
  const [startDate, setStartDate] = useState(group?.startDate ?? "");
  const [unknown, setUnknown] = useState(group ? group.startDate === null : false);
  const [shown, setShown] = useState(false);
  const [tried, setTried] = useState(false);
  const errors = groupFormErrors({ name, capacity, mentorId });
  const invalid = errors.name || errors.capacity || errors.mentorId;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto">
    <DialogHeader><DialogTitle>{group ? uz.groups.formTitleEdit : uz.groups.formTitleCreate}</DialogTitle><DialogDescription>{uz.groups.formNote}</DialogDescription></DialogHeader>
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setTried(true); setShown(!invalid); }} noValidate>
      <div className="space-y-2"><Label htmlFor="g-name">{uz.groups.name}</Label><Input id="g-name" value={name} onChange={(e) => { setName(e.target.value); setShown(false); }} aria-invalid={tried && errors.name} />{tried && errors.name && <p className="text-sm text-danger">{uz.validation.required}</p>}</div>
      <div className="space-y-2"><Label htmlFor="g-mentor">{uz.fields.mentor}</Label><Select value={mentorId} onValueChange={(v) => { setMentorId(v); setShown(false); }}><SelectTrigger id="g-mentor" aria-invalid={tried && errors.mentorId}><SelectValue placeholder={uz.fields.mentor} /></SelectTrigger><SelectContent>{mentors.map((m) => <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>)}</SelectContent></Select>{tried && errors.mentorId && <p className="text-sm text-danger">{uz.validation.required}</p>}</div>
      <div className="space-y-2"><Label htmlFor="g-cap">{uz.groups.capacity}</Label><Input id="g-cap" inputMode="numeric" value={capacity} onChange={(e) => { setCapacity(e.target.value); setShown(false); }} aria-invalid={tried && errors.capacity} />{tried && errors.capacity && <p className="text-sm text-danger">{uz.groups.capacityInvalid}</p>}</div>
      <div className="space-y-2"><Label htmlFor="g-start">{uz.fields.startDate}</Label><Input id="g-start" type="date" value={startDate} disabled={unknown} onChange={(e) => { setStartDate(e.target.value); setShown(false); }} />
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={unknown} onCheckedChange={(c) => { setUnknown(c === true); setShown(false); }} />{uz.groups.startUnknownToggle}</label></div>
      <Button type="submit" className="w-full">{uz.groups.previewButton}</Button>
    </form>
    {shown && <div role="status" className="rounded-md border border-info/40 bg-info-soft p-4 text-sm">
      <p className="mb-2 font-semibold text-info">{uz.groups.previewTitle}</p>
      <dl className="grid grid-cols-2 gap-1"><dt className="text-muted-foreground">{uz.groups.name}</dt><dd>{name}</dd><dt className="text-muted-foreground">{uz.fields.mentor}</dt><dd>{mentors.find((m) => m.id === mentorId)?.fullName}</dd><dt className="text-muted-foreground">{uz.groups.capacity}</dt><dd>{capacity}</dd><dt className="text-muted-foreground">{uz.fields.startDate}</dt><dd>{unknown || !startDate ? uz.fields.startUnknown : formatDate(startDate)}</dd></dl>
    </div>}
  </DialogContent></Dialog>;
}
