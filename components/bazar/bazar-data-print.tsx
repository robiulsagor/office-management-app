"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";

import type { DayRow } from "@/components/report/report-types";

const PRINT_KEY = "expense-history-print-data";

type PrintData = {
  month: string;
  rows: DayRow[];
};

const formatCurrency = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function BazarPrintPage() {
  const [printData, setPrintData] = useState<PrintData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem(PRINT_KEY);

    if (!storedData) return;

    try {
      const parsedData = JSON.parse(storedData) as PrintData;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrintData(parsedData);
    } catch {
      setPrintData(null);
    }
  }, []);

  if (!printData) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-lg font-semibold">
          No report data available
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Return to the report page and select Print Report.
        </p>
      </div>
    );
  }

  const monthName = new Date(printData.month).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const rows = printData.rows;

  const dailyRows = rows.map((row) => {
    const bazar = row.bazarEntries.reduce(
      (sum, entry) =>
        sum +
        entry.items.reduce(
          (itemSum, item) => itemSum + item.price,
          0,
        ),
      0,
    );

    const otherExpenses = row.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const deposits = row.deposits.reduce(
      (sum, deposit) => sum + deposit.amount,
      0,
    );

    return {
      date: row.date,
      bazar,
      otherExpenses,
      totalExpense: bazar + otherExpenses,
      deposits,
    };
  });

  const totalBazar = dailyRows.reduce(
    (sum, row) => sum + row.bazar,
    0,
  );

  const totalOtherExpenses = dailyRows.reduce(
    (sum, row) => sum + row.otherExpenses,
    0,
  );

  const totalDeposits = dailyRows.reduce(
    (sum, row) => sum + row.deposits,
    0,
  );

  const totalExpenses = totalBazar + totalOtherExpenses;
  const remainingBalance = totalDeposits - totalExpenses;

  return (
    <>
      <div className="no-print mx-auto flex max-w-4xl justify-end px-6 pt-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          <Printer className="size-4" />
          Print Report
        </button>
      </div>

      <main className="mx-auto w-full max-w-4xl px-6 py-3 text-slate-900">
        {/* Company header */}
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            ADVENTURE CLOTHING &amp; SOURCING
          </h1>

          <p className="mt-2 text-sm">
            House #37, Road #13, Sector 10, Uttara, Dhaka-1230
          </p>

          <p className="mt-1 text-sm">
            Phone: 01914-222495, 01711286723
          </p>
        </header>

        {/* Report title */}
        <section className="mt-4 border-y-2 border-slate-900 py-2 text-center">
          <h2 className="text-xl font-bold">
            Expense History - {monthName}
          </h2>
        </section>

        {/* Daily summary */}
        <section className="mt-6">
          <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-[8%] border border-slate-400 px-2 py-1.5 text-center font-semibold">
                  SL
                </th>

                <th className="w-[24%] border border-slate-400 px-2 py-1.5 text-left font-semibold">
                  Date
                </th>

                <th className="w-[17%] border border-slate-400 px-2 py-1.5 text-right font-semibold">
                  Bazar
                </th>

                <th className="w-[19%] border border-slate-400 px-2 py-1.5 text-right font-semibold">
                  Other Expenses
                </th>

                <th className="w-[17%] border border-slate-400 px-2 py-1.5 text-right font-semibold">
                  Total Expense
                </th>

                <th className="w-[15%] border border-slate-400 px-2 py-1.5 text-right font-semibold">
                  Deposit
                </th>
              </tr>
            </thead>

            <tbody>
              {dailyRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-slate-400 px-3 py-8 text-center text-slate-500"
                  >
                    No transactions found for this month.
                  </td>
                </tr>
              ) : (
                dailyRows.map((row, index) => (
                  <tr key={row.date} className="break-inside-avoid">
                    <td className="border border-slate-400 px-2 py-1 text-center">
                      {index + 1}
                    </td>

                    <td className="whitespace-nowrap border border-slate-400 px-2 py-1">
                      {formatDate(row.date)}
                    </td>

                    <td className="whitespace-nowrap border border-slate-400 px-2 py-1 text-right tabular-nums">
                      {formatCurrency(row.bazar)}
                    </td>

                    <td className="whitespace-nowrap border border-slate-400 px-2 py-1 text-right tabular-nums">
                      {formatCurrency(row.otherExpenses)}
                    </td>

                    <td className="whitespace-nowrap border border-slate-400 px-2 py-1 text-right font-medium tabular-nums">
                      {formatCurrency(row.totalExpense)}
                    </td>

                    <td className="whitespace-nowrap border border-slate-400 px-2 py-1 text-right tabular-nums">
                      {formatCurrency(row.deposits)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {dailyRows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold">
                  <td
                    colSpan={2}
                    className="border border-slate-400 px-2 py-1.5"
                  >
                    Monthly Total
                  </td>

                  <td className="whitespace-nowrap border border-slate-400 px-2 py-1.5 text-right tabular-nums">
                    {formatCurrency(totalBazar)}
                  </td>

                  <td className="whitespace-nowrap border border-slate-400 px-2 py-1.5 text-right tabular-nums">
                    {formatCurrency(totalOtherExpenses)}
                  </td>

                  <td className="whitespace-nowrap border border-slate-400 px-2 py-1.5 text-right tabular-nums">
                    {formatCurrency(totalExpenses)}
                  </td>

                  <td className="whitespace-nowrap border border-slate-400 px-2 py-1.5 text-right tabular-nums">
                    {formatCurrency(totalDeposits)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </section>

        {/* Monthly financial summary */}
        <section className="mt-8 break-inside-avoid">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td className="border border-slate-400 px-4 py-1.5 font-medium">
                  Total Deposits
                </td>

                <td className="w-[35%] border border-slate-400 px-4 py-1.5 text-right tabular-nums">
                  {formatCurrency(totalDeposits)}
                </td>
              </tr>

              <tr className="bg-slate-100">
                <td className="border border-slate-400 px-4 py-1.5 font-bold">
                  Total Expenses
                </td>

                <td className="border border-slate-400 px-4 py-1.5 text-right font-bold tabular-nums">
                  {formatCurrency(totalExpenses)}
                </td>
              </tr>

              <tr className="bg-slate-50">
                <td className="border border-slate-400 px-4 py-3 font-bold">
                  Remaining Balance
                </td>

                <td className="border border-slate-400 px-4 py-3 text-right text-base font-bold tabular-nums">
                  {formatCurrency(remainingBalance)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Signatures */}
        <footer className="mt-16 flex justify-between gap-10 text-xs">
          <div className="w-48 border-t border-slate-500 pt-2 text-center">
            Prepared By
          </div>

          <div className="w-48 border-t border-slate-500 pt-2 text-center">
            Authorized Signature
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 12mm;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          main {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          thead {
            display: table-header-group;
          }

          tfoot {
            display: table-row-group;
          }

          tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }

        @media screen {
          body {
            background: #f1f5f9;
          }

          main {
            margin-bottom: 32px;
            background: white;
            box-shadow: 0 2px 12px rgb(15 23 42 / 8%);
          }
        }
      `}</style>
    </>
  );
}
