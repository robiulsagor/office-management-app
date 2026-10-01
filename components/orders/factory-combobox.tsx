"use client";

import { useMemo, useState } from "react";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { createFactory } from "@/actions/order/create-factory";
import { getOrderFactories } from "@/actions/order/get-factories";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Factory = {
  id: string;
  name: string;
};

type FactoryComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function FactoryCombobox({
  value,
  onChange,
}: FactoryComboboxProps) {
  const [open, setOpen] = useState(false);

  const [factories, setFactories] = useState<Factory[]>([]);
  const [factoriesLoaded, setFactoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newFactoryName, setNewFactoryName] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadFactories() {
    if (factoriesLoaded || loading) {
      return;
    }

    setLoading(true);

    const result = await getOrderFactories();

    if (result.success) {
      setFactories(result.factories);
      setFactoriesLoaded(true);
    } else {
      toast.error(result.message ?? "Failed to load factories.");
    }

    setLoading(false);
  }

  const selectedFactory = factories.find(
    (factory) => factory.name === value,
  );

  const filteredFactories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return factories;
    }

    return factories.filter((factory) =>
      factory.name.toLowerCase().includes(query),
    );
  }, [factories, search]);

  const exactMatch = factories.some(
    (factory) =>
      factory.name.trim().toLowerCase() ===
      search.trim().toLowerCase(),
  );

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      void loadFactories();
    }

    if (!nextOpen) {
      setSearch("");
    }
  }

  function openAddDialog() {
    setNewFactoryName(search.trim());
    setAddDialogOpen(true);
  }

  function openEmptyAddDialog() {
    setNewFactoryName("");
    setAddDialogOpen(true);
  }

  async function handleCreateFactory() {
    const cleanName = newFactoryName.trim();

    if (!cleanName) {
      toast.error("Factory name is required.");
      return;
    }

    setCreating(true);

    const result = await createFactory(cleanName);

    if (!result.success) {
      /*
       * If the factory already exists, the action can return
       * that existing factory.
       */
      if (result.factory) {
        onChange(result.factory.name);

        setAddDialogOpen(false);
        setOpen(false);
        setSearch("");
      }

      toast.error(result.message ?? "Failed to create factory.");
      setCreating(false);

      return;
    }

    const factory = result.factory;

    if (!factory) {
      toast.error("Factory was created, but no factory data was returned.");
      setCreating(false);

      return;
    }

    setFactories((current) => {
      const alreadyExists = current.some(
        (item) => item.id === factory.id,
      );

      if (alreadyExists) {
        return current;
      }

      return [...current, factory].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    });

    setFactoriesLoaded(true);

    onChange(factory.name);

    setAddDialogOpen(false);
    setOpen(false);
    setSearch("");
    setNewFactoryName("");

    toast.success("Factory added successfully.");

    setCreating(false);
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
          className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-normal shadow-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="truncate">
            {selectedFactory?.name ||
              value ||
              "Select factory..."}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search factory..."
              value={search}
              onValueChange={setSearch}
            />

            <CommandList>
              {loading ? (
                <div className="p-3 text-sm text-muted-foreground">
                  Loading factories...
                </div>
              ) : (
                <>
                  {filteredFactories.map((factory) => (
                    <CommandItem
                      key={factory.id}
                      value={factory.id}
                      onSelect={() => {
                        onChange(factory.name);

                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          value === factory.name
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      {factory.name}
                    </CommandItem>
                  ))}

                  {search.trim() &&
                    !exactMatch && (
                      <CommandItem
                        value={`create-${search.trim()}`}
                        onSelect={openAddDialog}
                      >
                        <Plus className="mr-2 h-4 w-4" />

                        Add &quot;{search.trim()}&quot;
                      </CommandItem>
                    )}

                  {!search.trim() &&
                    factories.length === 0 && (
                      <div className="p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={openEmptyAddDialog}
                        >
                          <Plus className="mr-2 h-4 w-4" />

                          Add New Factory
                        </Button>
                      </div>
                    )}

                  {search.trim() &&
                    filteredFactories.length === 0 &&
                    exactMatch === false &&
                    !search.trim() && (
                      <CommandEmpty>
                        No factories found.
                      </CommandEmpty>
                    )}

                  {search.trim() &&
                    filteredFactories.length === 0 &&
                    exactMatch && (
                      <div className="p-3 text-sm text-muted-foreground">
                        Factory already exists.
                      </div>
                    )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog
        open={addDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!creating) {
            setAddDialogOpen(nextOpen);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New Factory
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="factory-name"
              className="text-sm font-medium"
            >
              Full Factory Name
            </label>

            <Input
              id="factory-name"
              value={newFactoryName}
              onChange={(event) =>
                setNewFactoryName(event.target.value)
              }
              placeholder="e.g. ASL APPARELS LTD"
              disabled={creating}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleCreateFactory}
              disabled={creating}
            >
              {creating ? "Adding..." : "Add Factory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}