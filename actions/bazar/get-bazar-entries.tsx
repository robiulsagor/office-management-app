"use server";

import { prisma } from "@/lib/prisma";
import { BazarEntry } from "@/types/bazar";

export async function getBazarEntries(
  month: string,
): Promise<{
  success: boolean;
  message?: string;
  data: BazarEntry[];
}> {
  try {
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

    const entries = await prisma.bazarEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        items: {
          include: {
            bazarItem: {
              select: {
                id: true,
                nameEn: true,
                nameBn: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: entries.map((entry) => ({
        id: entry.id,
        date: entry.date.toISOString().split("T")[0],
        deposit: Number(entry.deposit),
        createdById: entry.createdById,

        items: entry.items.map((item) => ({
          id: item.id,
          bazarItemId: item.bazarItemId,
          name: item.bazarItem.nameEn,
          quantity:
            item.quantity !== null
              ? Number(item.quantity)
              : undefined,
          unit: item.unit ?? undefined,
          price: Number(item.price),
        })),
      })),
    };
  } catch (error) {
    console.error("Get bazar entries error:", error);

    return {
      success: false,
      message: "Failed to load bazar entries.",
      data: [],
    };
  }
}