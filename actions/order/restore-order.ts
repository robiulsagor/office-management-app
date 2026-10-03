
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  orderHistoryInclude,
  serializeOrderForHistory,
} from "./order-history";

export async function restoreOrder(orderId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to restore an order.",
    };
  }

  if (!orderId?.trim()) {
    return {
      success: false,
      message: "Invalid order ID.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findFirst({
        where: {
          id: orderId,
          deletedAt: { not: null },
        },
        include: orderHistoryInclude,
      });

      if (!existing) {
        throw new Error("DELETED_ORDER_NOT_FOUND");
      }

      const restored = await tx.order.update({
        where: { id: orderId },
        data: {
          deletedAt: null,
          deletedById: null,
          updatedById: session.user.id,
        },
        include: orderHistoryInclude,
      });

      const latestVersion = await tx.orderVersion.findFirst({
        where: { orderId },
        orderBy: { version: "desc" },
        select: { version: true },
      });

      const nextVersion = (latestVersion?.version ?? 0) + 1;
      const historyData = serializeOrderForHistory(restored);

      const version = await tx.orderVersion.create({
        data: {
          orderId,
          version: nextVersion,
          action: "RESTORE",
          data: historyData,
          createdById: session.user.id,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: "RESTORE",
          changedFields: ["deletedAt", "deletedById"],
          oldValues: {
            deletedAt: existing.deletedAt?.toISOString() ?? null,
            deletedById: existing.deletedById,
          },
          newValues: {
            deletedAt: null,
            deletedById: null,
          },
          actedById: session.user.id,
        },
      });

      await tx.orderSnapshot.create({
        data: {
          orderId,
          userId: session.user.id,
          versionId: version.id,
          label: `Restored - Version ${nextVersion}`,
          data: historyData,
        },
      });
    });

    return {
      success: true,
      message: "Order restored successfully.",
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "DELETED_ORDER_NOT_FOUND"
    ) {
      return {
        success: false,
        message: "Deleted order not found or already restored.",
      };
    }

    console.error("Restore order error:", error);

    return {
      success: false,
      message: "Failed to restore the order.",
    };
  }
}
