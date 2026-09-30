"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { getOrderProgrammes } from "@/actions/order/get-programmes";
import { createProgramme } from "@/actions/order/create-programme";

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

type Programme = {
  id: string;
  name: string;
};

type ProgrammeComboboxProps = {
  buyerId: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ProgrammeCombobox({
  buyerId,
  value,
  onChange,
}: ProgrammeComboboxProps) {
  const [programmes, setProgrammes] = useState<Programme[]>([]);

  const [open, setOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [newProgrammeName, setNewProgrammeName] = useState("");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // Controls which item Command highlights with keyboard
  const [commandValue, setCommandValue] = useState("");

  useEffect(() => {
    if (!buyerId) {
      return;
    }

    async function loadProgrammes() {
      setLoading(true);

      const result = await getOrderProgrammes(buyerId);

      if (result.success) {
        setProgrammes(result.programmes);
      }

      setLoading(false);
    }

    loadProgrammes();
  }, [buyerId]);

  const selectedProgramme = programmes.find(
    (programme) => programme.id === value,
  );

  function handleSelect(programme: Programme) {
    setCommandValue(programme.name);

    onChange(programme.id);

    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen && selectedProgramme) {
      setCommandValue(selectedProgramme.name);
    }
  }

  function handleOpenAddProgramme() {
    setNewProgrammeName("");
    setError("");

    setOpen(false);
    setAddDialogOpen(true);
  }

  async function handleCreateProgramme() {
    setError("");
    setAdding(true);

    const result = await createProgramme(buyerId, newProgrammeName);

    setAdding(false);

    if (!result.success) {
      setError(result.message ?? "Failed to create programme.");

      return;
    }

    if (result.programme) {
      setProgrammes((current) => [...current, result.programme!]);

      setCommandValue(result.programme.name);

      onChange(result.programme.id);
    }

    setAddDialogOpen(false);
    setNewProgrammeName("");
  }

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          type="button"
          disabled={!buyerId}
          role="combobox"
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : (selectedProgramme?.name ?? "Search programme...")}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={4}
          className="w-(--radix-popover-trigger-width) p-0"
        >
          <Command value={commandValue} onValueChange={setCommandValue}>
            <CommandInput placeholder="Search programme..." />

            <CommandList>
              {loading ? (
                <CommandEmpty>Loading programmes...</CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>No programme found.</CommandEmpty>

                  <CommandGroup>
                    {programmes.map((programme) => (
                      <CommandItem
                        key={programme.id}
                        value={programme.name}
                        onSelect={() => handleSelect(programme)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            value === programme.id ? "opacity-100" : "opacity-0"
                          }`}
                        />

                        {programme.name}
                      </CommandItem>
                    ))}

                    <CommandItem
                      value="__add_new_programme__"
                      onSelect={handleOpenAddProgramme}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Programme
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
            <DialogTitle>Add New Programme</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label htmlFor="newProgrammeName" className="text-sm font-medium">
              Programme Name
            </label>

            <Input
              id="newProgrammeName"
              value={newProgrammeName}
              onChange={(event) => setNewProgrammeName(event.target.value)}
              placeholder="Enter programme name"
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
              disabled={!newProgrammeName.trim() || adding}
              onClick={handleCreateProgramme}
            >
              {adding ? "Adding..." : "Add Programme"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
