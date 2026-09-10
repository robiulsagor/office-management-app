"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: "All password fields are required.",
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      message: "New password must be at least 6 characters.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "New passwords do not match.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const currentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!currentPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect.",
      };
    }

    const newPasswordHash = await bcrypt.hash(
      newPassword,
      12,
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Password changed successfully.",
    };
  } catch (error) {
    console.error("Change password error:", error);

    return {
      success: false,
      message: "Failed to change password.",
    };
  }
}