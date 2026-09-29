"use server";

import { prisma } from "@/lib/prisma";
import { getBazarEntries } from "../bazar/get-bazar-entries";

export async function getDashboardData() {
  const now = new Date();

  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}`;

  const bazarResult = await getBazarEntries(month);

  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [totalEmployees, activeEmployees, monthlyExpense, recentExpenses] =
    await Promise.all([
      prisma.employee.count(),

      prisma.employee.count({
        where: {
          employmentStatus: "ACTIVE",
        },
      }),

      prisma.expense.aggregate({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.expense.findMany({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

  const bazarEntries = bazarResult.success ? bazarResult.data : [];

  const monthlyBazar = bazarEntries.reduce((total, entry) => {
    const itemTotal = entry.items.reduce((sum, item) => sum + item.price, 0);

    return total + itemTotal;
  }, 0);

  return {
    summary: {
      totalEmployees,
      activeEmployees,
      monthlyExpense: Number(monthlyExpense._sum.amount ?? 0),
      monthlyBazar,
    },

    recentExpenses: recentExpenses.map((expense) => ({
      id: expense.id,
      date: expense.date,
      categoryName: expense.category.name,
      amount: Number(expense.amount),
      description: expense.description,
    })),

    recentBazar: bazarEntries.slice(0, 5).map((entry) => ({
      id: entry.id,
      date: entry.date,
      items: entry.items.map((item) => ({
        name: item.name,
        nameEn: item.nameEn,
        nameBn: item.nameBn,
        quantity: item.quantity,
        price: item.price,
      })),
    })),
  };
}
