"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

export async function deleteExpense(id: string) {
  try {
    const authResult = await requireActiveUser();

    if (!authResult.ok) {
      return {
        success: false,
        message: authResult.message,
      };
    }

    if (!id) {
      return {
        success: false,
        message: "Expense ID is required.",
      };
    }

    const expense = await prisma.expense.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdById: true,
      },
    });

    if (!expense) {
      return {
        success: false,
        message: "Expense not found.",
      };
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

    await prisma.expense.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Expense deleted successfully.",
    };
  } catch (error) {
    console.error("Delete expense error:", error);

    return {
      success: false,
      message: "Something went wrong while deleting the expense.",
    };
  }
}
