
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  orderHistoryInclude,
  serializeOrderForHistory,
} from "./order-history";

export async function deleteOrder(orderId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to delete an order.",
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
          deletedAt: null,
        },
        include: orderHistoryInclude,
      });

      if (!existing) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const deletedAt = new Date();

      // Soft-delete the order. Do not physically remove it.
      const deletedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          deletedAt,
          deletedById: session.user.id,
        },
        include: orderHistoryInclude,
      });

      // Generate the next version number.
      const latestVersion = await tx.orderVersion.findFirst({
        where: { orderId },
        orderBy: { version: "desc" },
        select: { version: true },
      });

      const nextVersion = (latestVersion?.version ?? 0) + 1;
      const historyData = serializeOrderForHistory(deletedOrder);

      const version = await tx.orderVersion.create({
        data: {
          orderId,
          version: nextVersion,
          action: "DELETE",
          data: historyData,
          createdById: session.user.id,
        },
      });

      // Record who deleted the order and when.
      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: "DELETE",
          changedFields: ["deletedAt", "deletedById"],
          oldValues: {
            deletedAt: null,
            deletedById: null,
          },
          newValues: {
            deletedAt: deletedAt.toISOString(),
            deletedById: session.user.id,
          },
          actedById: session.user.id,
        },
      });

      // Preserve a snapshot of the deleted order.
      await tx.orderSnapshot.create({
        data: {
          orderId,
          userId: session.user.id,
          versionId: version.id,
          label: `Deleted - Version ${nextVersion}`,
          data: historyData,
        },
      });
    });

    return {
      success: true,
      message: "Order deleted successfully.",
    };
  } catch (error) {
    if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
      return {
        success: false,
        message: "Order not found or already deleted.",
      };
    }

    console.error("Delete order error:", error);

    return {
      success: false,
      message: "Failed to delete the order.",
    };
  }
}
