"use client";

import React, { useMemo } from "react";
import Link from "next/link";

type Order = {
  id: string;

  style: {
    styleNumber: string;
    color: string;

    purchaseOrders: {
      purchaseOrder: {
        poNumber: string;
        programme: {
          name: string;
          buyer: {
            name: string;
          };
        };
      };
    }[];
  };

  purchaseOrder: {
    poNumber: string;
    programme: {
      name: string;
      buyer: {
        name: string;
      };
    };
  } | null;

  factory: string | null;

  qtySet: number | null;
  qtyPiece: number | null;

  actualPrice: number | null;
  factoryPrice: number | null;

  totalActualValue: number | null;
  totalFactoryValue: number | null;

  shipDate: Date | null;
  status: string;
};

type OrdersAlterTableProps = {
  orders: Order[];
};

function formatNumber(value: number | null) {
  if (value == null) {
    return "";
  }

  return value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-GB");
}

export default function OrdersAlterTable({
  orders,
}: OrdersAlterTableProps) {
  const groupedOrders = useMemo(() => {
    const buyerMap = new Map<
      string,
      Map<string, Order[]>
    >();

    for (const order of orders) {
      const purchaseOrder =
        order.purchaseOrder ??
        order.style.purchaseOrders[0]?.purchaseOrder;

      const buyer =
        purchaseOrder?.programme.buyer.name ??
        "No Buyer";

      const programme =
        purchaseOrder?.programme.name ??
        "No Programme";

      if (!buyerMap.has(buyer)) {
        buyerMap.set(buyer, new Map());
      }

      const programmeMap = buyerMap.get(buyer)!;

      if (!programmeMap.has(programme)) {
        programmeMap.set(programme, []);
      }

      programmeMap.get(programme)!.push(order);
    }

    return Array.from(buyerMap.entries()).map(
      ([buyer, programmeMap]) => ({
        buyer,
        programmes: Array.from(
          programmeMap.entries(),
        ).map(([programme, orders]) => ({
          programme,
          orders,
        })),
      }),
    );
  }, [orders]);

  const buyerTotals = useMemo(() => {
    return groupedOrders.map((buyerGroup) => {
      const actual = buyerGroup.programmes.reduce(
        (sum, programme) =>
          sum +
          programme.orders.reduce(
            (programmeSum, order) =>
              programmeSum +
              (order.totalActualValue ?? 0),
            0,
          ),
        0,
      );

      const factory = buyerGroup.programmes.reduce(
        (sum, programme) =>
          sum +
          programme.orders.reduce(
            (programmeSum, order) =>
              programmeSum +
              (order.totalFactoryValue ?? 0),
            0,
          ),
        0,
      );

      return {
        buyer: buyerGroup.buyer,
        actual,
        factory,
      };
    });
  }, [groupedOrders]);

  const grandTotal = buyerTotals.reduce(
    (total, buyer) => ({
      actual: total.actual + buyer.actual,
      factory: total.factory + buyer.factory,
    }),
    {
      actual: 0,
      factory: 0,
    },
  );

  const totalCommission =
    grandTotal.actual - grandTotal.factory;

  return (
    <div className="space-y-8">
      {/* Excel-style table */}
      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/70">
                <th className="border px-3 py-3 text-left font-semibold">
                  Buyer
                </th>

                <th className="border px-3 py-3 text-left font-semibold">
                  Programme
                </th>

                <th className="border px-3 py-3 text-left font-semibold">
                  PO
                </th>

                <th className="border px-3 py-3 text-left font-semibold">
                  Style
                </th>

                <th className="border px-3 py-3 text-left font-semibold">
                  Color
                </th>

                <th className="border px-3 py-3 text-left font-semibold">
                  Factory
                </th>

                <th className="border px-3 py-3 text-right font-semibold">
                  Qty Set
                </th>

                <th className="border px-3 py-3 text-right font-semibold">
                  Qty Piece
                </th>

                <th className="border px-3 py-3 text-right font-semibold">
                  Actual Price
                </th>

                <th className="border px-3 py-3 text-right font-semibold">
                  Factory Price
                </th>

                <th className="border px-3 py-3 text-right font-semibold">
                  Actual Value
                </th>

                <th className="border px-3 py-3 text-right font-semibold">
                  Factory Value
                </th>

                <th className="border px-3 py-3 text-left font-semibold">
                  Ship Date
                </th>

                <th className="border px-3 py-3 text-left font-semibold">
                  Status
                </th>

                <th className="border px-3 py-3 text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {groupedOrders.map((buyerGroup) => {
                const buyerOrders =
                  buyerGroup.programmes.flatMap(
                    (programme) => programme.orders,
                  );

                return buyerGroup.programmes.map(
                  (programmeGroup) => {
                    const programmeOrders =
                      programmeGroup.orders;

                    const programmeTotalActual =
                      programmeOrders.reduce(
                        (sum, order) =>
                          sum +
                          (order.totalActualValue ?? 0),
                        0,
                      );

                    const programmeTotalFactory =
                      programmeOrders.reduce(
                        (sum, order) =>
                          sum +
                          (order.totalFactoryValue ?? 0),
                        0,
                      );

                    /*
                     * One Order has one optional purchaseOrder.
                     *
                     * If purchaseOrder is null, use the
                     * Style's associated PO list.
                     */
                    const purchaseOrders =
                      programmeOrders.reduce<
                        Record<string, Order[]>
                      >((acc, order) => {
                        const poNumber =
                          order.purchaseOrder?.poNumber ??
                          (order.style.purchaseOrders
                            .map(
                              (item) =>
                                item.purchaseOrder.poNumber,
                            )
                            .join(", ") || "No PO");

                        if (!acc[poNumber]) {
                          acc[poNumber] = [];
                        }

                        acc[poNumber].push(order);

                        return acc;
                      }, {});

                    const programmeIndex =
                      buyerGroup.programmes.findIndex(
                        (item) =>
                          item.programme ===
                          programmeGroup.programme,
                      );

                    const isFirstProgramme =
                      programmeIndex === 0;

                    return (
                      <React.Fragment
                        key={`${buyerGroup.buyer}-${programmeGroup.programme}`}
                      >
                        {Object.entries(
                          purchaseOrders,
                        ).map(
                          (
                            [poNumber, poOrders],
                            poIndex,
                          ) =>
                            poOrders.map(
                              (order, orderIndex) => {
                                const isFirstBuyerRow =
                                  isFirstProgramme &&
                                  poIndex === 0 &&
                                  orderIndex === 0;

                                const isFirstProgrammeRow =
                                  poIndex === 0 &&
                                  orderIndex === 0;

                                const isFirstPORow =
                                  orderIndex === 0;

                                return (
                                  <tr
                                    key={`${order.id}-${poNumber}`}
                                    className="border-b hover:bg-muted/30"
                                  >
                                    {/* Buyer */}
                                    {isFirstBuyerRow && (
                                      <td
                                        rowSpan={
                                          buyerOrders.length
                                        }
                                        className="border-r px-2 py-2 align-middle font-medium"
                                      >
                                        {
                                          buyerGroup.buyer
                                        }
                                      </td>
                                    )}

                                    {/* Programme */}
                                    {isFirstProgrammeRow && (
                                      <td
                                        rowSpan={
                                          programmeOrders.length
                                        }
                                        className="border-r px-2 py-2 align-middle"
                                      >
                                        {
                                          programmeGroup.programme
                                        }
                                      </td>
                                    )}

                                    {/* PO */}
                                    {isFirstPORow && (
                                      <td
                                        rowSpan={
                                          poOrders.length
                                        }
                                        className="border-r px-2 py-2 align-middle"
                                      >
                                        {poNumber}
                                      </td>
                                    )}

                                    {/* Style */}
                                    <td className="px-2 py-2">
                                      {
                                        order.style
                                          .styleNumber
                                      }
                                    </td>

                                    {/* Color */}
                                    <td className="px-2 py-2">
                                      {order.style.color}
                                    </td>

                                    {/* Factory */}
                                    <td className="px-2 py-2">
                                      {order.factory ?? "-"}
                                    </td>

                                    {/* Qty Set */}
                                    <td className="px-2 py-2 text-right">
                                      {order.qtySet ?? "-"}
                                    </td>

                                    {/* Qty Piece */}
                                    <td className="px-2 py-2 text-right">
                                      {order.qtyPiece ?? "-"}
                                    </td>

                                    {/* Actual Price */}
                                    <td className="px-2 py-2 text-right">
                                      {order.actualPrice ?? "-"}
                                    </td>

                                    {/* Factory Price */}
                                    <td className="px-2 py-2 text-right">
                                      {order.factoryPrice ?? "-"}
                                    </td>

                                    {/* Actual Value */}
                                    <td className="px-2 py-2 text-right">
                                      {order.totalActualValue ??
                                        "-"}
                                    </td>

                                    {/* Factory Value */}
                                    <td className="px-2 py-2 text-right">
                                      {order.totalFactoryValue ??
                                        "-"}
                                    </td>

                                    {/* Ship Date */}
                                    <td className="px-2 py-2">
                                      {formatDate(
                                        order.shipDate,
                                      ) || "-"}
                                    </td>

                                    {/* Status */}
                                    <td className="px-2 py-2">
                                      {order.status}
                                    </td>

                                    {/* Action */}
                                    <td className="px-2 py-2 text-center">
                                      <Link
                                        href={`/orders/${order.id}`}
                                        className="text-primary hover:underline"
                                      >
                                        View
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              },
                            ),
                        )}

                        {/* Programme Total */}
                        <tr className="border-b-2 bg-muted/60 font-semibold">
                          <td
                            colSpan={9}
                            className="px-2 py-2 text-right"
                          >
                            {programmeGroup.programme}{" "}
                            Total
                          </td>

                          <td className="px-2 py-2 text-right">
                            {formatNumber(
                              programmeTotalActual,
                            )}
                          </td>

                          <td className="px-2 py-2 text-right">
                            {formatNumber(
                              programmeTotalFactory,
                            )}
                          </td>

                          <td colSpan={4}></td>
                        </tr>
                      </React.Fragment>
                    );
                  },
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border bg-background shadow-sm">
        <div className="border-b bg-muted/50 px-5 py-3 font-semibold">
          Order Summary
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-3 text-left font-medium">
                  Buyer
                </th>

                <th className="px-5 py-3 text-right font-medium">
                  Total Actual Value
                </th>

                <th className="px-5 py-3 text-right font-medium">
                  Total Factory Value
                </th>
              </tr>
            </thead>

            <tbody>
              {buyerTotals.map((buyer) => (
                <tr
                  key={buyer.buyer}
                  className="border-b"
                >
                  <td className="px-5 py-3 font-medium">
                    {buyer.buyer}
                  </td>

                  <td className="px-5 py-3 text-right">
                    ৳ {formatNumber(buyer.actual)}
                  </td>

                  <td className="px-5 py-3 text-right">
                    ৳ {formatNumber(buyer.factory)}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t bg-muted/40 font-bold">
                <td className="px-5 py-4">Total</td>

                <td className="px-5 py-4 text-right">
                  ৳ {formatNumber(grandTotal.actual)}
                </td>

                <td className="px-5 py-4 text-right">
                  ৳ {formatNumber(grandTotal.factory)}
                </td>
              </tr>

              <tr className="bg-muted/20 font-bold">
                <td className="px-5 py-4">
                  Total Commission
                </td>

                <td
                  colSpan={2}
                  className="px-5 py-4 text-right"
                >
                  ৳ {formatNumber(totalCommission)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}