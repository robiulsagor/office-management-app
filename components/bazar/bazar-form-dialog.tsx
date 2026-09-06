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

import { BazarEntry, BazarItem } from "@/types/bazar";

import BazarItemSelector from "./bazar-item-selector";
import { getBazarItems } from "@/actions/bazar/get-bazar-items";

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
  quantity: undefined,
  unit: undefined,
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
  const [items, setItems] = useState<BazarItem[]>([createEmptyItem()]);
  const [error, setError] = useState("");

  const [bazarMasterItems, setBazarMasterItems] = useState<
    {
      id: string;
      nameEn: string;
      nameBn: string;
    }[]
  >([]);

  useEffect(() => {
    if (!open) return;

    const loadBazarItems = async () => {
      const result = await getBazarItems();

      if (result.success) {
        setBazarMasterItems(result.data);
      }
    };

    loadBazarItems();
  }, [open]);

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
      setError("");
      setItems(
        editingEntry.items.map((item) => ({
          ...item,
        })),
      );
    } else {
      setError("");
      setDate("");
      setDeposit("");
      setItems([createEmptyItem()]);
    }
  }, [editingEntry, open]);

  // -----------------------------------------------
  // Items
  // -----------------------------------------------

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      if (prev.length === 1) return prev;

      return prev.filter((item) => item.id !== id);
    });
  };

  const updateItem = (
    id: string,
    field: "name" | "quantity" | "unit" | "price",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "price" || field === "quantity"
                  ? value === ""
                    ? undefined
                    : Number(value)
                  : value,
            }
          : item,
      ),
    );
  };

  // -----------------------------------------------
  // Submit
  // -----------------------------------------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!date) {
      setError("Please select a date.");
      return;
    }

    const validItems = items.filter((item) => item.name.trim());

    if (validItems.length === 0) {
      setError("Please add at least one purchased item.");
      return;
    }

    for (const item of validItems) {
      const hasQuantity = item.quantity != null;
      const hasUnit = Boolean(item.unit);

      if (hasQuantity !== hasUnit) {
        setError(`Please provide both quantity and unit for "${item.name}".`);
        return;
      }

      if (item.quantity != null && item.quantity <= 0) {
        setError(`Quantity for "${item.name}" must be greater than 0.`);
        return;
      }

      if (item.price < 0) {
        setError(`Price for "${item.name}" cannot be negative.`);
        return;
      }
    }

    const entry: BazarEntry = {
      id: editingEntry?.id ?? crypto.randomUUID(),
      date,
      deposit: Number(deposit) || 0,
      items: validItems,
    };

    onSave(entry);
    onOpenChange(false);
  };

  const totalExpense = items.reduce((sum, item) => sum + item.price, 0);

  const monthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Bazar Entry" : "Add Bazar Entry"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Correct the bazar information for this day."
              : `Add the shopping and deposit information for ${monthName}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Date + Deposit */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bazar-date">Date</Label>

              <Input
                id="bazar-date"
                type="date"
                value={date}
                className="text-sm md:text-base"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2 text-xs sm:text-sm md:text-base">
              <Label htmlFor="bazar-deposit" className="text-sm md:text-base">
                Deposit
              </Label>

              <Input
                id="bazar-deposit"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={deposit}
                className="text-sm md:text-base"
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>
          </div>

          {/* Items */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Purchased Items</h3>

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
                  className="grid grid-cols-2 gap-3 sm:flex sm:items-end"
                >
                  {/* Item */}
                  <div className=" min-w-0 space-y-2 sm:flex-1">
                    <Label className="text-sm md:text-base">
                      Item {index + 1}
                    </Label>

                    <BazarItemSelector
                      items={bazarMasterItems}
                      value={item.name}
                      onChange={(value) => updateItem(item.id, "name", value)}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2 sm:w-20">
                    <Label className="text-sm md:text-base">Quantity</Label>

                    <Input
                      type="number"
                      className="text-sm md:text-base"
                      min="0"
                      step="0.01"
                      placeholder="—"
                      value={item.quantity ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", e.target.value)
                      }
                    />
                  </div>

                  {/* Unit */}
                  <div className="space-y-2 sm:w-28">
                    <Label className="text-sm md:text-base">Unit</Label>

                    <select
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                      value={item.unit ?? ""}
                      onChange={(e) =>
                        updateItem(item.id, "unit", e.target.value)
                      }
                    >
                      <option value="">—</option>
                      <option value="KG">KG</option>
                      <option value="GRAM">Gram</option>
                      <option value="LITER">Liter</option>
                      <option value="ML">ML</option>
                      <option value="PCS">Pcs</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-2 sm:w-32">
                    <Label className="text-sm md:text-base">Price</Label>

                    <Input
                      className="text-sm md:text-base"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={item.price || ""}
                      onChange={(e) =>
                        updateItem(item.id, "price", e.target.value)
                      }
                    />
                  </div>

                  {/* Delete */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={items.length === 1}
                    onClick={() => removeItem(item.id)}
                    className="col-span-2 justify-self-end sm:mb-0"
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              {isEditing ? "Save Changes" : "Add Bazar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BazarFormDialog;
