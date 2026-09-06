"use server";

import { prisma } from "@/lib/prisma";

export async function getBazarMasterItems() {
  try {
    const items = await prisma.bazarItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        nameEn: "asc",
      },
      select: {
        id: true,
        nameEn: true,
        nameBn: true,
      },
    });

    return {
      success: true,
      data: items,
    };
  } catch (error) {
    console.error("Get bazar items error:", error);

    return {
      success: false,
      message: "Failed to load bazar items.",
      data: [],
    };
  }
}