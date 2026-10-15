
"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

type UpdateExpenseData = {
  id: string;
  date: string;
  categoryId: string;
  amount: number;
  description?: string;
};

export async function updateExpense(data: UpdateExpenseData) {
  try {
    const authResult = await requireActiveUser();

    if (!authResult.ok) {
      return { success: false, message: authResult.message };
    }

    if (!data.id || !data.date || !data.categoryId) {
      return {
        success: false,
        message: "Expense ID, date and category are required.",
      };
    }

    if (!Number.isFinite(data.amount) || data.amount < 0) {
      return { success: false, message: "Enter a valid expense amount." };
    }

    const date = new Date(`${data.date}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
      return { success: false, message: "Invalid expense date." };
    }

    const category = await prisma.expenseCategory.findFirst({
      where: { id: data.categoryId, isActive: true },
      select: { id: true },
    });

    if (!category) {
      return {
        success: false,
        message: "Invalid or inactive expense category.",
      };
    }

    const expense = await prisma.expense.findUnique({
      where: { id: data.id },
      select: {
        id: true,
        createdById: true,
        expenseEntryId: true,
      },
    });

    if (!expense) {
      return { success: false, message: "Expense not found." };
    }

    if (
      authResult.user.role !== "SUPER_ADMIN" &&
      expense.createdById !== authResult.user.id
    ) {
      return {
        success: false,
        message: "You are not allowed to modify this expense.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
      );

      const currentEntry = await tx.expenseEntry.findUnique({
        where: { id: expense.expenseEntryId },
        select: { date: true },
      });

      const sameDate =
        currentEntry &&
        currentEntry.date.getFullYear() === date.getFullYear() &&
        currentEntry.date.getMonth() === date.getMonth() &&
        currentEntry.date.getDate() === date.getDate();

      let entryId = expense.expenseEntryId;

      if (!sameDate) {
        let entry = await tx.expenseEntry.findFirst({
          where: { date: { gte: startDate, lt: endDate } },
          select: { id: true },
        });

        if (!entry) {
          entry = await tx.expenseEntry.create({
            data: { date },
            select: { id: true },
          });
        }

        entryId = entry.id;
      }

      await tx.expense.update({
        where: { id: data.id },
        data: {
          expenseEntryId: entryId,
          categoryId: data.categoryId,
          amount: data.amount,
          description: data.description?.trim() || null,
        },
      });
    });

    return { success: true, message: "Expense updated successfully." };
  } catch (error) {
    console.error("Update expense error:", error);

    return {
      success: false,
      message: "Something went wrong while updating the expense.",
    };
  }
}
