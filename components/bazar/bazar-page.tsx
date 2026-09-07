"use client";

import { useEffect, useMemo, useState } from "react";

import { Printer, Plus, ShoppingBasket } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { BazarEntry, BazarViewMode } from "@/types/bazar";

import BazarMonthSelector from "./bazar-month-selector";
import BazarSummary from "./bazar-summary";
import BazarFilters from "./bazar-filters";
import BazarDayTable from "./bazar-day-table";
import BazarItemTable from "./bazar-item-table";
import BazarFormDialog from "./bazar-form-dialog";
import { getBazarEntries } from "@/actions/bazar/get-bazar-entries";
import { deleteBazarEntry } from "@/actions/bazar/delete-bazar-entry";

type BazarPageProps = {
  month: string;
  currentUserId: string;
  currentUserRole: string;
};

const BazarPage = ({
  month,
  currentUserId,
  currentUserRole,
}: BazarPageProps) => {
  // ------------------------------------------------
  // State
  // ------------------------------------------------

  const [viewMode, setViewMode] = useState<BazarViewMode>("day-wise");

  const [selectedItem, setSelectedItem] = useState("");

  const [entries, setEntries] = useState<BazarEntry[]>([]);

  const [formOpen, setFormOpen] = useState(false);

  const [editingEntry, setEditingEntry] = useState<BazarEntry | null>(null);
  const refreshEntries = async () => {
    const result = await getBazarEntries(month);

    if (!result.success) {
      console.error(result.message);
      return;
    }

    setEntries(result.data);
  };

  useEffect(() => {
    const loadBazarEntries = async () => {
      const result = await getBazarEntries(month);

      if (!result.success) {
        console.error(result.message);
        return;
      }

      setEntries(result.data);
    };

    void loadBazarEntries();
  }, [month]);

  // ------------------------------------------------
  // Convert URL month to Date
  //
  // "2026-09" -> Date(2026, 8, 1)
  //
  // This is only needed because your existing
  // BazarFormDialog expects a Date.
  // ------------------------------------------------

  const selectedMonth = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);

    return new Date(year, monthNumber - 1, 1);
  }, [month]);

  // ------------------------------------------------
  // Edit Entry
  // ------------------------------------------------

  const handleEditEntry = (entry: BazarEntry) => {
    const isOwner = entry.createdById === currentUserId;

    const isAdmin =
      currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return;
    }

    setEditingEntry(entry);
    setFormOpen(true);
  };

  // ------------------------------------------------
  // Filter month
  // ------------------------------------------------

  const monthlyEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        // entry.date example:
        // "2026-09-05"
        //
        // month example:
        // "2026-09"

        return entry.date.startsWith(month);
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [entries, month]);

  const itemNames = useMemo(() => {
    return [
      ...new Set(
        monthlyEntries.flatMap((entry) => entry.items.map((item) => item.name)),
      ),
    ].sort();
  }, [monthlyEntries]);

  const filteredEntries = useMemo(() => {
    if (!selectedItem) {
      return monthlyEntries;
    }

    return monthlyEntries.filter((entry) =>
      entry.items.some((item) => item.name === selectedItem),
    );
  }, [monthlyEntries, selectedItem]);

  // ------------------------------------------------
  // Summary calculations
  // ------------------------------------------------

  const totalDeposits = useMemo(() => {
    return monthlyEntries.reduce((sum, entry) => sum + entry.deposit, 0);
  }, [monthlyEntries]);

  const totalExpense = useMemo(() => {
    return monthlyEntries.reduce(
      (sum, entry) =>
        sum + entry.items.reduce((itemSum, item) => itemSum + item.price, 0),
      0,
    );
  }, [monthlyEntries]);

  const balance = totalDeposits - totalExpense;

  // ------------------------------------------------
  // Save Entry
  // ------------------------------------------------

  const handleSaveEntry = async () => {
    await refreshEntries();

    setEditingEntry(null);
  };

  // ------------------------------------------------
  // Delete Entry
  // ------------------------------------------------

  const handleDeleteEntry = async (entry: BazarEntry) => {
    const isOwner = entry.createdById === currentUserId;

    const isAdmin =
      currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return;
    }

    const confirmed = window.confirm(`Delete bazar entry for ${entry.date}?`);

    if (!confirmed) return;

    const result = await deleteBazarEntry(entry.id);

    if (!result.success) {
      console.error(result.message);
      return;
    }

    await refreshEntries();
  };
  // ------------------------------------------------
  // Print
  // ------------------------------------------------

  const handlePrint = () => {
    sessionStorage.setItem(
      "bazar-print-data",
      JSON.stringify({
        month,
        entries: monthlyEntries,
      }),
    );

    window.open("/print/bazar", "_blank");
  };

  // ------------------------------------------------
  // Render
  // ------------------------------------------------

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
          <BazarMonthSelector month={month} />

          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 size-4" />
            Print
          </Button>

          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => {
              setEditingEntry(null);
              setFormOpen(true);
            }}
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
            <CardTitle className="text-lg">Bazar History</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {monthlyEntries.length}{" "}
              {monthlyEntries.length === 1 ? "entry" : "entries"} recorded this
              month.
            </p>
          </div>

          <BazarFilters
            mode={viewMode}
            onModeChange={setViewMode}
            items={itemNames}
            selectedItem={selectedItem}
            onItemChange={setSelectedItem}
          />
        </CardHeader>

        <CardContent className="p-0">
          {monthlyEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBasket className="size-10 text-muted-foreground/40" />

              <p className="mt-3 font-medium">No bazar data found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a bazar entry for this month.
              </p>
            </div>
          ) : viewMode === "day-wise" ? (
            <BazarDayTable
              entries={filteredEntries}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          ) : (
            <BazarItemTable
              entries={filteredEntries}
              selectedItem={selectedItem}
            />
          )}
        </CardContent>
      </Card>

      {/* ========================================== */}
      {/* Add / Edit Bazar Dialog */}
      {/* ========================================== */}

      <BazarFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        selectedMonth={selectedMonth}
        editingEntry={editingEntry}
        onSave={handleSaveEntry}
      />
    </div>
  );
};

export default BazarPage;
