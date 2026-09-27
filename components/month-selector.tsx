"use client";

import { useEffect, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type MonthSelectorProps = {
  month: string;
  basePath: string;
};

const MonthSelector = ({
  month,
  basePath = "/bazar",
}: MonthSelectorProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [year, monthNumber] = month.split("-").map(Number);

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

  const monthName = selectedDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const getMonthUrl = (amount: number) => {
    const newDate = new Date(selectedDate);

    newDate.setMonth(
      newDate.getMonth() + amount,
    );

    const newYear = newDate.getFullYear();

    const newMonth = String(
      newDate.getMonth() + 1,
    ).padStart(2, "0");

    return `${basePath}?month=${newYear}-${newMonth}`;
  };

  const changeMonth = (amount: number) => {
    const url = getMonthUrl(amount);

    startTransition(() => {
      router.push(url);
    });
  };

  /*
   * Prefetch previous and next month.
   *
   * This runs whenever the current month changes.
   */
  useEffect(() => {
    const previousMonthUrl = getMonthUrl(-1);

    const nextMonthUrl = getMonthUrl(1);

    router.prefetch(previousMonthUrl);
    router.prefetch(nextMonthUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, basePath]);

  const isCurrentMonth =
    selectedDate.getTime() >= currentDate.getTime();

  return (
    <div className="flex items-center gap-2">
      {/* Previous Month */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isPending}
        onClick={() => changeMonth(-1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {/* Current Month */}
      <div className="min-w-40 text-center">
        <p className="text-base font-semibold">
          {isPending ? "Loading..." : monthName}
        </p>
      </div>

      {/* Next Month */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={
          isPending || isCurrentMonth
        }
        onClick={() => changeMonth(1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;