"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { getOrderBuyers } from "@/actions/order/get-buyers";
import { createBuyer } from "@/actions/order/create-buyer";

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

type Buyer = {
  id: string;
  name: string;
};

type BuyerComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function BuyerCombobox({
  value,
  onChange,
}: BuyerComboboxProps) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [open, setOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newBuyerName, setNewBuyerName] = useState("");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // Controls which item Command highlights with keyboard
  const [commandValue, setCommandValue] = useState("");

  useEffect(() => {
    async function loadBuyers() {
      setLoading(true);

      const result = await getOrderBuyers();

      if (result.success) {
        setBuyers(result.buyers);
      }

      setLoading(false);
    }

    loadBuyers();
  }, []);

  const selectedBuyer = buyers.find(
    (buyer) => buyer.id === value
  );

  function handleSelect(buyer: Buyer) {
    setCommandValue(buyer.name);
    onChange(buyer.id);
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen && selectedBuyer) {
      setCommandValue(selectedBuyer.name);
    }
  }

  function handleOpenAddBuyer() {
    setNewBuyerName("");
    setError("");
    setOpen(false);
    setAddDialogOpen(true);
  }

  async function handleCreateBuyer() {
    setError("");
    setAdding(true);

    const result = await createBuyer(newBuyerName);

    setAdding(false);

    if (!result.success) {
      setError(result.message ?? "Failed to create buyer.");
      return;
    }

    if (result.buyer) {
      setBuyers((current) => [
        ...current,
        result.buyer!,
      ]);

      setCommandValue(result.buyer.name);
      onChange(result.buyer.id);
    }

    setAddDialogOpen(false);
    setNewBuyerName("");
  }

  return (
    <>
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-normal"
        >
          {selectedBuyer?.name ?? "Search buyer..."}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-0"
        >
          <Command
            value={commandValue}
            onValueChange={setCommandValue}
          >
            <CommandInput placeholder="Search buyer..." />

            <CommandList>
              {loading ? (
                <CommandEmpty>
                  Loading buyers...
                </CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>
                    No buyer found.
                  </CommandEmpty>

                  <CommandGroup>
                    {buyers.map((buyer) => (
                      <CommandItem
                        key={buyer.id}
                        value={buyer.name}
                        onSelect={() =>
                          handleSelect(buyer)
                        }
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            value === buyer.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />

                        {buyer.name}
                      </CommandItem>
                    ))}

                    <CommandItem
                      value="__add_new_buyer__"
                      onSelect={handleOpenAddBuyer}
                    >
                      <Plus className="mr-2 h-4 w-4" />

                      Add New Buyer
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New Buyer
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label
              htmlFor="newBuyerName"
              className="text-sm font-medium"
            >
              Buyer Name
            </label>

            <Input
              id="newBuyerName"
              value={newBuyerName}
              onChange={(event) =>
                setNewBuyerName(event.target.value)
              }
              placeholder="Enter buyer name"
            />

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setAddDialogOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                !newBuyerName.trim() || adding
              }
              onClick={handleCreateBuyer}
            >
              {adding ? "Adding..." : "Add Buyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}