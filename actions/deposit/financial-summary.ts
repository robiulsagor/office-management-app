"use server";

import { prisma } from "@/lib/prisma";

// Keep your existing authentication/session checks in this action.

const START_DATE = new Date("2026-10-01T00:00:00+06:00");

type FinancialSummaryData = {
  totalDeposits: number;
  bazarSpending: number;
  otherExpenses: number;
  remainingBalance: number;
};

function getMonthRange(month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error("Invalid month format.");
  }

  const [year, monthNumber] = month.split("-").map(Number);

  const start = new Date(`${month}-01T00:00:00+06:00`);

  const nextYear = monthNumber === 12 ? year + 1 : year;
  const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;

  const end = new Date(
    `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00+06:00`,
  );

  return { start, end };
}

export async function getFinancialSummary(month: string) {
  try {
    // Keep your existing session validation here before querying financial data.

    const { start, end } = getMonthRange(month);

    // Don't include data from before the new system's start date.
    const effectiveStart =
      start < START_DATE ? START_DATE : start;

    const emptySummary: FinancialSummaryData = {
      totalDeposits: 0,
      bazarSpending: 0,
      otherExpenses: 0,
      remainingBalance: 0,
    };

    if (effectiveStart >= end) {
      return { success: true as const, summary: emptySummary };
    }

    const dateFilter = {
      gte: effectiveStart,
      lt: end,
    };

    const [depositResult, bazarResult, expenseResult] =
      await Promise.all([
        prisma.deposit.aggregate({
          where: { date: dateFilter },
          _sum: { amount: true },
        }),

        prisma.bazarEntryItem.aggregate({
          where: {
            bazarEntry: {
              is: { date: dateFilter },
            },
          },
          _sum: { price: true },
        }),

        prisma.expense.aggregate({
          where: { date: dateFilter },
          _sum: { amount: true },
        }),
      ]);

    const totalDeposits = Number(
      depositResult._sum.amount ?? 0,
    );

    const bazarSpending = Number(
      bazarResult._sum.price ?? 0,
    );

    const otherExpenses = Number(
      expenseResult._sum.amount ?? 0,
    );

    return {
      success: true as const,
      summary: {
        totalDeposits,
        bazarSpending,
        otherExpenses,
        remainingBalance:
          totalDeposits - bazarSpending - otherExpenses,
      },
    };
  } catch (error) {
    console.error("Failed to load financial summary:", error);

    return {
      success: false as const,
      message: "Failed to load financial summary.",
    };
  }
}