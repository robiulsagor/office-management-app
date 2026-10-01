"use server";

import { prisma } from "@/lib/prisma";

export async function createColor(name: string) {
  const cleanName = name.trim();

  if (!cleanName) {
    return {
      success: false,
      message: "Color name is required.",
    };
  }

  try {
    const existingColor = await prisma.color.findUnique({
      where: {
        name: cleanName,
      },
    });

    if (existingColor) {
      return {
        success: false,
        message: "This color already exists.",
        color: existingColor,
      };
    }

    const color = await prisma.color.create({
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
      color,
    };
  } catch (error) {
    console.error("Create color error:", error);

    return {
      success: false,
      message: "Failed to create color.",
    };
  }
}