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
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      orders: orders.map((order) => ({
        id: order.id,

        buyer: order.style.purchaseOrder?.programme.buyer.name ?? null,
        programme: order.style.purchaseOrder?.programme.name ?? null,
        poNumber: order.style.purchaseOrder?.poNumber ?? null,

        styleNumber: order.style.styleNumber,
        color: order.style.color,

        factory: order.factory,

        qtySet: order.qtySet,
        qtyPiece: order.qtyPiece,

        actualPrice: order.actualPrice?.toNumber() ?? null,
        factoryPrice: order.factoryPrice?.toNumber() ?? null,

        totalActualValue: order.totalActualValue?.toNumber() ?? null,
        totalFactoryValue: order.totalFactoryValue?.toNumber() ?? null,

        shipDate: order.shipDate,
        status: order.status,

        remarks: order.remarks,

        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
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
