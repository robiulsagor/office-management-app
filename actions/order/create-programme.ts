"use server";

import { prisma } from "@/lib/prisma";

export async function createProgramme(
  buyerId: string,
  name: string
) {
  const cleanName = name.trim();

  if (!buyerId) {
    return {
      success: false,
      message: "Buyer is required.",
    };
  }

  if (!cleanName) {
    return {
      success: false,
      message: "Programme name is required.",
    };
  }

  try {
    const existingProgramme = await prisma.programme.findFirst({
      where: {
        buyerId,
        name: cleanName,
      },
    });

    if (existingProgramme) {
      return {
        success: false,
        message: "This programme already exists for this buyer.",
        programme: existingProgramme,
      };
    }

    const programme = await prisma.programme.create({
      data: {
        buyerId,
        name: cleanName,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      programme,
    };
  } catch (error) {
    console.error("Create programme error:", error);

    return {
      success: false,
      message: "Failed to create programme.",
    };
  }
}