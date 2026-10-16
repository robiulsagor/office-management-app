"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { formatAmount, formatDate } from "@/components/report/report-utils";

import type {
  DayRow,
  ReportVisibility,
} from "@/components/report/report-types";

type DailyTransactionsProps = {
  rows: DayRow[];
  visibility: ReportVisibility;
  bazarTotal: number;
  otherExpensesTotal: number;
  totalExpenses: number;
  totalDeposits: number;
};

export default function DailyTransactions({
  rows,
  visibility,
  bazarTotal,
  otherExpensesTotal,
  totalExpenses,
  totalDeposits,
}: DailyTransactionsProps) {
  const { showBazar, showExpenses, showDeposits } = visibility;

  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const hasExpenseColumn = showBazar || showExpenses;

  const columnCount =
    1 +
    (showBazar ? 1 : 0) +
    (showExpenses ? 1 : 0) +
    (hasExpenseColumn ? 1 : 0) +
    (showDeposits ? 1 : 0);

  const toggleDate = (date: string) => {
    setExpandedDates((previous) => {
      const next = new Set(previous);

      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }

      return next;
    });
  };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Daily Transactions</h2>

        <p className="text-sm text-muted-foreground">
          Click any date row to view that day&apos;s transaction history.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-162.5 border-collapse text-sm">
          <thead className="bg-muted/60">
            <tr className="border-b text-left">
              <th className="px-4 py-3 font-semibold">Date</th>

              {showBazar && (
                <th className="px-4 py-3 text-right font-semibold">Bazar</th>
              )}

              {showExpenses && (
                <th className="px-4 py-3 text-right font-semibold">
                  Other Expenses
                </th>
              )}

              {hasExpenseColumn && (
                <th className="px-4 py-3 text-right font-semibold">
                  Total Expense
                </th>
              )}

              {showDeposits && (
                <th className="px-4 py-3 text-right font-semibold">Deposit</th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No records found for the selected month and filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const expanded = expandedDates.has(row.date);

                const dayBazar = row.bazarEntries.reduce(
                  (sum, entry) =>
                    sum +
                    entry.items.reduce(
                      (itemSum, item) => itemSum + item.price,
                      0,
                    ),
                  0,
                );

                const dayExpenses = row.expenses.reduce(
                  (sum, expense) => sum + expense.amount,
                  0,
                );

                const dayDeposits = row.deposits.reduce(
                  (sum, deposit) => sum + deposit.amount,
                  0,
                );

                return (
                  <React.Fragment key={row.date}>
                    <tr
                      key={row.date}
                      tabIndex={0}
                      role="button"
                      aria-expanded={expanded}
                      onClick={() => toggleDate(row.date)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleDate(row.date);
                        }
                      }}
                      className="cursor-pointer border-b transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-medium">
                        <span className="inline-flex items-center gap-2">
                          {expanded ? (
                            <ChevronDown className="size-4 shrink-0" />
                          ) : (
                            <ChevronRight className="size-4 shrink-0" />
                          )}

                          {formatDate(row.date)}
                        </span>
                      </td>

                      {showBazar && (
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {formatAmount(dayBazar)}
                        </td>
                      )}

                      {showExpenses && (
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {formatAmount(dayExpenses)}
                        </td>
                      )}

                      {hasExpenseColumn && (
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                          {formatAmount(
                            (showBazar ? dayBazar : 0) +
                              (showExpenses ? dayExpenses : 0),
                          )}
                        </td>
                      )}

                      {showDeposits && (
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {formatAmount(dayDeposits)}
                        </td>
                      )}
                    </tr>

                    {expanded && (
                      <tr
                        key={`${row.date}-details`}
                        className="border-b bg-muted/20"
                      >
                        <td colSpan={columnCount} className="p-4 sm:p-5">
                          <div className="space-y-5">
                            {showBazar && (
                              <div className="space-y-3">
                                <h3 className="font-semibold">Bazar History</h3>

                                {row.bazarEntries.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    No bazar records on this date.
                                  </p>
                                ) : (
                                  row.bazarEntries.map((entry) => (
                                    <div
                                      key={entry.id}
                                      className="rounded-lg border bg-background p-3"
                                    >
                                      <div className="mb-3 flex flex-wrap justify-between gap-2">
                                        <p className="text-sm font-medium">
                                          {entry.type === "GUEST"
                                            ? "Guest Bazar"
                                            : "Regular Bazar"}
                                        </p>

                                        {entry.remarks && (
                                          <p className="text-xs text-muted-foreground">
                                            {entry.remarks}
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        {entry.items.map((item) => (
                                          <div
                                            key={item.id}
                                            className="flex justify-between gap-3 text-sm"
                                          >
                                            <span>
                                              {item.bazarItem.nameEn ||
                                                item.bazarItem.nameBn}

                                              {item.quantity != null &&
                                                ` · ${item.quantity} ${
                                                  item.unit ?? ""
                                                }`}
                                            </span>

                                            <span className="whitespace-nowrap font-medium">
                                              {formatAmount(item.price)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="mt-3 flex justify-between border-t pt-3 text-sm font-semibold">
                                        <span>Bazar Subtotal</span>

                                        <span>
                                          {formatAmount(
                                            entry.items.reduce(
                                              (sum, item) => sum + item.price,
                                              0,
                                            ),
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}

                            {showExpenses && (
                              <div className="space-y-3">
                                <h3 className="font-semibold">
                                  Other Expenses History
                                </h3>

                                {row.expenses.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    No other expenses on this date.
                                  </p>
                                ) : (
                                  <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full text-sm">
                                      <thead className="bg-background">
                                        <tr className="border-b text-left">
                                          <th className="px-3 py-2">
                                            Category
                                          </th>
                                          <th className="px-3 py-2">
                                            Description
                                          </th>
                                          <th className="px-3 py-2 text-right">
                                            Amount
                                          </th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {row.expenses.map((expense) => (
                                          <tr
                                            key={expense.id}
                                            className="border-b last:border-0"
                                          >
                                            <td className="px-3 py-2">
                                              {expense.category.name}
                                            </td>

                                            <td className="px-3 py-2">
                                              {expense.description || "—"}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2 text-right">
                                              {formatAmount(expense.amount)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}

                            {showDeposits && (
                              <div className="space-y-3">
                                <h3 className="font-semibold">
                                  Deposit History
                                </h3>

                                {row.deposits.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    No deposits on this date.
                                  </p>
                                ) : (
                                  <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full text-sm">
                                      <thead className="bg-background">
                                        <tr className="border-b text-left">
                                          <th className="px-3 py-2">
                                            Employee
                                          </th>
                                          <th className="px-3 py-2">Purpose</th>
                                          <th className="px-3 py-2">Remarks</th>
                                          <th className="px-3 py-2 text-right">
                                            Amount
                                          </th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {row.deposits.map((deposit) => (
                                          <tr
                                            key={deposit.id}
                                            className="border-b last:border-0"
                                          >
                                            <td className="px-3 py-2">
                                              {deposit.employee.name}
                                            </td>

                                            <td className="px-3 py-2">
                                              {deposit.purpose ?? "—"}
                                            </td>

                                            <td className="px-3 py-2">
                                              {deposit.remarks || "—"}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2 text-right">
                                              {formatAmount(deposit.amount)}    
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {rows.length > 0 && (
            <tfoot className="bg-muted/60">
              <tr className="border-t-2 font-semibold">
                <td className="px-4 py-3">Monthly Total</td>

                {showBazar && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {formatAmount(bazarTotal)}
                  </td>
                )}

                {showExpenses && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {formatAmount(otherExpensesTotal)}
                  </td>
                )}

                {hasExpenseColumn && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {formatAmount(totalExpenses)}
                  </td>
                )}

                {showDeposits && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {formatAmount(totalDeposits)}
                  </td>
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}
