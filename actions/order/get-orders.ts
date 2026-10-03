"use server";

import { prisma } from "@/lib/prisma";

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: {
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

      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      orders: orders.map((order) => ({
        ...order,
        actualPrice: order.actualPrice?.toNumber() ?? null,
        factoryPrice: order.factoryPrice?.toNumber() ?? null,
        totalActualValue: order.totalActualValue?.toNumber() ?? null,
        totalFactoryValue: order.totalFactoryValue?.toNumber() ?? null,
      })),
    };
  } catch (error) {
    console.error("Get orders error:", error);

    return {
      success: false,
      orders: [],
      message: "Failed to load orders.",
    };
  }
}
