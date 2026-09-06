"use client";

import { List, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { BazarViewMode } from "@/types/bazar";

type BazarFiltersProps = {
  mode: BazarViewMode;
  onModeChange: (mode: BazarViewMode) => void;

  items: string[];
  selectedItem: string;
  onItemChange: (item: string) => void;
};

const BazarFilters = ({
  mode,
  onModeChange,
  items,
  selectedItem,
  onItemChange,
}: BazarFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* View Mode */}
      <div className="inline-flex rounded-lg border bg-muted/40 p-1">
        <Button
          type="button"
          variant={mode === "day-wise" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("day-wise")}
        >
          <Rows3 className="mr-2 size-4" />
          Day Wise
        </Button>

        <Button
          type="button"
          variant={mode === "item-wise" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("item-wise")}
        >
          <List className="mr-2 size-4" />
          Item Wise
        </Button>
      </div>

      {/* Item Filter */}
      <select
        value={selectedItem}
        onChange={(e) => onItemChange(e.target.value)}
        className="h-9 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">All Items</option>

        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BazarFilters;