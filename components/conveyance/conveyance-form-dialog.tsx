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
  onSave: (entry: ConveyanceEntry) => void;
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

  const isEditing = Boolean(editingEntry);

  useEffect(() => {
    if (!open) return;

    if (editingEntry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(editingEntry.date);
      setFrom(editingEntry.from);
      setTo(editingEntry.to);
      setBill(String(editingEntry.bill));
    } else {
      setDate("");
      setFrom("");
      setTo("");
      setBill("");
    }
  }, [open, editingEntry]);

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!date || !from.trim() || !to.trim()) {
      return;
    }

    const entry: ConveyanceEntry = {
      id:
        editingEntry?.id ??
        crypto.randomUUID(),
      employeeId: selectedEmployee.id,
      date,
      from: from.trim(),
      to: to.trim(),
      bill: Number(bill) || 0,
    };

    onSave(entry);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Conveyance"
              : "Add Conveyance"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Correct the conveyance information."
              : "Add a conveyance record for this employee."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Employee */}
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

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="conveyance-date">
              Date
            </Label>

            <Input
              id="conveyance-date"
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />
          </div>

          {/* From / To */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="conveyance-from">
                From
              </Label>

              <Input
                id="conveyance-from"
                placeholder="e.g. Uttara Office"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
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
                onChange={(e) =>
                  setTo(e.target.value)
                }
              />
            </div>
          </div>

          {/* Bill */}
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
              onChange={(e) =>
                setBill(e.target.value)
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
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
