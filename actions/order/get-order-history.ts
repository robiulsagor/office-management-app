"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getOrderHistory(orderId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false as const,
      message: "You must be logged in to view order history.",
    };
  }

  if (!orderId) {
    return {
      success: false as const,
      message: "Order ID is required.",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!order) {
      return {
        success: false as const,
        message: "Order not found.",
      };
    }

    const [versions, auditLogs, snapshots] = await Promise.all([
      prisma.orderVersion.findMany({
        where: { orderId },
        orderBy: { version: "desc" },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              employeeId: true,
              employee: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),

      prisma.orderAuditLog.findMany({
        where: { orderId },
        orderBy: { actedAt: "desc" },
        include: {
          actedBy: {
            select: {
              id: true,
              username: true,
              employeeId: true,
              employee: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),

      prisma.orderSnapshot.findMany({
        where: { orderId },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              employeeId: true,
              employee: {
                select: {
                  name: true,
                },
              },
            },
          },
          version: {
            select: { id: true, version: true, action: true },
          },
        },
      }),
    ]);

    return {
      success: true as const,

      versions: versions.map((item) => ({
        id: item.id,
        version: item.version,
        action: item.action,
        data: item.data,
        createdAt: item.createdAt.toISOString(),
        createdBy: item.createdBy,
      })),

      auditLogs: auditLogs.map((item) => ({
        id: item.id,
        action: item.action,
        changedFields: item.changedFields,
        oldValues: item.oldValues,
        newValues: item.newValues,
        actedAt: item.actedAt.toISOString(),
        actedBy: item.actedBy,
      })),

      snapshots: snapshots.map((item) => ({
        id: item.id,
        label: item.label,
        data: item.data,
        createdAt: item.createdAt.toISOString(),
        user: item.user,
        version: item.version,
      })),
    };
  } catch (error) {
    console.error("Get order history error:", error);

    return {
      success: false as const,
      message: "Failed to load order history.",
    };
  }
}
