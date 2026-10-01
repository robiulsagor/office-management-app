"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderFactories() {
  try {
    const factories = await prisma.factory.findMany({
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
      factories,
    };
  } catch (error) {
    console.error("Get order factories error:", error);

    return {
      success: false,
      factories: [],
      message: "Failed to load factories.",
    };
  }
}