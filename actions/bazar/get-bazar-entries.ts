"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";
import { BazarEntry } from "@/types/bazar";

export async function getBazarEntries(month: string): Promise<{
  success: boolean;
  message?: string;
  data: BazarEntry[];
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

    console.log(
      "BAZAR DB ENTRIES:",
      entries.map((entry) => ({
        id: entry.id,
        type: entry.type,
      })),
    );

    return {
      success: true,
      data: entries.map((entry) => ({
        id: entry.id,
        date: entry.date.toISOString().split("T")[0],
        type: entry.type,
        deposit: Number(entry.deposit),
        remarks: entry.remarks ?? undefined,
        createdById: entry.createdById,

        items: entry.items.map((item) => ({
          id: item.id,
          bazarItemId: item.bazarItemId,
          name: item.bazarItem.nameEn,
          nameEn: item.bazarItem.nameEn,
          nameBn: item.bazarItem.nameBn,
          quantity: item.quantity !== null ? Number(item.quantity) : undefined,
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
