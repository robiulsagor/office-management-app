"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderProgrammes(buyerId: string) {
  if (!buyerId) {
    return {
      success: false,
      programmes: [],
      message: "Buyer is required.",
    };
  }

  try {
    const programmes = await prisma.programme.findMany({
      where: {
        buyerId,
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
      programmes,
    };
  } catch (error) {
    console.error("Get order programmes error:", error);

    return {
      success: false,
      programmes: [],
      message: "Failed to load programmes.",
    };
  }
}