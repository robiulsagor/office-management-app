"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type UpdateBazarItem = {
  bazarItemId: string;
  quantity?: number;
  unit?: "KG" | "GRAM" | "LITER" | "ML" | "PCS";
  price: number;
};

type UpdateBazarData = {
  id: string;
  date: string;
  deposit: number;
  items: UpdateBazarItem[];
};

export async function updateBazar(data: UpdateBazarData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    if (!data.id) {
      return {
        success: false,
        message: "Bazar entry ID is required.",
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

    const entry = await prisma.bazarEntry.findUnique({
      where: {
        id: data.id,
      },
      select: {
        createdById: true,
      },
    });

    if (!entry) {
      return {
        success: false,
        message: "Bazar entry not found.",
      };
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    if (!currentUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const isOwner = entry.createdById === session.user.id;

    const isAdmin =
      currentUser.role === "ADMIN" ||
      currentUser.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        message: "You can only edit your own bazar entries.",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.bazarEntryItem.deleteMany({
        where: {
          bazarEntryId: data.id,
        },
      });

      await tx.bazarEntry.update({
        where: {
          id: data.id,
        },
        data: {
          date: new Date(`${data.date}T12:00:00`),
          deposit: data.deposit,
          items: {
            create: data.items.map((item) => ({
              bazarItemId: item.bazarItemId,
              quantity: item.quantity,
              unit: item.unit,
              price: item.price,
            })),
          },
        },
      });
    });

    return {
      success: true,
      message: "Bazar entry updated successfully.",
    };
  } catch (error) {
    console.error("Update bazar error:", error);

    return {
      success: false,
      message: "Failed to update bazar entry.",
    };
  }
}