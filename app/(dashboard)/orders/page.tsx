import Link from "next/link";

import { getOrders } from "@/actions/order/get-orders";
import OrdersView from "@/components/orders/orders-view";

import { Metadata } from "next";
import { Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Orders - Office Management App",
};

export default async function OrdersPage() {
  const result = await getOrders();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-muted/40">
        <div>
          <h1 className="mb-4 text-2xl font-semibold">Orders</h1>

          <div className="rounded-lg border bg-background p-6 text-sm text-red-500">
            {result.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Orders</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and view all orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/orders/create"
              className="inline-flex h-10 cursor-pointer items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Order
            </Link>
          </div>

          <Link
            href="/orders/trash"
            className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deleted Orders
          </Link>
        </div>

        <OrdersView orders={result.orders} />
      </div>
    </div>
  );
}
