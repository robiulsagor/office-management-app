"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const START_DATE = new Date("2026-10-01T00:00:00+06:00");

export async function getFinancialSummary() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { accountStatus: true },
    });

    if (!user || user.accountStatus !== "ACTIVE") {
      return {
        success: false,
        message: "Your account is not active.",
      };
    }

    const [deposits, bazarItems, expenses] = await Promise.all([
      prisma.deposit.aggregate({
        where: {
          date: { gte: START_DATE },
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.bazarEntryItem.aggregate({
        where: {
          bazarEntry: {
            is: {
              date: { gte: START_DATE },
            },
          },
        },
        _sum: {
          price: true,
        },
      }),

      prisma.expense.aggregate({
        where: {
          date: { gte: START_DATE },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalDeposits = Number(deposits._sum.amount ?? 0);
    const bazarSpending = Number(bazarItems._sum.price ?? 0);
    const otherExpenses = Number(expenses._sum.amount ?? 0);

    return {
      success: true,
      summary: {
        totalDeposits,
        bazarSpending,
        otherExpenses,
        remainingBalance: totalDeposits - bazarSpending - otherExpenses,
      },
    };
  } catch (error) {
    console.error("Financial summary error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown financial summary error.",
    };
  }
}
