"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

export async function deleteConveyance(id: string) {
  try {
    const authResult = await requireActiveUser();

    if (!authResult.ok) {
      return {
        success: false,
        message: authResult.message,
      };
    }

    if (!id) {
      return {
        success: false,
        message: "Conveyance record ID is required.",
      };
    }

    const existingRecord =
      await prisma.conveyanceRecord.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          createdById: true,
        },
      });

    if (!existingRecord) {
      return {
        success: false,
        message: "Conveyance record not found.",
      };
    }

    const isSuperAdmin =
      authResult.user.role === "SUPER_ADMIN";

    const isOwner =
      existingRecord.createdById === authResult.user.id;

    if (!isSuperAdmin && !isOwner) {
      return {
        success: false,
        message:
          "You are not allowed to delete this conveyance.",
      };
    }

    await prisma.conveyanceRecord.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Conveyance deleted successfully.",
    };
  } catch (error) {
    console.error("Delete conveyance error:", error);

    return {
      success: false,
      message: "Failed to delete conveyance.",
    };
  }
}