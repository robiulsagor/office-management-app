
"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type BazarMasterItem = {
  id: string;
  nameEn: string;
  nameBn: string;
};

// --------------------------------------------------
// Temporary master item list
// Later this will come from the database.
// --------------------------------------------------

const initialBazarItems: BazarMasterItem[] = [
  {
    id: "rice",
    nameEn: "Rice",
    nameBn: "চাল",
  },
  {
    id: "potato",
    nameEn: "Potato",
    nameBn: "আলু",
  },
  {
    id: "onion",
    nameEn: "Onion",
    nameBn: "পেঁয়াজ",
  },
  {
    id: "oil",
    nameEn: "Oil",
    nameBn: "তেল",
  },
  {
    id: "fish",
    nameEn: "Fish",
    nameBn: "মাছ",
  },
  {
    id: "chicken",
    nameEn: "Chicken",
    nameBn: "মুরগি",
  },
  {
    id: "vegetables",
    nameEn: "Vegetables",
    nameBn: "সবজি",
  },
  {
    id: "tea",
    nameEn: "Tea",
    nameBn: "চা",
  },
  {
    id: "sugar",
    nameEn: "Sugar",
    nameBn: "চিনি",
  },
];

type BazarItemSelectorProps = {
  value: string;
  onChange: (itemId: string) => void;
};

const BazarItemSelector = ({
  value,
  onChange,
}: BazarItemSelectorProps) => {
  const [items, setItems] =
    useState<BazarMasterItem[]>(initialBazarItems);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] =
    useState(false);

  const [newNameEn, setNewNameEn] =
    useState("");

  const [newNameBn, setNewNameBn] =
    useState("");

  // --------------------------------------------------
  // Currently selected item
  // --------------------------------------------------

  const selectedItem = useMemo(() => {
    return items.find(
      (item) => item.id === value,
    );
  }, [items, value]);

  // --------------------------------------------------
  // Filter items
  //
  // Search works against BOTH English and Bangla.
  // --------------------------------------------------

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.nameEn.toLowerCase().includes(query) ||
        item.nameBn.includes(search.trim())
      );
    });
  }, [items, search]);

  // --------------------------------------------------
  // Select existing item
  // --------------------------------------------------

  const handleSelect = (
    item: BazarMasterItem,
  ) => {
    onChange(item.id);

    setSearch("");
    setOpen(false);
  };

  // --------------------------------------------------
  // Open add-new-item dialog
  // --------------------------------------------------

  const handleOpenAddDialog = () => {
    // If the user typed something before clicking
    // "Add new item", use it as the English name
    // if it contains English characters.
    setNewNameEn(search.trim());

    setNewNameBn("");

    setAddDialogOpen(true);

    setOpen(false);
  };

  // --------------------------------------------------
  // Add new master item
  // --------------------------------------------------

  const handleAddNewItem = () => {
    const nameEn = newNameEn.trim();
    const nameBn = newNameBn.trim();

    if (!nameEn || !nameBn) {
      return;
    }

    // Prevent duplicate English names.
    const duplicate = items.some(
      (item) =>
        item.nameEn.toLowerCase() ===
        nameEn.toLowerCase(),
    );

    if (duplicate) {
      return;
    }

    const newItem: BazarMasterItem = {
      id: crypto.randomUUID(),
      nameEn,
      nameBn,
    };

    setItems((prev) => [
      ...prev,
      newItem,
    ]);

    // Immediately select the newly created item.
    onChange(newItem.id);

    // Reset form.
    setNewNameEn("");
    setNewNameBn("");

    setAddDialogOpen(false);
    setSearch("");
  };

  return (
    <>
      {/* ================================================= */}
      {/* Item Selector */}
      {/* ================================================= */}

      <div className="relative space-y-2">
        <Label>Item</Label>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <span
            className={
              selectedItem
                ? "flex items-center gap-2"
                : "text-muted-foreground"
            }
          >
            {selectedItem ? (
              <>
                <span>
                  {selectedItem.nameEn}
                </span>

                <span className="text-muted-foreground">
                  / {selectedItem.nameBn}
                </span>
              </>
            ) : (
              "Select item"
            )}
          </span>

          <ChevronDown className="size-4 text-muted-foreground" />
        </button>

        {/* ================================================= */}
        {/* Dropdown */}
        {/* ================================================= */}

        {open && (
          <div className="absolute left-0 right-0 z-50 mt-1 rounded-md border bg-popover p-2 shadow-md">

            {/* Search */}
            <Input
              autoFocus
              placeholder="Search item / আইটেম খুঁজুন..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="mb-2"
            />

            {/* Results */}
            <div className="max-h-60 overflow-y-auto">

              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleSelect(item)
                      }
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                    >
                      <div>
                        <div className="font-medium">
                          {item.nameEn}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {item.nameBn}
                        </div>
                      </div>

                      {item.id === value && (
                        <Check className="size-4" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No item found.
                </div>
              )}

            </div>

            {/* Add new item */}
            <div className="mt-2 border-t pt-2">
              <button
                type="button"
                onClick={handleOpenAddDialog}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <Plus className="size-4" />

                {search.trim()
                  ? `Add "${search.trim()}" as new item`
                  : "Add new item"}
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* Add New Item Dialog */}
      {/* ================================================= */}

      <Dialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New Bazar Item
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* English */}
            <div className="space-y-2">
              <Label htmlFor="item-name-en">
                English Name
              </Label>

              <Input
                id="item-name-en"
                placeholder="e.g. Tomato"
                value={newNameEn}
                onChange={(e) =>
                  setNewNameEn(e.target.value)
                }
              />
            </div>

            {/* Bangla */}
            <div className="space-y-2">
              <Label htmlFor="item-name-bn">
                বাংলা নাম
              </Label>

              <Input
                id="item-name-bn"
                placeholder="যেমন: টমেটো"
                value={newNameBn}
                onChange={(e) =>
                  setNewNameBn(e.target.value)
                }
              />
            </div>

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
              onClick={handleAddNewItem}
              disabled={
                !newNameEn.trim() ||
                !newNameBn.trim()
              }
              className="bg-teal-600 hover:bg-teal-700"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BazarItemSelector;
