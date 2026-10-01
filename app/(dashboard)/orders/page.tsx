import Link from "next/link";

import { getOrders } from "@/actions/order/get-orders";
import OrdersView from "@/components/orders/orders-view";

export default async function OrdersPage() {
  const result = await getOrders();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-muted/40">
        <div>
          <h1 className="mb-4 text-2xl font-semibold">
            Orders
          </h1>

          <div className="rounded-lg border bg-background p-6 text-sm text-red-500">
            {result.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      hello
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Orders
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and view all orders.
            </p>
          </div>

          <Link
            href="/orders/create"
            className="inline-flex h-10 cursor-pointer items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Order
          </Link>
        </div>

        <OrdersView orders={result.orders} />
      </div>
    </div>
  );
}