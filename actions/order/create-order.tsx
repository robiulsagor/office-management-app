"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CreateOrderData = {
  buyerId: string;
  programmeName: string;

  poNumber?: string;

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

    // --------------------------------------------------
    // Required fields
    // --------------------------------------------------

    if (!data.buyerId) {
      return {
        success: false,
        message: "Buyer is required.",
      };
    }

    if (!data.programmeName?.trim()) {
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

    // --------------------------------------------------
    // Clean values
    // --------------------------------------------------

    const programmeName = data.programmeName.trim();
    const poNumber = data.poNumber?.trim() || null;
    const styleNumber = data.styleNumber.trim();
    const color = data.color?.trim();

    const factory = data.factory?.trim() || null;
    const remarks = data.remarks?.trim() || null;

    // --------------------------------------------------
    // Validate numbers
    // --------------------------------------------------

    if (data.qtySet !== undefined && data.qtySet < 0) {
      return {
        success: false,
        message: "Quantity set cannot be negative.",
      };
    }

    if (data.qtyPiece !== undefined && data.qtyPiece < 0) {
      return {
        success: false,
        message: "Quantity piece cannot be negative.",
      };
    }

    if (data.actualPrice !== undefined && data.actualPrice < 0) {
      return {
        success: false,
        message: "Actual price cannot be negative.",
      };
    }

    if (data.factoryPrice !== undefined && data.factoryPrice < 0) {
      return {
        success: false,
        message: "Factory price cannot be negative.",
      };
    }

    // --------------------------------------------------
    // Transaction
    // --------------------------------------------------

    const result = await prisma.$transaction(async (tx) => {
      // ------------------------------------------------
      // 1. Find Buyer
      // ------------------------------------------------

      const buyer = await tx.buyer.findUnique({
        where: {
          id: data.buyerId,
        },
      });

      if (!buyer) {
        throw new Error("Invalid buyer.");
      }

      if (!buyer.isActive) {
        throw new Error("This buyer is inactive.");
      }

      // ------------------------------------------------
      // 2. Find or Create Programme
      // ------------------------------------------------

      let programme = await tx.programme.findFirst({
        where: {
          buyerId: buyer.id,
          name: programmeName,
        },
      });

      if (!programme) {
        programme = await tx.programme.create({
          data: {
            buyerId: buyer.id,
            name: programmeName,
          },
        });
      }

      // ------------------------------------------------
      // 3. Find or Create PO (only if provided)
      // ------------------------------------------------

      let purchaseOrder = null;

      if (poNumber) {
        purchaseOrder = await tx.purchaseOrder.findUnique({
          where: {
            programmeId_poNumber: {
              programmeId: programme.id,
              poNumber,
            },
          },
        });

        if (!purchaseOrder) {
          purchaseOrder = await tx.purchaseOrder.create({
            data: {
              programmeId: programme.id,
              poNumber,
            },
          });
        }
      }

      // ------------------------------------------------
      // 4. Create Style
      // ------------------------------------------------

      const style = await tx.style.create({
        data: {
          styleNumber,
          color,

          ...(purchaseOrder && {
            purchaseOrder: {
              connect: {
                id: purchaseOrder.id,
              },
            },
          }),
        },
      });

      // ------------------------------------------------
      // 5. Calculate totals
      // ------------------------------------------------

      const totalActualValue =
        data.qtyPiece !== undefined && data.actualPrice !== undefined
          ? data.qtyPiece * data.actualPrice
          : null;

      const totalFactoryValue =
        data.qtyPiece !== undefined && data.factoryPrice !== undefined
          ? data.qtyPiece * data.factoryPrice
          : null;

      // ------------------------------------------------
      // 6. Create Order
      // ------------------------------------------------

      const order = await tx.order.create({
        data: {
          styleId: style.id,

          factory,

          qtySet: data.qtySet ?? null,
          qtyPiece: data.qtyPiece ?? null,

          actualPrice: data.actualPrice ?? null,
          factoryPrice: data.factoryPrice ?? null,

          totalActualValue,
          totalFactoryValue,

          shipDate: data.shipDate
            ? new Date(`${data.shipDate}T12:00:00`)
            : null,

          status: data.status ?? "PENDING",

          remarks,

          createdById: session.user.id,
        },

        include: {
          style: {
            include: {
              purchaseOrder: {
                include: {
                  programme: true,
                },
              },
            },
          },
        },
      });

      // ------------------------------------------------
      // 7. Version data
      // ------------------------------------------------

      const versionData = {
        id: order.id,

        buyerId: buyer.id,
        buyerName: buyer.name,

        programmeId: programme.id,
        programmeName: programme.name,

        purchaseOrderId: order.style.purchaseOrderId,
        poNumber: order.style.purchaseOrder?.poNumber ?? null,

        styleId: order.style.id,
        styleNumber: order.style.styleNumber,
        color: order.style.color,

        factory: order.factory,

        qtySet: order.qtySet,
        qtyPiece: order.qtyPiece,

        actualPrice: order.actualPrice?.toString() ?? null,
        factoryPrice: order.factoryPrice?.toString() ?? null,

        totalActualValue: order.totalActualValue?.toString() ?? null,

        totalFactoryValue: order.totalFactoryValue?.toString() ?? null,

        shipDate: order.shipDate?.toISOString() ?? null,

        status: order.status,
        remarks: order.remarks,
      };

      // ------------------------------------------------
      // 8. Create Version
      // ------------------------------------------------

      const version = await tx.orderVersion.create({
        data: {
          orderId: order.id,
          version: 1,
          action: "CREATE",
          data: versionData,
          createdById: session.user.id,
        },
      });

      // ------------------------------------------------
      // 9. Create Audit Log
      // ------------------------------------------------

      await tx.orderAuditLog.create({
        data: {
          orderId: order.id,
          action: "CREATE",
          newValues: versionData,
          actedById: session.user.id,
        },
      });

      return {
        orderId: order.id,
        versionId: version.id,
      };
    });

    return {
      success: true,
      message: "Order created successfully.",
      orderId: result.orderId,
    };
  } catch (error) {
    console.error("Create order error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the order.",
    };
  }
}
