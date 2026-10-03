"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateOrderTotals,
  getEditableOrderValues,
  orderHistoryInclude,
  serializeOrderForHistory,
  validateOrderHierarchy,
} from "./order-history";
import type { CreateOrderData } from "./create-order";

export async function updateOrder(orderId: string, data: CreateOrderData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: "You must be logged in to update an order." };
  }
  if (!orderId) return { success: false as const, message: "Order ID is required." };
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
      const existing = await tx.order.findFirst({
        where: { id: orderId, deletedAt: null },
        include: orderHistoryInclude,
      });
      if (!existing) throw new Error("Order not found.");

      const hierarchy = await validateOrderHierarchy(tx, data);
      if (!hierarchy.success) throw new Error(hierarchy.message);
      const purchaseOrderIds = hierarchy.purchaseOrderIds;

      const oldValues = {
        buyerId: existing.style.programme.buyer.id,
        programmeId: existing.style.programmeId,
        purchaseOrderIds: existing.style.purchaseOrders.map((x) => x.purchaseOrder.id).sort(),
        styleNumber: existing.style.styleNumber,
        color: existing.style.color,
        factory: existing.factory,
        qtySet: existing.qtySet,
        qtyPiece: existing.qtyPiece,
        actualPrice: existing.actualPrice?.toNumber() ?? null,
        factoryPrice: existing.factoryPrice?.toNumber() ?? null,
        shipDate: existing.shipDate?.toISOString().slice(0, 10) ?? null,
        status: existing.status,
        remarks: existing.remarks,
      };
      const newValues = {
        ...values,
        shipDate: values.shipDate ?? null,
      };
      const changedFields = Object.keys(newValues).filter((key) =>
        JSON.stringify(oldValues[key as keyof typeof oldValues] ?? null) !==
        JSON.stringify(newValues[key as keyof typeof newValues] ?? null),
      );

      // If another Order uses this Style, detach this Order onto a new Style
      // rather than silently changing the other Order's style/PO information.
      const otherOrdersUsingStyle = await tx.order.count({
        where: { styleId: existing.styleId, id: { not: orderId } },
      });
      let styleId = existing.styleId;

      if (otherOrdersUsingStyle > 0) {
        const newStyle = await tx.style.create({
          data: {
            styleNumber: values.styleNumber,
            color: values.color,
            programmeId: values.programmeId,
            purchaseOrders: {
              create: purchaseOrderIds.map((purchaseOrderId) => ({ purchaseOrderId })),
            },
          },
        });
        styleId = newStyle.id;
      } else {
        await tx.style.update({
          where: { id: existing.styleId },
          data: {
            styleNumber: values.styleNumber,
            color: values.color,
            programmeId: values.programmeId,
          },
        });
        await tx.stylePurchaseOrder.deleteMany({ where: { styleId: existing.styleId } });
        if (purchaseOrderIds.length) {
          await tx.stylePurchaseOrder.createMany({
            data: purchaseOrderIds.map((purchaseOrderId) => ({
              styleId: existing.styleId,
              purchaseOrderId,
            })),
          });
        }
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          styleId,
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
          updatedById: session.user.id,
        },
        include: orderHistoryInclude,
      });

      const latestVersion = await tx.orderVersion.findFirst({
        where: { orderId },
        orderBy: { version: "desc" },
        select: { version: true },
      });
      const historyData = serializeOrderForHistory(updated);
      const version = await tx.orderVersion.create({
        data: {
          orderId,
          version: (latestVersion?.version ?? 0) + 1,
          action: "UPDATE",
          data: historyData,
          createdById: session.user.id,
        },
      });

      await tx.orderAuditLog.create({
        data: {
          orderId,
          action: "UPDATE",
          changedFields,
          oldValues,
          newValues,
          actedById: session.user.id,
        },
      });

      await tx.orderSnapshot.create({
        data: {
          orderId,
          userId: session.user.id,
          versionId: version.id,
          label: `Version ${version.version}`,
          data: historyData,
        },
      });

      return updated;
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
    console.error("Update order error:", error);
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Failed to update order.",
    };
  }
}
