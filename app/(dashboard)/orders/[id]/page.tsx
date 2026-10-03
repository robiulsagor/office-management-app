import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  Package,
  ShoppingBag,
} from "lucide-react";

import { getOrderById } from "@/actions/order/get-order-by-id";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatValue(value: number | null | undefined) {
  if (value == null) return "—";

  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default" as const;

    case "CANCELLED":
      return "destructive" as const;

    default:
      return "secondary" as const;
  }
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getFactoryShortName(factory: string | null) {
  if (!factory) return "—";

  return factory.trim().split(/\s+/)[0] || "—";
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="break-words text-sm font-medium">{value ?? "—"}</div>
    </div>
  );
}

export default async function ViewOrderPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getOrderById(id);

  if (!result.success || !result.order) {
    notFound();
  }

  const order = result.order;

  // Prefer the PO directly assigned to this order.
  // If absent, use the Style's associated POs.
  const purchaseOrders = order.style.purchaseOrders.map(
    (item) => item.purchaseOrder,
  );

  const displayPurchaseOrders =
    order.purchaseOrder &&
    !purchaseOrders.some((po) => po.id === order.purchaseOrder?.id)
      ? [order.purchaseOrder, ...purchaseOrders]
      : purchaseOrders;

  const primaryPurchaseOrder = order.purchaseOrder ?? purchaseOrders[0] ?? null;

  const buyerName = primaryPurchaseOrder?.programme.buyer.name ?? "—";

  const programmeName = primaryPurchaseOrder?.programme.name ?? "—";

  const poNumbers = displayPurchaseOrders
    .map((po) => po.poNumber)
    .filter(Boolean);

  const quantitySet = order.qtySet ?? null;
  const quantityPiece = order.qtyPiece ?? null;

  return (
    <div className="min-h-screen space-y-6 bg-muted/40 p-4 md:p-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Link
            href="/orders"
            aria-label="Back to orders"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View complete information about this order.
            </p>
          </div>
        </div>

        <Link
          href={`/orders/${order.id}/edit`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Order
        </Link>
      </div>

      {/* Order summary */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {order.style.styleNumber}
            </CardTitle>

            <p className="mt-2 text-sm text-muted-foreground">
              Color: {order.style.color || "—"}
            </p>
          </div>

          <Badge variant={getStatusVariant(order.status)}>
            {formatStatus(order.status)}
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Buyer" value={buyerName} />
            <Detail label="Programme" value={programmeName} />
            <Detail
              label="Purchase Order(s)"
              value={poNumbers.length ? poNumbers.join(", ") : "—"}
            />
            <Detail label="Factory" value={order.factory || "—"} />
          </div>
        </CardContent>
      </Card>

      {/* Order information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Order Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Style Number" value={order.style.styleNumber} />

            <Detail label="Color" value={order.style.color} />

            <Detail label="Factory" value={order.factory || "—"} />

            <Detail label="Quantity (Set)" value={formatValue(quantitySet)} />

            <Detail
              label="Quantity (Piece)"
              value={formatValue(quantityPiece)}
            />

            <Detail
              label="Ship Date"
              value={
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {formatDate(order.shipDate)}
                </span>
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <Detail
              label="Actual Price"
              value={formatValue(order.actualPrice)}
            />

            <Detail
              label="Factory Price"
              value={formatValue(order.factoryPrice)}
            />

            <Detail
              label="Total Actual Value"
              value={formatValue(order.totalActualValue)}
            />

            <Detail
              label="Total Factory Value"
              value={formatValue(order.totalFactoryValue)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <Detail
              label="Status"
              value={
                <Badge variant={getStatusVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              }
            />

            <Detail label="Created At" value={formatDate(order.createdAt)} />

            <Detail label="Last Updated" value={formatDate(order.updatedAt)} />

            <Detail
              label="Remarks"
              value={
                order.remarks?.trim() ? (
                  <span className="whitespace-pre-wrap font-normal">
                    {order.remarks}
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href="/orders"
          className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>

        <Link
          href={`/orders/${order.id}/edit`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Order
        </Link>
      </div>
    </div>
  );
}
