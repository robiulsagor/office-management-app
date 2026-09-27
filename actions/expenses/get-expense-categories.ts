"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

export type ExpenseCategoryData = {
  id: string;
  name: string;
};

export async function getExpenseCategories(): Promise<{
  success: boolean;
  message?: string;
  data: ExpenseCategoryData[];
}> {
  try {
    const authResult = await requireActiveUser();

    if (!authResult.ok) {
      return {
        success: false,
        message: authResult.message,
        data: [],
      };
    }

    const categories = await prisma.expenseCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Get expense categories error:", error);

    return {
      success: false,
      message: "Failed to load expense categories.",
      data: [],
    };
  }
}