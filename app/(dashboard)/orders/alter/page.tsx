import Link from "next/link";

import { getOrders } from "@/actions/order/get-orders";
import OrdersAlterTable from "@/components/orders/orders-alter-table";

export default async function OrdersAlterPage() {
  const result = await getOrders();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-muted/40 px-6 py-8">
        <div className="mx-auto max-w-[1800px]">
          <h1 className="mb-4 text-2xl font-semibold">
            Orders Report
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
      <div className="mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Orders Report
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Detailed order and value report.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/orders"
              className="inline-flex h-10 cursor-pointer items-center rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Orders
            </Link>

            <Link
              href="/orders/create"
              className="inline-flex h-10 cursor-pointer items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Order
            </Link>
          </div>
        </div>

        <OrdersAlterTable orders={result.orders} />
      </div>
    </div>
  );
}