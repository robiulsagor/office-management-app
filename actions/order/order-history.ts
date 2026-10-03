import { prisma } from "@/lib/prisma";

type TransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export type OrderHistoryRecord = {
  id: string;
  styleId: string;
  purchaseOrderId: string | null;
  factory: string | null;
  qtySet: number | null;
  qtyPiece: number | null;
  actualPrice: { toNumber(): number } | null;
  factoryPrice: { toNumber(): number } | null;
  totalActualValue: { toNumber(): number } | null;
  totalFactoryValue: { toNumber(): number } | null;
  shipDate: Date | null;
  status: string;
  remarks: string | null;
  createdById: string;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
  style: {
    id: string;
    styleNumber: string;
    color: string;
    programmeId: string;
    programme: {
      id: string;
      name: string;
      buyer: { id: string; name: string };
    };
    purchaseOrders: Array<{
      purchaseOrder: { id: string; poNumber: string; programmeId: string };
    }>;
  };
  purchaseOrder: {
    id: string;
    poNumber: string;
    programme: {
      id: string;
      name: string;
      buyer: { id: string; name: string };
    };
  } | null;
};

export function serializeOrderForHistory(order: OrderHistoryRecord) {
  return {
    id: order.id,
    styleId: order.styleId,
    purchaseOrderId: order.purchaseOrderId,
    factory: order.factory,
    qtySet: order.qtySet,
    qtyPiece: order.qtyPiece,
    actualPrice: order.actualPrice?.toNumber() ?? null,
    factoryPrice: order.factoryPrice?.toNumber() ?? null,
    totalActualValue: order.totalActualValue?.toNumber() ?? null,
    totalFactoryValue: order.totalFactoryValue?.toNumber() ?? null,
    shipDate: order.shipDate?.toISOString() ?? null,
    status: order.status,
    remarks: order.remarks,
    createdById: order.createdById,
    updatedById: order.updatedById,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    style: {
      id: order.style.id,
      styleNumber: order.style.styleNumber,
      color: order.style.color,
      programmeId: order.style.programmeId,
      programme: {
        id: order.style.programme.id,
        name: order.style.programme.name,
        buyer: order.style.programme.buyer,
      },
      purchaseOrders: order.style.purchaseOrders.map(({ purchaseOrder }) => ({
        id: purchaseOrder.id,
        poNumber: purchaseOrder.poNumber,
        programmeId: purchaseOrder.programmeId,
      })),
    },
    purchaseOrder: order.purchaseOrder
      ? {
          id: order.purchaseOrder.id,
          poNumber: order.purchaseOrder.poNumber,
          programme: order.purchaseOrder.programme,
        }
      : null,
  };
}

export const orderHistoryInclude = {
  style: {
    include: {
      programme: { include: { buyer: true } },
      purchaseOrders: { include: { purchaseOrder: true } },
    },
  },
  purchaseOrder: {
    include: { programme: { include: { buyer: true } } },
  },
} as const;

export function calculateOrderTotals(data: {
  qtyPiece?: number | null;
  actualPrice?: number | null;
  factoryPrice?: number | null;
}) {
  return {
    totalActualValue:
      data.qtyPiece != null && data.actualPrice != null
        ? data.qtyPiece * data.actualPrice
        : null,
    totalFactoryValue:
      data.qtyPiece != null && data.factoryPrice != null
        ? data.qtyPiece * data.factoryPrice
        : null,
  };
}

export function getEditableOrderValues(data: {
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
  status?: string;
  remarks?: string;
}) {
  return {
    buyerId: data.buyerId,
    programmeId: data.programmeId,
    purchaseOrderIds: [...new Set(data.purchaseOrderIds ?? [])].sort(),
    styleNumber: data.styleNumber.trim(),
    color: data.color.trim(),
    factory: data.factory?.trim() || null,
    qtySet: data.qtySet ?? null,
    qtyPiece: data.qtyPiece ?? null,
    actualPrice: data.actualPrice ?? null,
    factoryPrice: data.factoryPrice ?? null,
    shipDate: data.shipDate || null,
    status: data.status ?? "PENDING",
    remarks: data.remarks?.trim() || null,
  };
}

export async function validateOrderHierarchy(
  tx: TransactionClient,
  data: { buyerId: string; programmeId: string; purchaseOrderIds?: string[] },
) {
  const programme = await tx.programme.findFirst({
    where: { id: data.programmeId, buyerId: data.buyerId },
    select: { id: true },
  });
  if (!programme) return { success: false as const, message: "Invalid programme selected for this buyer." };

  const purchaseOrderIds = [...new Set(data.purchaseOrderIds ?? [])];
  if (purchaseOrderIds.length) {
    const purchaseOrders = await tx.purchaseOrder.findMany({
      where: { id: { in: purchaseOrderIds }, programmeId: data.programmeId },
      select: { id: true },
    });
    if (purchaseOrders.length !== purchaseOrderIds.length) {
      return { success: false as const, message: "One or more selected POs do not belong to the selected programme." };
    }
  }
  return { success: true as const, purchaseOrderIds };
}
