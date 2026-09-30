"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

type Order = {
  id: string;

  buyer: string | null;
  programme: string | null;
  poNumber: string | null;

  styleNumber: string;
  color: string;

  factory: string | null;

  qtySet: number | null;
  qtyPiece: number | null;

  actualPrice: number | null;
  factoryPrice: number | null;

  totalActualValue: number | null;
  totalFactoryValue: number | null;

  shipDate: Date | null;
  status: string;

  remarks: string | null;

  createdAt: Date;
  updatedAt: Date;
};

type OrdersTableProps = {
  orders: Order[];
};

type ProgrammeGroup = {
  name: string;
  orders: Order[];
};

type BuyerGroup = {
  name: string;
  programmes: ProgrammeGroup[];
};

function formatMoney(value: number | null) {
  if (value == null) {
    return "—";
  }

  return value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-GB");
}

export default function OrdersTable({
  orders,
}: OrdersTableProps) {
  const [expandedBuyers, setExpandedBuyers] = useState<
    Set<string>
  >(new Set());

  const [expandedProgrammes, setExpandedProgrammes] =
    useState<Set<string>>(new Set());

  const buyerGroups = useMemo<BuyerGroup[]>(() => {
    const buyerMap = new Map<string, Map<string, Order[]>>();

    for (const order of orders) {
      const buyerName = order.buyer ?? "No Buyer";
      const programmeName =
        order.programme ?? "No Programme";

      if (!buyerMap.has(buyerName)) {
        buyerMap.set(buyerName, new Map());
      }

      const programmeMap = buyerMap.get(buyerName)!;

      if (!programmeMap.has(programmeName)) {
        programmeMap.set(programmeName, []);
      }

      programmeMap.get(programmeName)!.push(order);
    }

    return Array.from(buyerMap.entries()).map(
      ([buyerName, programmeMap]) => ({
        name: buyerName,
        programmes: Array.from(
          programmeMap.entries()
        ).map(([programmeName, programmeOrders]) => ({
          name: programmeName,
          orders: programmeOrders,
        })),
      })
    );
  }, [orders]);

  function toggleBuyer(buyerName: string) {
    setExpandedBuyers((current) => {
      const next = new Set(current);

      if (next.has(buyerName)) {
        next.delete(buyerName);
      } else {
        next.add(buyerName);
      }

      return next;
    });
  }

  function toggleProgramme(
    buyerName: string,
    programmeName: string
  ) {
    const key = `${buyerName}::${programmeName}`;

    setExpandedProgrammes((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  function getProgrammeTotal(orders: Order[]) {
    return orders.reduce(
      (total, order) => ({
        actual:
          total.actual +
          (order.totalActualValue ?? 0),

        factory:
          total.factory +
          (order.totalFactoryValue ?? 0),
      }),
      {
        actual: 0,
        factory: 0,
      }
    );
  }

  function getBuyerTotal(programmes: ProgrammeGroup[]) {
    return programmes.reduce(
      (total, programme) => {
        const programmeTotal = getProgrammeTotal(
          programme.orders
        );

        return {
          actual:
            total.actual + programmeTotal.actual,

          factory:
            total.factory + programmeTotal.factory,
        };
      },
      {
        actual: 0,
        factory: 0,
      }
    );
  }

  const grandTotal = buyerGroups.reduce(
    (total, buyer) => {
      const buyerTotal = getBuyerTotal(
        buyer.programmes
      );

      return {
        actual: total.actual + buyerTotal.actual,
        factory: total.factory + buyerTotal.factory,
      };
    },
    {
      actual: 0,
      factory: 0,
    }
  );

  return (
    <div className="space-y-4">
      {buyerGroups.length === 0 ? (
        <div className="rounded-lg border bg-background px-6 py-12 text-center text-muted-foreground">
          No orders found.
        </div>
      ) : (
        buyerGroups.map((buyer) => {
          const buyerExpanded = expandedBuyers.has(
            buyer.name
          );

          const buyerTotal = getBuyerTotal(
            buyer.programmes
          );

          return (
            <div
              key={buyer.name}
              className="overflow-hidden rounded-lg border bg-background"
            >
              {/* Buyer Header */}
              <button
                type="button"
                onClick={() => toggleBuyer(buyer.name)}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  {buyerExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}

                  <span className="text-lg font-semibold">
                    {buyer.name}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    ({buyer.programmes.length} programme
                    {buyer.programmes.length !== 1
                      ? "s"
                      : ""}
                    )
                  </span>
                </div>

                <div className="text-right text-sm">
                  <div>
                    Actual:{" "}
                    <span className="font-semibold">
                      ৳ {formatMoney(buyerTotal.actual)}
                    </span>
                  </div>

                  <div>
                    Factory:{" "}
                    <span className="font-semibold">
                      ৳ {formatMoney(buyerTotal.factory)}
                    </span>
                  </div>
                </div>
              </button>

              {/* Buyer Content */}
              {buyerExpanded && (
                <div className="border-t">
                  {buyer.programmes.map((programme) => {
                    const programmeKey = `${buyer.name}::${programme.name}`;

                    const programmeExpanded =
                      expandedProgrammes.has(
                        programmeKey
                      );

                    const programmeTotal =
                      getProgrammeTotal(
                        programme.orders
                      );

                    return (
                      <div
                        key={programmeKey}
                        className="border-b last:border-b-0"
                      >
                        {/* Programme Header */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleProgramme(
                              buyer.name,
                              programme.name
                            )
                          }
                          className="flex w-full cursor-pointer items-center justify-between bg-muted/20 px-6 py-3 text-left transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-center gap-2">
                            {programmeExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}

                            <span className="font-medium">
                              {programme.name}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              ({programme.orders.length}{" "}
                              order
                              {programme.orders.length !==
                              1
                                ? "s"
                                : ""}
                              )
                            </span>
                          </div>

                          <div className="flex gap-6 text-sm">
                            <span>
                              Actual:{" "}
                              <strong>
                                ৳{" "}
                                {formatMoney(
                                  programmeTotal.actual
                                )}
                              </strong>
                            </span>

                            <span>
                              Factory:{" "}
                              <strong>
                                ৳{" "}
                                {formatMoney(
                                  programmeTotal.factory
                                )}
                              </strong>
                            </span>
                          </div>
                        </button>

                        {/* Programme Orders */}
                        {programmeExpanded && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead className="border-t border-b bg-muted/10">
                                <tr className="text-left">
                                  <th className="whitespace-nowrap px-4 py-3 text-slate-700">
                                    PO
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-slate-600">
                                    Style
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3">
                                    Color
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3">
                                    Factory
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-right">
                                    Qty Set
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-right">
                                    Qty Piece
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-right">
                                    Actual Price
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-right">
                                    Factory Price
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-right">
                                    Actual Value
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-right">
                                    Factory Value
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3">
                                    Ship Date
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3">
                                    Status
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 text-right">
                                    Actions
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="divide-y">
                                {programme.orders.map(
                                  (order) => (
                                    <tr
                                      key={order.id}
                                      className="hover:bg-muted/20"
                                    >
                                      <td className="whitespace-nowrap px-4 py-3">
                                        {order.poNumber ??
                                          "—"}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 font-medium">
                                        {
                                          order.styleNumber
                                        }
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3">
                                        {order.color}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3">
                                        {order.factory ??
                                          "—"}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 text-right">
                                        {order.qtySet ??
                                          "—"}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 text-right">
                                        {order.qtyPiece ??
                                          "—"}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 text-right">
                                        {formatMoney(
                                          order.actualPrice
                                        )}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 text-right">
                                        {formatMoney(
                                          order.factoryPrice
                                        )}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 text-right">
                                        ৳{" "}
                                        {formatMoney(
                                          order.totalActualValue
                                        )}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 text-right">
                                        ৳{" "}
                                        {formatMoney(
                                          order.totalFactoryValue
                                        )}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3">
                                        {formatDate(
                                          order.shipDate
                                        )}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3">
                                        {order.status}
                                      </td>

                                      <td className="whitespace-nowrap px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                          <Link
                                            href={`/orders/${order.id}`}
                                            className="cursor-pointer rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                                          >
                                            View
                                          </Link>

                                          <Link
                                            href={`/orders/${order.id}/edit`}
                                            className="cursor-pointer rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                                          >
                                            Edit
                                          </Link>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>

                              {/* Programme Total */}
                              <tfoot>
                                <tr className="border-t bg-muted/30 font-semibold">
                                  <td
                                    colSpan={8}
                                    className="px-4 py-3 text-right"
                                  >
                                    {programme.name} Total
                                  </td>

                                  <td className="whitespace-nowrap px-4 py-3 text-right">
                                    ৳{" "}
                                    {formatMoney(
                                      programmeTotal.actual
                                    )}
                                  </td>

                                  <td className="whitespace-nowrap px-4 py-3 text-right">
                                    ৳{" "}
                                    {formatMoney(
                                      programmeTotal.factory
                                    )}
                                  </td>

                                  <td
                                    colSpan={3}
                                  />
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Buyer Total */}
                  <div className="flex items-center justify-end gap-8 bg-muted/40 px-6 py-4 text-sm">
                    <span className="font-semibold">
                      {buyer.name} Total
                    </span>

                    <span>
                      Actual:{" "}
                      <strong>
                        ৳ {formatMoney(buyerTotal.actual)}
                      </strong>
                    </span>

                    <span>
                      Factory:{" "}
                      <strong>
                        ৳ {formatMoney(buyerTotal.factory)}
                      </strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Grand Total */}
      {buyerGroups.length > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-8 rounded-lg border bg-background px-6 py-5">
          <span className="text-lg font-bold">
            All Buyers Total
          </span>

          <span className="text-sm">
            Actual:{" "}
            <strong className="text-base">
              ৳ {formatMoney(grandTotal.actual)}
            </strong>
          </span>

          <span className="text-sm">
            Factory:{" "}
            <strong className="text-base">
              ৳ {formatMoney(grandTotal.factory)}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}