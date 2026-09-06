"use server";

import { prisma } from "@/lib/prisma";

type CreateBazarItemData = {
  nameEn: string;
  nameBn?: string;
};

export async function createBazarItem(data: CreateBazarItemData) {
  try {
    const nameEn = data.nameEn.trim();
    const nameBn = data.nameBn?.trim() || "";

    if (!nameEn) {
      return {
        success: false,
        message: "Item name is required.",
      };
    }

    const existingItem = await prisma.bazarItem.findUnique({
      where: {
        nameEn,
      },
    });

    if (existingItem) {
      return {
        success: false,
        message: "This item already exists.",
      };
    }

    const item = await prisma.bazarItem.create({
      data: {
        nameEn,
        nameBn,
      },
      select: {
        id: true,
        nameEn: true,
        nameBn: true,
      },
    });

    return {
      success: true,
      message: "Bazar item added successfully.",
      data: item,
    };
  } catch (error) {
    console.error("Create bazar item error:", error);

    return {
      success: false,
      message: "Something went wrong while adding the bazar item.",
    };
  }
}