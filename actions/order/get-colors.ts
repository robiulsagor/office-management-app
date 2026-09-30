"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderColors() {
  try {
    const colors = await prisma.color.findMany({
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
      colors,
    };
  } catch (error) {
    console.error("Get order colors error:", error);

    return {
      success: false,
      colors: [],
      message: "Failed to load colors.",
    };
  }
}