"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateOrderTotals, getEditableOrderValues, orderHistoryInclude, serializeOrderForHistory, validateOrderHierarchy } from "./order-history";

export type CreateOrderData = {
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
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: "You must be logged in to create an order." };
  }

  if (!data.buyerId) return { success: false as const, message: "Buyer is required." };
  if (!data.programmeId) return { success: false as const, message: "Programme is required." };
  if (!data.styleNumber?.trim()) return { success: false as const, message: "Style number is required." };
  if (!data.color?.trim()) return { success: false as const, message: "Color is required." };
  if (data.shipDate && Number.isNaN(new Date(data.shipDate).getTime())) {
    return { success: false as const, message: "Ship date is invalid." };
  }

  const values = getEditableOrderValues(data);
  const totals = calculateOrderTotals(data);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const hierarchy = await validateOrderHierarchy(tx, data);
      if (!hierarchy.success) throw new Error(hierarchy.message);
      const purchaseOrderIds = hierarchy.purchaseOrderIds;

      const style = await tx.style.create({
        data: {
          styleNumber: values.styleNumber,
          color: values.color,
          programmeId: values.programmeId,
          purchaseOrders: {
            create: purchaseOrderIds.map((purchaseOrderId) => ({ purchaseOrderId })),
          },
        },
      });

      const order = await tx.order.create({
        data: {
          styleId: style.id,
          factory: values.factory,
          qtySet: values.qtySet,
          qtyPiece: values.qtyPiece,
          actualPrice: values.actualPrice,
          factoryPrice: values.factoryPrice,
          totalActualValue: totals.totalActualValue,
          totalFactoryValue: totals.totalFactoryValue,
          shipDate: values.shipDate ? new Date(values.shipDate) : null,
          status: (values.status ?? "PENDING") as CreateOrderData["status"],
          remarks: values.remarks,
          createdById: session.user.id,
        },
        include: orderHistoryInclude,
      });

      const historyData = serializeOrderForHistory(order);
      const version = await tx.orderVersion.create({
        data: {
          orderId: order.id,
          version: 1,
          action: "CREATE",
          data: historyData,
          createdById: session.user.id,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId: order.id,
          action: "CREATE",
          changedFields: Object.keys(values),
          oldValues: {},
          newValues: values,
          actedById: session.user.id,
        },
      });

      await tx.orderSnapshot.create({
        data: {
          orderId: order.id,
          userId: session.user.id,
          versionId: version.id,
          label: "Initial creation",
          data: historyData,
        },
      });

      return order;
    });

    return {
      success: true as const,
      order: {
        ...result,
        actualPrice: result.actualPrice?.toNumber() ?? null,
        factoryPrice: result.factoryPrice?.toNumber() ?? null,
        totalActualValue: result.totalActualValue?.toNumber() ?? null,
        totalFactoryValue: result.totalFactoryValue?.toNumber() ?? null,
      },
    };
  } catch (error) {
    console.error("Create order error:", error);
    const message = error instanceof Error && !error.message.includes("Transaction")
      ? error.message
      : "Failed to create order.";
    return { success: false as const, message };
  }
}
