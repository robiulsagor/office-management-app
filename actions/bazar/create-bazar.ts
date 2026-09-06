"use server";

// this file create a new bazar entry in the database

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CreateBazarItem = {
  bazarItemId: string;
  quantity?: number;
  unit?: "KG" | "GRAM" | "LITER" | "ML" | "PCS";
  price: number;
};

type CreateBazarData = {
  date: string;
  deposit: number;
  items: CreateBazarItem[];
};

export async function createBazar(data: CreateBazarData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to create a bazar entry.",
      };
    }

    if (!data.date) {
      return {
        success: false,
        message: "Bazar date is required.",
      };
    }

    if (!data.items.length) {
      return {
        success: false,
        message: "At least one bazar item is required.",
      };
    }

    await prisma.bazarEntry.create({
      data: {
        date: new Date(`${data.date}T12:00:00`),
        deposit: data.deposit,

        createdBy: {
          connect: {
            id: session.user.id,
          },
        },

        items: {
          create: data.items.map((item) => ({
            bazarItemId: item.bazarItemId,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    return {
      success: true,
      message: "Bazar entry created successfully.",
    };
  } catch (error) {
    console.error("Create bazar error:", error);

    return {
      success: false,
      message: "Something went wrong while creating the bazar entry.",
    };
  }
}