
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

import { getDeletedOrders } from "@/actions/order/get-deleted-orders";
import DeletedOrdersTable from "@/components/orders/deleted-orders-table";

export default async function DeletedOrdersPage() {
  const result = await getDeletedOrders();

  return (
    <div className="min-h-screen space-y-6 bg-muted/40 p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background">
            <Trash2 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Deleted Orders
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View deleted orders and restore them when needed.
            </p>
          </div>
        </div>

       
<Link
  href="/orders"
  className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
>
  <ArrowLeft className="mr-2 h-4 w-4" />
  Back to Orders
</Link>

      </div>

      {!result.success ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-background p-4 text-sm text-destructive"
        >
          {result.message}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {result.orders.length} deleted{" "}
            {result.orders.length === 1 ? "order" : "orders"}
          </p>

          <DeletedOrdersTable orders={result.orders} />
        </>
      )}
    </div>
  );
}
