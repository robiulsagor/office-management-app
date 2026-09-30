"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderBuyers() {
  try {
    const buyers = await prisma.buyer.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      buyers,
    };
  } catch (error) {
    console.error("Get order buyers error:", error);

    return {
      success: false,
      buyers: [],
      message: "Failed to load buyers.",
    };
  }
}