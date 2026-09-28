"use server";

import { performance } from "node:perf_hooks";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

export type ExpenseData = {
  id: string;
  date: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  description?: string;
  createdById: string;
};

export async function getExpenses(month: string): Promise<{
  success: boolean;
  message?: string;
  data: ExpenseData[];
}> {
  try {
    console.time("getExpenses");
    const totalStart = performance.now();

    const authStart = performance.now();

    const authResult = await requireActiveUser();

    console.log(
      `[getExpenses] auth: ${(performance.now() - authStart).toFixed(0)}ms`,
    );

    if (!authResult.ok) {
      return {
        success: false,
        message: authResult.message,
        data: [],
      };
    }

    const [year, monthNumber] = month.split("-").map(Number);

    if (!year || !monthNumber) {
      return {
        success: false,
        message: "Invalid month.",
        data: [],
      };
    }

    const startDate = new Date(year, monthNumber - 1, 1, 0, 0, 0);
    const endDate = new Date(year, monthNumber, 1, 0, 0, 0);

    const queryStart = performance.now();

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(
      `[getExpenses] query: ${(performance.now() - queryStart).toFixed(0)}ms`,
    );

    console.timeEnd("getExpenses");

    console.log(
      `[getExpenses] total: ${(performance.now() - totalStart).toFixed(0)}ms`,
    );
    return {
      success: true,
      data: expenses.map((expense) => ({
        id: expense.id,
        date: expense.date.toISOString().split("T")[0],
        categoryId: expense.categoryId,
        categoryName: expense.category.name,
        amount: Number(expense.amount),
        description: expense.description ?? undefined,
        createdById: expense.createdById,
      })),
    };
  } catch (error) {
    console.error("Get expenses error:", error);

    return {
      success: false,
      message: "Failed to load expenses.",
      data: [],
    };
  }
}
