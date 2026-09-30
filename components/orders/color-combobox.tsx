"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { getOrderColors } from "@/actions/order/get-colors";
import { createColor } from "@/actions/order/create-color";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import toast from "react-hot-toast";

type Color = {
  id: string;
  name: string;
};

type ColorComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ColorCombobox({
  value,
  onChange,
}: ColorComboboxProps) {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState<Color[]>([]);
  const [search, setSearch] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadColors() {
      const result = await getOrderColors();

      if (result.success) {
        setColors(result.colors);
      }
    }

    loadColors();
  }, []);

  function handleSelect(color: Color) {
    onChange(color.name);
    setSearch("");
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
    }
  }

  function openAddDialog(name?: string) {
    const colorName = (name ?? search).trim();

    setNewColorName(colorName);
    setSearch("");
    setOpen(false);
    setAddDialogOpen(true);
  }

  async function handleCreateColor() {
    const cleanName = newColorName.trim();

    if (!cleanName) {
      toast.error("Color name is required.");
      return;
    }

    setCreating(true);

    try {
      const result = await createColor(cleanName);

      if (result.success && result.color) {
        const newColor = result.color;

        setColors((current) =>
          [...current, newColor].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );

        onChange(newColor.name);

        setNewColorName("");
        setAddDialogOpen(false);

        toast.success("Color added successfully.");
      } else {
        toast.error(
          result.message ?? "Failed to create color."
        );
      }
    } finally {
      setCreating(false);
    }
  }

  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatch = colors.some(
    (color) =>
      color.name.toLowerCase() === search.trim().toLowerCase()
  );

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
          <span className="truncate">
            {value || "Select color..."}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={4}
          className="w-(--radix-popover-trigger-width) p-0"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search color..."
              value={search}
              onValueChange={setSearch}
              autoFocus
            />

            <CommandList>
              {filteredColors.map((color) => (
                <CommandItem
                  key={color.id}
                  value={color.id}
                  onSelect={() => handleSelect(color)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === color.name
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />

                  {color.name}
                </CommandItem>
              ))}

              {search.trim() && !exactMatch && (
                <CommandItem
                  value={`create-${search.trim()}`}
                  onSelect={() => openAddDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add &quot;{search.trim()}&quot;
                </CommandItem>
              )}

              {filteredColors.length === 0 &&
                !search.trim() &&
                colors.length === 0 && (
                  <div className="p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => openAddDialog()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Color
                    </Button>
                  </div>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {addDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                Add New Color
              </h2>

              <p className="text-sm text-muted-foreground">
                Create a new color for future orders.
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="new-color-name"
                className="mb-2 block text-sm font-medium"
              >
                Color Name
              </label>

              <Input
                id="new-color-name"
                value={newColorName}
                onChange={(event) =>
                  setNewColorName(event.target.value)
                }
                placeholder="Enter color name"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleCreateColor();
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
                  setNewColorName("");
                  setAddDialogOpen(false);
                }}
                disabled={creating}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleCreateColor}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Color"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}