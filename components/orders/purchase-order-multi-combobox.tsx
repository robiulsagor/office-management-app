"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { getOrderPurchaseOrders } from "@/actions/order/get-purchase-orders";
import { createPurchaseOrder } from "@/actions/order/create-purchase-order";

type PurchaseOrder = {
  id: string;
  poNumber: string;
};

type PurchaseOrderMultiComboboxProps = {
  programmeId: string;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function PurchaseOrderMultiCombobox({
  programmeId,
  value,
  onChange,
}: PurchaseOrderMultiComboboxProps) {
  const [open, setOpen] = useState(false);

  const [purchaseOrders, setPurchaseOrders] = useState<
    PurchaseOrder[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [commandValue, setCommandValue] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPoNumber, setNewPoNumber] = useState("");
  const [creating, setCreating] = useState(false);

  const selectedPurchaseOrders = purchaseOrders.filter((po) =>
    value.includes(po.id)
  );

  useEffect(() => {
    if (!programmeId) {
      return;
    }

    async function loadPurchaseOrders() {
      setLoading(true);

      const result = await getOrderPurchaseOrders(programmeId);

      if (result.success) {
        setPurchaseOrders(result.purchaseOrders);
      }

      setLoading(false);
    }

    loadPurchaseOrders();
  }, [programmeId]);

  function handleSelect(po: PurchaseOrder) {
    const alreadySelected = value.includes(po.id);

    if (alreadySelected) {
      onChange(value.filter((id) => id !== po.id));
    } else {
      onChange([...value, po.id]);
    }

    setCommandValue("");
  }

  async function handleCreatePurchaseOrder() {
    const cleanPoNumber = newPoNumber.trim();

    if (!programmeId) {
      toast.error("Please select a programme first.");
      return;
    }

    if (!cleanPoNumber) {
      toast.error("PO number is required.");
      return;
    }

    setCreating(true);

    const result = await createPurchaseOrder(
      programmeId,
      cleanPoNumber
    );

    if (result.success && result.purchaseOrder) {
      const newPurchaseOrder = result.purchaseOrder;

      setPurchaseOrders((current) => [
        ...current,
        newPurchaseOrder,
      ]);

      onChange([...value, newPurchaseOrder.id]);

      setNewPoNumber("");
      setAddDialogOpen(false);

      toast.success("Purchase order created.");
    } else {
      toast.error(
        result.message ?? "Failed to create purchase order."
      );
    }

    setCreating(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setCommandValue("");
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={!programmeId}
          className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="truncate">
            {selectedPurchaseOrders.length === 0
              ? "Select PO..."
              : selectedPurchaseOrders
                  .map((po) => po.poNumber)
                  .join(", ")}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={4}
          className="w-(--radix-popover-trigger-width) p-0"
        >
          <Command
            value={commandValue}
            onValueChange={setCommandValue}
          >
            <CommandInput
              placeholder="Search PO..."
              autoFocus
            />

            <CommandList>
              <CommandEmpty>
                {loading ? "Loading..." : "No PO found."}
              </CommandEmpty>

              <CommandGroup>
                {purchaseOrders.map((po) => {
                  const selected = value.includes(po.id);

                  return (
                    <CommandItem
                      key={po.id}
                      value={po.poNumber}
                      onSelect={() => handleSelect(po)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selected
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      {po.poNumber}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              <CommandGroup>
                <CommandItem
                  value="__add_new_po__"
                  onSelect={() => {
                    setOpen(false);
                    setAddDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New PO
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Add New PO Dialog */}
      {addDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                Add New Purchase Order
              </h2>

              <p className="text-sm text-muted-foreground">
                Create a new PO for this programme.
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="new-po-number"
                className="mb-2 block text-sm font-medium"
              >
                PO Number
              </label>

              <Input
                id="new-po-number"
                value={newPoNumber}
                onChange={(event) =>
                  setNewPoNumber(event.target.value)
                }
                placeholder="Enter PO number"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleCreatePurchaseOrder();
                  }

                  if (event.key === "Escape") {
                    setAddDialogOpen(false);
                  }
                }}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewPoNumber("");
                  setAddDialogOpen(false);
                }}
                disabled={creating}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleCreatePurchaseOrder}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create PO"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}