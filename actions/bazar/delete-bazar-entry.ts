"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteBazarEntry(id: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    if (!id) {
      return {
        success: false,
        message: "Bazar entry ID is required.",
      };
    }

    // Find the entry and its creator
    const entry = await prisma.bazarEntry.findUnique({
      where: {
        id,
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

    // Check ownership / admin permission
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
        message: "You can only delete your own bazar entries.",
      };
    }

    await prisma.bazarEntry.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Bazar entry deleted successfully.",
    };
  } catch (error) {
    console.error("Delete bazar entry error:", error);

    return {
      success: false,
      message: "Failed to delete bazar entry.",
    };
  }
}