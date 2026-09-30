"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderPurchaseOrders(
  programmeId: string
) {
  if (!programmeId) {
    return {
      success: false,
      purchaseOrders: [],
      message: "Programme is required.",
    };
  }

  try {
    const purchaseOrders =
      await prisma.purchaseOrder.findMany({
        where: {
          programmeId,
        },

        select: {
          id: true,
          poNumber: true,
        },

        orderBy: {
          poNumber: "asc",
        },
      });

    return {
      success: true,
      purchaseOrders,
    };
  } catch (error) {
    console.error(
      "Get order purchase orders error:",
      error
    );

    return {
      success: false,
      purchaseOrders: [],
      message: "Failed to load purchase orders.",
    };
  }
}