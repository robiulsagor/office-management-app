"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { getReportData } from "@/actions/report/get-report-data";

import ReportFilters from "@/components/report/report-filters";
import ReportSummary from "@/components/report/report-summary";
import DailyTransactions from "@/components/report/daily-transactions";

import {
  formatMonthLabel,
  getCurrentMonth,
  isValidMonth,
} from "@/components/report/report-utils";

import type {
  DayRow,
  ReportResult,
  ReportVisibility,
} from "@/components/report/report-types";

export default function FinancialReport() {
  const searchParams = useSearchParams();
  const queryMonth = searchParams.get("month");

  const month = isValidMonth(queryMonth)
    ? queryMonth
    : getCurrentMonth();

  const [data, setData] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBazar, setShowBazar] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [showDeposits, setShowDeposits] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      setLoading(true);
      setError("");

      try {
        const result = await getReportData(month);

        if (cancelled) return;

        if (!result.success) {
          setData(null);
          setError(result.message);
        } else {
          setData(result.data);
        }
      } catch {
        if (cancelled) return;

        setData(null);
        setError("Failed to load the financial report.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReport();

    return () => {
      cancelled = true;
    };
  }, [month]);

  const visibility: ReportVisibility = {
    showBazar,
    showExpenses,
    showDeposits,
  };

  const rows = useMemo(() => {
    const rowsByDate = new Map<string, DayRow>();

    const getDay = (date: string) => {
      const key = date.slice(0, 10);

      let row = rowsByDate.get(key);

      if (!row) {
        row = {
          date: key,
          bazarEntries: [],
          expenses: [],
          deposits: [],
        };

        rowsByDate.set(key, row);
      }

      return row;
    };

    if (data) {
      if (showBazar) {
        data.bazarEntries.forEach((entry) => {
          getDay(entry.date).bazarEntries.push(entry);
        });
      }

      if (showExpenses) {
        data.expenses.forEach((expense) => {
          getDay(expense.date).expenses.push(expense);
        });
      }

      if (showDeposits) {
        data.deposits.forEach((deposit) => {
          getDay(deposit.date).deposits.push(deposit);
        });
      }
    }

    return Array.from(rowsByDate.values()).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [data, showBazar, showExpenses, showDeposits]);

  const bazarTotal =
    showBazar && data
      ? data.bazarEntries.reduce(
          (sum, entry) =>
            sum +
            entry.items.reduce(
              (itemSum, item) => itemSum + item.price,
              0,
            ),
          0,
        )
      : 0;

  const otherExpensesTotal =
    showExpenses && data
      ? data.expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0,
        )
      : 0;

  const totalExpenses = bazarTotal + otherExpensesTotal;

  const totalDeposits =
    showDeposits && data
      ? data.deposits.reduce(
          (sum, deposit) => sum + deposit.amount,
          0,
        )
      : 0;

  const remainingBalance = totalDeposits - totalExpenses;

  // Print report integration
  function handlePrintReport() {
    if (!data || loading || error) return;

    // Pass the selected month's daily summary to the print page.
    sessionStorage.setItem(
      "expense-history-print-data",
      JSON.stringify({
        month,
        rows,
      }),
    );

    // Reuse the existing print route.
    window.open("/print/bazar", "_blank");
  }

  return (
    <main className="mx-auto w-full space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Financial Report
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monthly bazar, expenses and deposit summary.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrintReport}
          disabled={loading || !data || Boolean(error)}
          className="print:hidden inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <Printer className="size-4" />
          Print Report
        </button>
      </div>

      <ReportFilters
        month={month}
        showBazar={showBazar}
        showExpenses={showExpenses}
        showDeposits={showDeposits}
        onShowBazarChange={setShowBazar}
        onShowExpensesChange={setShowExpenses}
        onShowDepositsChange={setShowDeposits}
      />

      <section className="space-y-1">
        <h2 className="text-lg font-semibold">
          {formatMonthLabel(month)}
        </h2>

        <p className="text-sm text-muted-foreground">
          Monthly financial summary
        </p>
      </section>

      {loading ? (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          Generating report...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 p-5 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <ReportSummary
            showBazar={showBazar}
            showExpenses={showExpenses}
            showDeposits={showDeposits}
            totalExpenses={totalExpenses}
            totalDeposits={totalDeposits}
            remainingBalance={remainingBalance}
          />

          <DailyTransactions
            key={month}
            rows={rows}
            visibility={visibility}
            bazarTotal={bazarTotal}
            otherExpensesTotal={otherExpensesTotal}
            totalExpenses={totalExpenses}
            totalDeposits={totalDeposits}
          />
        </>
      )}
    </main>
  );
}