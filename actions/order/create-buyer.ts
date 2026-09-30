"use server";

import { prisma } from "@/lib/prisma";

export async function createBuyer(name: string) {
  const cleanName = name.trim();

  if (!cleanName) {
    return {
      success: false,
      message: "Buyer name is required.",
    };
  }

  try {
    const existingBuyer = await prisma.buyer.findUnique({
      where: {
        name: cleanName,
      },
    });

    if (existingBuyer) {
      return {
        success: false,
        message: "This buyer already exists.",
        buyer: existingBuyer,
      };
    }

    const buyer = await prisma.buyer.create({
      data: {
        name: cleanName,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      buyer,
    };
  } catch (error) {
    console.error("Create buyer error:", error);

    return {
      success: false,
      message: "Failed to create buyer.",
    };
  }
}