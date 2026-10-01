"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrderPurchaseOrders } from "@/actions/order/get-purchase-orders";
import { createPurchaseOrder } from "@/actions/order/create-purchase-order";

type PurchaseOrder = {
  id: string;
  poNumber: string;
};

type PurchaseOrderComboboxProps = {
  programmeId: string;
  value: string;
  onChange: (value: string) => void;
};

export default function PurchaseOrderCombobox({
  programmeId,
  value,
  onChange,
}: PurchaseOrderComboboxProps) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [open, setOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [newPoNumber, setNewPoNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // Controls keyboard-highlighted item
  const [commandValue, setCommandValue] = useState("");

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

  const selectedPurchaseOrder = purchaseOrders.find(
    (purchaseOrder) => purchaseOrder.id === value,
  );

  function handleSelect(purchaseOrder: PurchaseOrder) {
    setCommandValue(purchaseOrder.poNumber);

    onChange(purchaseOrder.id);

    setOpen(false);
  }

  function handleClearSelection() {
    setCommandValue("");
    onChange("");
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      if (selectedPurchaseOrder) {
        setCommandValue(selectedPurchaseOrder.poNumber);
      } else {
        setCommandValue("");
      }
    }
  }

  function handleOpenAddPO() {
    setNewPoNumber("");
    setError("");

    setOpen(false);
    setAddDialogOpen(true);
  }

  async function handleCreatePO() {
    setError("");
    setAdding(true);

    const result = await createPurchaseOrder(programmeId, newPoNumber);

    setAdding(false);

    if (!result.success) {
      setError(result.message ?? "Failed to create purchase order.");

      return;
    }

    if (result.purchaseOrder) {
      setPurchaseOrders((current) => [...current, result.purchaseOrder!]);

      setCommandValue(result.purchaseOrder.poNumber);

      onChange(result.purchaseOrder.id);
    }

    setAddDialogOpen(false);
    setNewPoNumber("");
  }

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          type="button"
          disabled={!programmeId}
          role="combobox"
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="truncate">
            {loading
              ? "Loading..."
              : (selectedPurchaseOrder?.poNumber ?? "Search PO...")}
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
            className="max-h-72"
          >
            <CommandInput placeholder="Search PO..." />

            <CommandList className="max-h-64 overflow-y-auto">
              {loading ? (
                <CommandEmpty>Loading POs...</CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>No PO found.</CommandEmpty>

                  <CommandGroup>
                    <CommandItem
                      value="__no_po__"
                      onSelect={handleClearSelection}
                    >
                      <X className="mr-2 h-4 w-4" />
                      No PO
                    </CommandItem>

                    {purchaseOrders.map((purchaseOrder) => (
                      <CommandItem
                        key={purchaseOrder.id}
                        value={purchaseOrder.poNumber}
                        onSelect={() => handleSelect(purchaseOrder)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            value === purchaseOrder.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />

                        {purchaseOrder.poNumber}
                      </CommandItem>
                    ))}

                    <CommandItem
                      value="__add_new_po__"
                      onSelect={handleOpenAddPO}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New PO
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Purchase Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label htmlFor="newPoNumber" className="text-sm font-medium">
              PO Number
            </label>

            <Input
              id="newPoNumber"
              value={newPoNumber}
              onChange={(event) => setNewPoNumber(event.target.value)}
              placeholder="Enter PO number"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={!newPoNumber.trim() || adding}
              onClick={handleCreatePO}
            >
              {adding ? "Adding..." : "Add PO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
