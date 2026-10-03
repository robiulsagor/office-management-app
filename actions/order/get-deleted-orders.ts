
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getDeletedOrders() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false as const,
      message: "You must be logged in to view deleted orders.",
      orders: [],
    };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: "desc",
      },
      select: {
        id: true,
        factory: true,
        status: true,
        deletedAt: true,
        style: {
          select: {
            styleNumber: true,
            programme: {
              select: {
                name: true,
                buyer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        deletedBy: {
          select: {
            username: true,
            employee: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true as const,
      orders: orders.map((order) => ({
        id: order.id,
        styleNumber: order.style.styleNumber,
        programmeName: order.style.programme.name,
        buyerName: order.style.programme.buyer.name,
        factory: order.factory,
        status: order.status,
        deletedAt: order.deletedAt?.toISOString() ?? null,
        deletedBy:
          order.deletedBy?.employee?.name ||
          order.deletedBy?.username ||
          "Unknown user",
      })),
    };
  } catch (error) {
    console.error("Get deleted orders error:", error);

    return {
      success: false as const,
      message: "Failed to load deleted orders.",
      orders: [],
    };
  }
}
