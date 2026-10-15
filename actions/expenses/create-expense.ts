
"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

type CreateExpenseItem = {
  categoryId: string;
  amount: number;
  description?: string;
};

type CreateExpenseData = {
  date: string;
  items: CreateExpenseItem[];
};

export async function createExpense(data: CreateExpenseData) {
  try {
    const authResult = await requireActiveUser();

    if (!authResult.ok) {
      return { success: false, message: authResult.message };
    }

    if (!data.date) {
      return { success: false, message: "Expense date is required." };
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return { success: false, message: "Add at least one expense item." };
    }

    const date = new Date(`${data.date}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
      return { success: false, message: "Invalid expense date." };
    }

    for (const item of data.items) {
      if (!item.categoryId) {
        return { success: false, message: "Select a category for every item." };
      }

      if (!Number.isFinite(item.amount) || item.amount < 0) {
        return { success: false, message: "Enter a valid amount for every item." };
      }
    }

    const categoryIds = [...new Set(data.items.map((item) => item.categoryId))];

    const activeCategories = await prisma.expenseCategory.findMany({
      where: {
        id: { in: categoryIds },
        isActive: true,
      },
      select: { id: true },
    });

    if (activeCategories.length !== categoryIds.length) {
      return {
        success: false,
        message: "One or more categories are invalid or inactive.",
      };
    }

    const result = await prisma.$transaction(async (tx) => {
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

      let entry = await tx.expenseEntry.findFirst({
        where: {
          date: { gte: startDate, lt: endDate },
        },
        select: { id: true },
      });

      if (!entry) {
        entry = await tx.expenseEntry.create({
          data: { date },
          select: { id: true },
        });
      }

      await tx.expense.createMany({
        data: data.items.map((item) => ({
          expenseEntryId: entry.id,
          categoryId: item.categoryId,
          amount: item.amount,
          description: item.description?.trim() || null,
          createdById: authResult.user.id,
        })),
      });

      return { entryId: entry.id };
    });

    return {
      success: true,
      message: `${data.items.length} expense item(s) saved successfully.`,
      entryId: result.entryId,
    };
  } catch (error) {
    console.error("Create expense error:", error);

    return {
      success: false,
      message: "Something went wrong while creating the expenses.",
    };
  }
}
