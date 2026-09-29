"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  ConveyanceEmployee,
  ConveyanceEntry,
} from "@/types/conveyance";

type ConveyanceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployee: ConveyanceEmployee;
  editingEntry: ConveyanceEntry | null;
 onSave: (entry: ConveyanceEntry) => Promise<void>;
};

const ConveyanceFormDialog = ({
  open,
  onOpenChange,
  selectedEmployee,
  editingEntry,
  onSave,
}: ConveyanceFormDialogProps) => {
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bill, setBill] = useState("");
  const [remarks, setRemarks] = useState("");

  const isEditing = Boolean(editingEntry);

  const getToday = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

  useEffect(() => {
    if (!open) return;

    if (editingEntry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(editingEntry.date);
      setFrom(editingEntry.from);
      setTo(editingEntry.to);
      setBill(String(editingEntry.bill));
      setRemarks(editingEntry.remarks ?? "");
    } else {
      setDate(getToday());
      setFrom("");
      setTo("");
      setBill("");
      setRemarks("");
    }
  }, [open, editingEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!date || !from.trim() || !to.trim()) {
    return;
  }

  const billAmount = Number(bill);

  if (!Number.isFinite(billAmount) || billAmount < 0) {
    return;
  }

  const entry: ConveyanceEntry = {
    id: editingEntry?.id ?? crypto.randomUUID(),
    employeeId: selectedEmployee.id,
    date,
    from: from.trim(),
    to: to.trim(),
    bill: billAmount,
    remarks: remarks.trim(),
    createdById: editingEntry?.createdById,
  };

  await onSave(entry);
  onOpenChange(false);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Conveyance" : "Add Conveyance"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Correct the conveyance information."
              : "Add a conveyance record for this employee."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-lg border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">
              Employee
            </p>

            <p className="font-semibold">
              {selectedEmployee.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {selectedEmployee.designation}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conveyance-date">
              Date
            </Label>

            <Input
              id="conveyance-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="conveyance-from">
                From
              </Label>

              <Input
                id="conveyance-from"
                placeholder="e.g. Uttara Office"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conveyance-to">
                To
              </Label>

              <Input
                id="conveyance-to"
                placeholder="e.g. Motijheel"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conveyance-remarks">
              Remarks
            </Label>

            <Input
              id="conveyance-remarks"
              placeholder="e.g. Client visit, office work"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conveyance-bill">
              Bill
            </Label>

            <Input
              id="conveyance-bill"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isEditing
                ? "Save Changes"
                : "Add Conveyance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConveyanceFormDialog;
