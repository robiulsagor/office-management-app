"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getReportData(month: string) {
  try {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return {
        success: false as const,
        message: "Invalid report month.",
      };
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false as const,
        message: "Please log in to view this report.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountStatus: true },
    });

    if (!user || user.accountStatus !== "ACTIVE") {
      return {
        success: false as const,
        message: "Your account is not active.",
      };
    }

    const [year, monthNumber] = month.split("-").map(Number);

    const nextMonth =
      monthNumber === 12
        ? `${year + 1}-01`
        : `${year}-${String(monthNumber + 1).padStart(2, "0")}`;

    // Bangladesh local month boundaries (UTC+06:00)
    const startDate = new Date(`${month}-01T00:00:00+06:00`);
    const endDate = new Date(`${nextMonth}-01T00:00:00+06:00`);

    const [bazarEntries, expenses, deposits] = await Promise.all([
      prisma.bazarEntry.findMany({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          type: true,
          remarks: true,
          items: {
            select: {
              id: true,
              price: true,
              quantity: true,
              unit: true,
              bazarItem: {
                select: {
                  nameEn: true,
                  nameBn: true,
                },
              },
            },
          },
        },
      }),

      prisma.expense.findMany({
        where: {
          expenseEntry: {
            date: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
        orderBy: {
          expenseEntry: {
            date: "desc",
          },
        },
        select: {
          id: true,
          amount: true,
          description: true,
          category: {
            select: { name: true },
          },
          expenseEntry: {
            select: { date: true },
          },
        },
      }),

      prisma.deposit.findMany({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          amount: true,
          purpose: true,
          remarks: true,
          employee: {
            select: { name: true },
          },
        },
      }),
    ]);

    return {
      success: true as const,
      data: {
        bazarEntries: bazarEntries.map((entry) => ({
          ...entry,
          date: entry.date.toISOString(),
          items: entry.items.map((item) => ({
            ...item,
            price: Number(item.price),
            quantity:
              item.quantity == null ? null : Number(item.quantity),
          })),
        })),

        expenses: expenses.map((expense) => ({
          ...expense,
          amount: Number(expense.amount),
          date: expense.expenseEntry.date.toISOString(),
        })),

        deposits: deposits.map((deposit) => ({
          ...deposit,
          date: deposit.date.toISOString(),
          amount: Number(deposit.amount),
        })),
      },
    };
  } catch (error) {
    console.error("getReportData error:", error);

    return {
      success: false as const,
      message: "Failed to generate the report.",
    };
  }
}
