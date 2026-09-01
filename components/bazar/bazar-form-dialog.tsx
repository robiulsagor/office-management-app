"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
  BazarEntry,
  BazarItem,
} from "@/types/bazar";

type BazarFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMonth: Date;
  editingEntry: BazarEntry | null;
  onSave: (entry: BazarEntry) => void;
};

const createEmptyItem = (): BazarItem => ({
  id: crypto.randomUUID(),
  name: "",
  price: 0,
});

const BazarFormDialog = ({
  open,
  onOpenChange,
  selectedMonth,
  editingEntry,
  onSave,
}: BazarFormDialogProps) => {

  const [date, setDate] = useState("");
  const [deposit, setDeposit] = useState("");
  const [items, setItems] = useState<BazarItem[]>([
    createEmptyItem(),
  ]);

  const isEditing = Boolean(editingEntry);


  // -----------------------------------------------
  // Populate form when editing
  // -----------------------------------------------

  useEffect(() => {
    if (!open) return;

    if (editingEntry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(editingEntry.date);
      setDeposit(String(editingEntry.deposit));

      setItems(
        editingEntry.items.map((item) => ({
          ...item,
        })),
      );
    } else {
      setDate("");
      setDeposit("");
      setItems([createEmptyItem()]);
    }
  }, [editingEntry, open]);


  // -----------------------------------------------
  // Items
  // -----------------------------------------------

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      createEmptyItem(),
    ]);
  };


  const removeItem = (id: string) => {
    setItems((prev) => {
      if (prev.length === 1) return prev;

      return prev.filter(
        (item) => item.id !== id,
      );
    });
  };


  const updateItem = (
    id: string,
    field: "name" | "price",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "price"
                  ? Number(value) || 0
                  : value,
            }
          : item,
      ),
    );
  };


  // -----------------------------------------------
  // Submit
  // -----------------------------------------------

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!date) return;

    const validItems = items.filter(
      (item) => item.name.trim(),
    );

    const entry: BazarEntry = {
      id:
        editingEntry?.id ??
        crypto.randomUUID(),

      date,

      deposit:
        Number(deposit) || 0,

      items: validItems,
    };

    onSave(entry);

    onOpenChange(false);
  };


  const totalExpense = items.reduce(
    (sum, item) => sum + item.price,
    0,
  );


  const monthName =
    selectedMonth.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      },
    );


  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">

        <DialogHeader>

          <DialogTitle>
            {isEditing
              ? "Edit Bazar Entry"
              : "Add Bazar Entry"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Correct the bazar information for this day."
              : `Add the shopping and deposit information for ${monthName}.`}
          </DialogDescription>

        </DialogHeader>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Date + Deposit */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <Label htmlFor="bazar-date">
                Date
              </Label>

              <Input
                id="bazar-date"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="bazar-deposit">
                Deposit
              </Label>

              <Input
                id="bazar-deposit"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={deposit}
                onChange={(e) =>
                  setDeposit(e.target.value)
                }
              />
            </div>

          </div>


          {/* Items */}

          <div className="space-y-4">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-sm font-semibold">
                  Purchased Items
                </h3>

                <p className="text-xs text-muted-foreground">
                  Add every item purchased that day.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="mr-2 size-4" />
                Add Item
              </Button>

            </div>


            <div className="space-y-3">

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-end gap-3"
                >

                  <div className="flex-1 space-y-2">

                    <Label>
                      Item {index + 1}
                    </Label>

                    <Input
                      placeholder="e.g. Rice"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "name",
                          e.target.value,
                        )
                      }
                    />

                  </div>


                  <div className="w-32 space-y-2">

                    <Label>
                      Price
                    </Label>

                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={
                        item.price || ""
                      }
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "price",
                          e.target.value,
                        )
                      }
                    />

                  </div>


                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={
                      items.length === 1
                    }
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>

                </div>
              ))}

            </div>

          </div>


          {/* Expense */}

          <div className="rounded-xl border bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm text-muted-foreground">
                Total Expense
              </span>

              <span className="text-lg font-bold">
                ৳{totalExpense.toLocaleString("en-BD")}
              </span>

            </div>

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
                : "Add Bazar"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>
  );
};

export default BazarFormDialog;