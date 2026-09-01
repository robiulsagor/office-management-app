"use client";

import { useMemo, useState } from "react";
import {
  Printer,
  Plus,
  ShoppingBasket,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BazarEntry,
  BazarViewMode,
} from "@/types/bazar";

import BazarMonthSelector from "./bazar-month-selector";
import BazarSummary from "./bazar-summary";
import BazarFilters from "./bazar-filters";
import BazarDayTable from "./bazar-day-table";
import BazarItemTable from "./bazar-item-table";
import BazarFormDialog from "./bazar-form-dialog";


// --------------------------------------------------
// Mock data
// --------------------------------------------------

const initialBazarData: BazarEntry[] = [
  {
    id: "1",
    date: "2026-09-01",
    deposit: 1000,
    items: [
      {
        id: "1-1",
        name: "Rice",
        price: 250,
      },
      {
        id: "1-2",
        name: "Vegetables",
        price: 180,
      },
      {
        id: "1-3",
        name: "Oil",
        price: 220,
      },
    ],
  },

  {
    id: "2",
    date: "2026-09-02",
    deposit: 800,
    items: [
      {
        id: "2-1",
        name: "Fish",
        price: 350,
      },
      {
        id: "2-2",
        name: "Potato",
        price: 100,
      },
    ],
  },

  {
    id: "3",
    date: "2026-09-03",
    deposit: 1000,
    items: [
      {
        id: "3-1",
        name: "Chicken",
        price: 420,
      },
      {
        id: "3-2",
        name: "Onion",
        price: 100,
      },
    ],
  },

  {
    id: "4",
    date: "2026-09-05",
    deposit: 500,
    items: [
      {
        id: "4-1",
        name: "Tea",
        price: 180,
      },
      {
        id: "4-2",
        name: "Sugar",
        price: 100,
      },
    ],
  },
];


const BazarPage = () => {

  // ------------------------------------------------
  // State
  // ------------------------------------------------

  const [selectedMonth, setSelectedMonth] =
    useState(() => {
      const now = new Date();

      return new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );
    });

  const [viewMode, setViewMode] =
    useState<BazarViewMode>("day-wise");

  const [entries, setEntries] =
    useState<BazarEntry[]>(
      initialBazarData,
    );

  const [formOpen, setFormOpen] =
    useState(false);


  // ------------------------------------------------
  // Filter month
  // ------------------------------------------------

  const monthlyEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        const date = new Date(
          `${entry.date}T00:00:00`,
        );

        return (
          date.getFullYear() ===
            selectedMonth.getFullYear() &&
          date.getMonth() ===
            selectedMonth.getMonth()
        );
      })
      .sort((a, b) =>
        a.date.localeCompare(b.date),
      );
  }, [entries, selectedMonth]);


  // ------------------------------------------------
  // Summary calculations
  // ------------------------------------------------

  const totalDeposits = useMemo(() => {
    return monthlyEntries.reduce(
      (sum, entry) =>
        sum + entry.deposit,
      0,
    );
  }, [monthlyEntries]);


  const totalExpense = useMemo(() => {
    return monthlyEntries.reduce(
      (sum, entry) =>
        sum +
        entry.items.reduce(
          (itemSum, item) =>
            itemSum + item.price,
          0,
        ),
      0,
    );
  }, [monthlyEntries]);


  const balance =
    totalDeposits - totalExpense;


  // ------------------------------------------------
  // Add Entry
  // ------------------------------------------------

  const handleAddEntry = (
    entry: BazarEntry,
  ) => {
    setEntries((prev) => [
      ...prev,
      entry,
    ]);
  };


  // ------------------------------------------------
  // Print
  // ------------------------------------------------

  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="mx-auto w-full space-y-6 pb-10">

      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
            <ShoppingBasket className="size-5" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight md:text-2xl">
              Bazar
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage monthly office bazar and expenses.
            </p>
          </div>

        </div>


        <div className="flex flex-wrap items-center gap-2">

          <BazarMonthSelector
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
          />

          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="mr-2 size-4" />
            Print
          </Button>

          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() =>
              setFormOpen(true)
            }
          >
            <Plus className="mr-2 size-4" />
            Add Bazar
          </Button>

        </div>

      </div>


      {/* ========================================== */}
      {/* Summary */}
      {/* ========================================== */}

      <BazarSummary
        deposits={totalDeposits}
        expense={totalExpense}
        balance={balance}
      />


      {/* ========================================== */}
      {/* Main Table */}
      {/* ========================================== */}

      <Card>

        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <CardTitle className="text-lg">
              Bazar History
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {monthlyEntries.length}{" "}
              {monthlyEntries.length === 1
                ? "entry"
                : "entries"}{" "}
              recorded this month.
            </p>
          </div>

          <BazarFilters
            mode={viewMode}
            onModeChange={setViewMode}
          />

        </CardHeader>


        <CardContent className="p-0">

          {monthlyEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">

              <ShoppingBasket className="size-10 text-muted-foreground/40" />

              <p className="mt-3 font-medium">
                No bazar data found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a bazar entry for this month.
              </p>

            </div>
          ) : viewMode === "day-wise" ? (
            <BazarDayTable
              entries={monthlyEntries}
            />
          ) : (
            <BazarItemTable
              entries={monthlyEntries}
            />
          )}

        </CardContent>

      </Card>


      {/* ========================================== */}
      {/* Add Bazar Dialog */}
      {/* ========================================== */}

      <BazarFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        selectedMonth={selectedMonth}
        onSave={handleAddEntry}
      />

    </div>
  );
};

export default BazarPage;