"use server";

import { prisma } from "@/lib/prisma";

export async function createPurchaseOrder(
  programmeId: string,
  poNumber: string
) {
  const cleanPoNumber = poNumber.trim();

  if (!programmeId) {
    return {
      success: false,
      message: "Programme is required.",
    };
  }

  if (!cleanPoNumber) {
    return {
      success: false,
      message: "PO number is required.",
    };
  }

  try {
    const existingPurchaseOrder =
      await prisma.purchaseOrder.findUnique({
        where: {
          programmeId_poNumber: {
            programmeId,
            poNumber: cleanPoNumber,
          },
        },
      });

    if (existingPurchaseOrder) {
      return {
        success: false,
        message:
          "This PO already exists for this programme.",
        purchaseOrder: existingPurchaseOrder,
      };
    }

    const purchaseOrder =
      await prisma.purchaseOrder.create({
        data: {
          programmeId,
          poNumber: cleanPoNumber,
        },

        select: {
          id: true,
          poNumber: true,
        },
      });

    return {
      success: true,
      purchaseOrder,
    };
  } catch (error) {
    console.error(
      "Create purchase order error:",
      error
    );

    return {
      success: false,
      message: "Failed to create purchase order.",
    };
  }
}