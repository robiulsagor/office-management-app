"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type ConveyanceMonthSelectorProps = {
  month: string;
};

const ConveyanceMonthSelector = ({
  month,
}: ConveyanceMonthSelectorProps) => {
  const router = useRouter();

  // Convert "2026-09" → Date
  const selectedMonth = new Date(`${month}-01T00:00:00`);

  const currentDate = new Date();

  const currentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentMonth.getFullYear() &&
    selectedMonth.getMonth() === currentMonth.getMonth();

  const formattedMonth = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (offset: number) => {
    const newMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + offset,
      1,
    );

    const year = newMonth.getFullYear();
    const monthNumber = String(newMonth.getMonth() + 1).padStart(2, "0");

    router.push(`/conveyance?month=${year}-${monthNumber}`);
  };

  return (
    <div className="flex items-center rounded-lg border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => changeMonth(-1)}
        aria-label="Previous month"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="min-w-36 px-3 text-center text-sm font-semibold">
        {formattedMonth}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isCurrentMonth}
        onClick={() => changeMonth(1)}
        aria-label="Next month"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default ConveyanceMonthSelector;
