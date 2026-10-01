"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CreateOrderData = {
  buyerId: string;
  programmeId: string;
  purchaseOrderIds?: string[];
  styleNumber: string;
  color: string;
  factory?: string;
  qtySet?: number;
  qtyPiece?: number;
  actualPrice?: number;
  factoryPrice?: number;
  shipDate?: string;
  status?:
    | "PENDING"
    | "CONFIRMED"
    | "IN_PRODUCTION"
    | "READY_TO_SHIP"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED";
  remarks?: string;
};

export async function createOrder(data: CreateOrderData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to create an order.",
      };
    }

    const createdById = session.user.id;

    // 1. Validate required fields
    if (!data.buyerId) {
      return {
        success: false,
        message: "Buyer is required.",
      };
    }

    if (!data.programmeId) {
      return {
        success: false,
        message: "Programme is required.",
      };
    }

    if (!data.styleNumber?.trim()) {
      return {
        success: false,
        message: "Style number is required.",
      };
    }

    if (!data.color?.trim()) {
      return {
        success: false,
        message: "Color is required.",
      };
    }

    // 2. Verify programme belongs to selected buyer
    const programme = await prisma.programme.findFirst({
      where: {
        id: data.programmeId,
        buyerId: data.buyerId,
      },
    });

    if (!programme) {
      return {
        success: false,
        message: "Invalid programme selected.",
      };
    }

    // 3. Verify PO belongs to selected programme
    const purchaseOrderIds = data.purchaseOrderIds ?? [];

    if (purchaseOrderIds.length > 0) {
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: {
          id: {
            in: purchaseOrderIds,
          },
          programmeId: data.programmeId,
        },
        select: {
          id: true,
        },
      });

      if (purchaseOrders.length !== purchaseOrderIds.length) {
        return {
          success: false,
          message:
            "One or more selected purchase orders do not belong to this programme.",
        };
      }
    }

    // 4. Create Style
    const style = await prisma.style.create({
      data: {
        styleNumber: data.styleNumber.trim(),
        color: data.color.trim(),

        purchaseOrders: {
          create: purchaseOrderIds.map((purchaseOrderId) => ({
            purchaseOrderId,
          })),
        },
      },
    });

    // 5. Calculate total values
    const totalActualValue =
      data.qtyPiece != null && data.actualPrice != null
        ? data.qtyPiece * data.actualPrice
        : null;

    const totalFactoryValue =
      data.qtyPiece != null && data.factoryPrice != null
        ? data.qtyPiece * data.factoryPrice
        : null;

    // 6. Create Order

    const order = await prisma.order.create({
      data: {
        styleId: style.id,

        factory: data.factory?.trim() || null,
        qtySet: data.qtySet ?? null,
        qtyPiece: data.qtyPiece ?? null,

        actualPrice: data.actualPrice ?? null,
        factoryPrice: data.factoryPrice ?? null,

        totalActualValue,
        totalFactoryValue,

        shipDate: data.shipDate ? new Date(data.shipDate) : null,

        status: data.status ?? "PENDING",
        remarks: data.remarks?.trim() || null,

        createdById,
      },
    });

    return {
      success: true,
      order: {
        ...order,
        actualPrice: order.actualPrice?.toNumber() ?? null,
        factoryPrice: order.factoryPrice?.toNumber() ?? null,
        totalActualValue: order.totalActualValue?.toNumber() ?? null,
        totalFactoryValue: order.totalFactoryValue?.toNumber() ?? null,
      },
    };
  } catch (error) {
    console.error("Create order error:", error);

    return {
      success: false,
      message: "Failed to create order.",
    };
  }
}
