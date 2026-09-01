"use client";

import { List, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { BazarViewMode } from "@/types/bazar";

type BazarFiltersProps = {
  mode: BazarViewMode;
  onModeChange: (mode: BazarViewMode) => void;
};

const BazarFilters = ({
  mode,
  onModeChange,
}: BazarFiltersProps) => {
  return (
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
  );
};

export default BazarFilters;