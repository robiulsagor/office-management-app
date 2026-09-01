"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { bazarMasterItems } from "./bazar-items";

type BazarItemSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const BazarItemSelector = ({
  value,
  onChange,
}: BazarItemSelectorProps) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const search = value.trim().toLowerCase();

    if (!search) {
      return bazarMasterItems;
    }

    return bazarMasterItems.filter((item) => {
      return (
        item.nameEn.toLowerCase().includes(search) ||
        item.nameBn.includes(value.trim())
      );
    });
  }, [value]);

  const handleSelect = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  const handleAddNew = () => {
    const newItem = value.trim();

    if (!newItem) return;

    onChange(newItem);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        placeholder="Search or type item..."
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          // Small delay so clicking a suggestion works
          setTimeout(() => setOpen(false), 150);
        }}
      />

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-background shadow-md">
          {filteredItems.length > 0 ? (
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
                    onClick={() => handleSelect(item.nameEn)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.nameEn}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {item.nameBn}
                      </span>
                    </div>

                    {selected && (
                      <Check className="size-4 text-teal-600" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
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
                onClick={handleAddNew}
              >
                <Plus className="size-4" />

                <span>
                  Add &quot;{value.trim()}&quot; as new item
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BazarItemSelector;
