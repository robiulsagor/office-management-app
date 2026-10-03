
"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderById(id: string) {
  if (!id) {
    return {
      success: false as const,
      order: null,
      message: "Order ID is required.",
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        style: {
          include: {
            purchaseOrders: {
              include: {
                purchaseOrder: {
                  include: {
                    programme: {
                      include: {
                        buyer: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },

        purchaseOrder: {
          include: {
            programme: {
              include: {
                buyer: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false as const,
        order: null,
        message: "Order not found.",
      };
    }

    return {
      success: true as const,
      order: {
        ...order,
        actualPrice: order.actualPrice?.toNumber() ?? null,
        factoryPrice: order.factoryPrice?.toNumber() ?? null,
        totalActualValue: order.totalActualValue?.toNumber() ?? null,
        totalFactoryValue: order.totalFactoryValue?.toNumber() ?? null,
      },
    };
  } catch (error) {
    console.error("Get order by ID error:", error);

    return {
      success: false as const,
      order: null,
      message: "Failed to load order.",
    };
  }
}
