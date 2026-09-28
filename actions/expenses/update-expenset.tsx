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
      return {
        success: false,
        message: authResult.message,
      };
    }

    if (!data.id) {
      return {
        success: false,
        message: "Expense ID is required.",
      };
    }

    if (!data.date) {
      return {
        success: false,
        message: "Expense date is required.",
      };
    }

    if (!data.categoryId) {
      return {
        success: false,
        message: "Expense category is required.",
      };
    }

    if (data.amount < 0) {
      return {
        success: false,
        message: "Expense amount cannot be negative.",
      };
    }

    const category = await prisma.expenseCategory.findFirst({
      where: {
        id: data.categoryId,
        isActive: true,
      },
    });

    if (!category) {
      return {
        success: false,
        message: "Invalid or inactive expense category.",
      };
    }

    const expense = await prisma.expense.findUnique({
      where: {
        id: data.id,
      },
      select: {
        id: true,
      },
    });

    if (!expense) {
      return {
        success: false,
        message: "Expense not found.",
      };
    }

    await prisma.expense.update({
      where: {
        id: data.id,
      },
      data: {
        date: new Date(`${data.date}T12:00:00`),
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description?.trim() || null,
      },
    });

    return {
      success: true,
      message: "Expense updated successfully.",
    };
  } catch (error) {
    console.error("Update expense error:", error);

    return {
      success: false,
      message: "Something went wrong while updating the expense.",
    };
  }
}