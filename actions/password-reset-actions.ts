"use server";

import { createHash, randomBytes } from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const RESET_TOKEN_EXPIRY_MINUTES = 30;

const hashToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

const generateResetToken = () => {
  return randomBytes(32).toString("hex");
};

export async function getPasswordResetStatus(userId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
      hasPendingRequest: false,
      hasActiveToken: false,
    };
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "Only Super Admin can view reset requests.",
      hasPendingRequest: false,
      hasActiveToken: false,
    };
  }

  try {
    const now = new Date();

    const [pendingRequest, activeToken] = await Promise.all([
      prisma.passwordResetRequest.findFirst({
        where: {
          userId,
          status: "PENDING",
        },
        orderBy: {
          requestedAt: "desc",
        },
      }),

      prisma.passwordResetToken.findFirst({
        where: {
          userId,
          usedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return {
      success: true,
      hasPendingRequest: !!pendingRequest,
      requestedAt: pendingRequest?.requestedAt.toISOString() ?? null,

      hasActiveToken: !!activeToken,
      tokenExpiresAt: activeToken?.expiresAt.toISOString() ?? null,
    };
  } catch (error) {
    console.error("Get password reset status error:", error);

    return {
      success: false,
      message: "Failed to check password reset status.",
      hasPendingRequest: false,
      hasActiveToken: false,
    };
  }
}

export async function generatePasswordResetLink(
  userId: string,
  directReset = false,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "Only Super Admin can reset passwords.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const pendingRequest = await prisma.passwordResetRequest.findFirst({
      where: {
        userId,
        status: "PENDING",
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    // If the user did not request a reset,
    // Super Admin must explicitly confirm direct reset.
    if (!pendingRequest && !directReset) {
      return {
        success: false,
        requiresConfirmation: true,
        message:
          "Password reset was not requested. This user has not requested a password reset.",
      };
    }

    const rawToken = generateResetToken();
    const tokenHash = hashToken(rawToken);

    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000,
    );

    await prisma.$transaction(async (tx) => {
      // Invalidate all previous unused reset tokens.
      await tx.passwordResetToken.deleteMany({
        where: {
          userId,
          usedAt: null,
        },
      });

      // Create the new one-time reset token.
      await tx.passwordResetToken.create({
        data: {
          userId,
          tokenHash,
          expiresAt,
        },
      });

      // Update the user's reset request if one exists.
      if (pendingRequest) {
        await tx.passwordResetRequest.update({
          where: {
            id: pendingRequest.id,
          },
          data: {
            status: "APPROVED",
            resolvedAt: now,
            resolvedBy: session.user.id,
          },
        });
      } else {
        // Record a direct reset initiated by Super Admin.
        await tx.passwordResetRequest.create({
          data: {
            userId,
            source: "ADMIN_DIRECT",
            status: "APPROVED",
            resolvedAt: now,
            resolvedBy: session.user.id,
          },
        });
      }
    });

    return {
      success: true,
      message: "Password reset link generated successfully.",
      resetToken: rawToken,
      expiresAt: expiresAt.toISOString(),
    };
  } catch (error) {
    console.error("Generate password reset link error:", error);

    return {
      success: false,
      message: "Failed to generate password reset link.",
    };
  }
}

export async function validatePasswordResetToken(token: string) {
  if (!token) {
    return {
      success: false,
      message: "Invalid Reset Link.",
    };
  }

  try {
    const tokenHash = hashToken(token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!resetToken) {
      return {
        success: false,
        message: "This password reset link is invalid.",
      };
    }

    if (resetToken.usedAt) {
      return {
        success: false,
        message: "This password reset link has already been used.",
      };
    }

    if (resetToken.expiresAt <= new Date()) {
      return {
        success: false,
        message: "This password reset link has expired.",
      };
    }

    return {
      success: true,
      expiresAt: resetToken.expiresAt.toISOString(),
    };
  } catch (error) {
    console.error("Validate password reset token error:", error);

    return {
      success: false,
      message: "Failed to validate password reset link.",
    };
  }
}

export async function changePasswordWithToken(
  token: string,
  newPassword: string,
  confirmPassword: string,
) {
  if (!token || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  try {
    const tokenHash = hashToken(token);
    const now = new Date();

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!resetToken) {
      return {
        success: false,
        message: "This password reset link is invalid or has expired.",
      };
    }

    if (resetToken.usedAt) {
      return {
        success: false,
        message: "This password reset link has already been used.",
      };
    }

    if (resetToken.expiresAt <= now) {
      return {
        success: false,
        message: "This password reset link has expired.",
      };
    }

    const bcrypt = await import("bcryptjs");

    const passwordHash = await bcrypt.default.hash(newPassword, 12);

    await prisma.$transaction(async (tx) => {
      // Atomically mark this token as used.
      // This prevents the same token from being used twice.
      const tokenUpdate = await tx.passwordResetToken.updateMany({
        where: {
          id: resetToken.id,
          usedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        data: {
          usedAt: now,
        },
      });

      if (tokenUpdate.count !== 1) {
        throw new Error("RESET_TOKEN_ALREADY_USED");
      }

      await tx.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash,
          passwordChangedAt: now,
        },
      });

      // Make sure any other unused reset tokens
      // for this user are no longer usable.
      await tx.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
        },
      });
    });

    return {
      success: true,
      message: "Password changed successfully.",
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "RESET_TOKEN_ALREADY_USED"
    ) {
      return {
        success: false,
        message: "This password reset link has already been used or expired.",
      };
    }

    console.error("Change password with token error:", error);

    return {
      success: false,
      message: "Failed to change password.",
    };
  }
}
