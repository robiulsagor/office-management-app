"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type BazarMonthSelectorProps = {
  month: string;
};

const BazarMonthSelector = ({
  month,
}: BazarMonthSelectorProps) => {
  const router = useRouter();

  const [year, monthNumber] = month
    .split("-")
    .map(Number);

  const selectedDate = new Date(
    year,
    monthNumber - 1,
    1,
  );

  const currentDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );

  const monthName =
    selectedDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const changeMonth = (amount: number) => {
    const newDate = new Date(selectedDate);

    newDate.setMonth(
      newDate.getMonth() + amount,
    );

    const newYear = newDate.getFullYear();

    const newMonth = String(
      newDate.getMonth() + 1,
    ).padStart(2, "0");

    router.push(
      `/bazar?month=${newYear}-${newMonth}`,
    );
  };

  const isCurrentMonth =
    selectedDate.getTime() >=
    currentDate.getTime();

  return (
    <div className="flex items-center gap-2">

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => changeMonth(-1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="min-w-40 text-center">
        <p className="text-base font-semibold">
          {monthName}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isCurrentMonth}
        onClick={() => changeMonth(1)}
      >
        <ChevronRight className="size-4" />
      </Button>

    </div>
  );
};

export default BazarMonthSelector;