"use client";

import { useMemo, useRef, useState } from "react";

import { Check, Plus } from "lucide-react";

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
import { Button } from "@/components/ui/button";

type BazarMasterItem = {
  id: string;
  nameEn: string;
  nameBn: string;
};

type BazarItemSelectorProps = {
  items: BazarMasterItem[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: BazarMasterItem) => void;
  onAddNew: (nameEn: string, nameBn: string) => Promise<BazarMasterItem | null>;
};

const BazarItemSelector = ({
  items,
  value,
  onChange,
  onSelect,
  onAddNew,
}: BazarItemSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameBn, setNewNameBn] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const search = value.trim().toLowerCase();

    if (!search) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.nameEn.toLowerCase().includes(search) ||
        item.nameBn.includes(value.trim())
      );
    });
  }, [items, value]);

  const handleSelect = (item: BazarMasterItem) => {
    onSelect(item);
    setOpen(false);
  };
  const handleOpenAddDialog = () => {
    const name = value.trim();

    if (!name) return;

    setNewNameEn(name);
    setNewNameBn("");
    setOpen(false);
    setAddDialogOpen(true);
  };

const handleCreateItem = async () => {
  const nameEn = newNameEn.trim();
  const nameBn = newNameBn.trim();

  if (!nameEn) return;

  try {
    setAdding(true);

    const createdItem = await onAddNew(nameEn, nameBn);

    if (!createdItem) return;

    onSelect(createdItem);

    setAddDialogOpen(false);
    setNewNameEn("");
    setNewNameBn("");
  } finally {
    setAdding(false);
  }
};

  return (
    <>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          placeholder="Search or type item..."
          onFocus={() => setOpen(true)}
          className="text-sm md:text-base"
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
          }}
        />

        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-background shadow-md">
            {filteredItems.length > 0 && (
              <div className="p-1">
                {filteredItems.map((item) => {
                  const selected =
                    value === item.nameEn || value === item.nameBn;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.nameEn}</span>

                        <span className="text-xs text-muted-foreground">
                          {item.nameBn}
                        </span>
                      </div>

                      {selected && <Check className="size-4 text-teal-600" />}
                    </button>
                  );
                })}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="p-3 text-sm text-muted-foreground">
                No matching item found.
              </div>
            )}

            {value.trim() && filteredItems.length === 0 && (
              <div className="border-t p-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={handleOpenAddDialog}
                >
                  <Plus className="size-4" />

                  <span>Add &quot;{value.trim()}&quot; as new item</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Item Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Bazar Item</DialogTitle>

            <DialogDescription>
              Add the English and Bangla names for this item.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-item-name-en">English Name</Label>

              <Input
                id="new-item-name-en"
                value={newNameEn}
                onChange={(e) => setNewNameEn(e.target.value)}
                placeholder="e.g. Cucumber"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-item-name-bn">বাংলা নাম</Label>

              <Input
                id="new-item-name-bn"
                value={newNameBn}
                onChange={(e) => setNewNameBn(e.target.value)}
                placeholder="যেমন: শসা"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={adding}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleCreateItem}
              disabled={!newNameEn.trim() || adding}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {adding ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BazarItemSelector;
