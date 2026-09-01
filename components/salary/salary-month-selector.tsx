"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";

type SalaryMonthSelectorProps = {
  month: string;
};

const SalaryMonthSelector = ({
  month,
}: SalaryMonthSelectorProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Convert "2026-09" → Date
  const [year, monthNumber] = month.split("-").map(Number);

  const selectedMonth = new Date(
    year,
    monthNumber - 1,
    1,
  );

  // Current month
  const now = new Date();

  const currentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  );

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentMonth.getFullYear() &&
    selectedMonth.getMonth() === currentMonth.getMonth();

  // Change month in URL
  const handleMonthChange = (offset: number) => {
    const newDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + offset,
      1,
    );

    const newMonth = `${newDate.getFullYear()}-${String(
      newDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    const params = new URLSearchParams(searchParams.toString());

    params.set("month", newMonth);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrevious = () => {
    handleMonthChange(-1);
  };

  const handleNext = () => {
    if (isCurrentMonth) return;

    handleMonthChange(1);
  };

  const monthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center overflow-hidden rounded-lg border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-none"
        onClick={handlePrevious}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex min-w-38 items-center justify-center gap-2 px-3 text-sm font-medium">
        <CalendarDays className="size-4 text-muted-foreground" />
        {monthName}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-none"
        onClick={handleNext}
        disabled={isCurrentMonth}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default SalaryMonthSelector;