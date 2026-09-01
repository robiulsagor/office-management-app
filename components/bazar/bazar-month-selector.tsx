"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type BazarMonthSelectorProps = {
  month: Date;
  onMonthChange: (date: Date) => void;
};

const BazarMonthSelector = ({
  month,
  onMonthChange,
}: BazarMonthSelectorProps) => {
  const now = new Date();

  const currentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  );

  const selectedMonth = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
  );

  const isCurrentMonth =
    selectedMonth.getTime() === currentMonth.getTime();

  const monthName = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goPrevious = () => {
    onMonthChange(
      new Date(
        month.getFullYear(),
        month.getMonth() - 1,
        1,
      ),
    );
  };

  const goNext = () => {
    if (isCurrentMonth) return;

    onMonthChange(
      new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        1,
      ),
    );
  };

  return (
    <div className="flex items-center rounded-lg border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={goPrevious}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="min-w-36 px-3 text-center text-sm font-semibold">
        {monthName}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isCurrentMonth}
        onClick={goNext}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default BazarMonthSelector;