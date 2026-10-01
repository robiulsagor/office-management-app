"use server";

import { prisma } from "@/lib/prisma";

export async function createFactory(name: string) {
  const cleanName = name.trim();

  if (!cleanName) {
    return {
      success: false,
      message: "Factory name is required.",
    };
  }

  try {
    const existingFactory = await prisma.factory.findUnique({
      where: {
        name: cleanName,
      },
    });

    if (existingFactory) {
      return {
        success: false,
        message: "This factory already exists.",
        factory: existingFactory,
      };
    }

    const factory = await prisma.factory.create({
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
      factory,
    };
  } catch (error) {
    console.error("Create factory error:", error);

    return {
      success: false,
      message: "Failed to create factory.",
    };
  }
}