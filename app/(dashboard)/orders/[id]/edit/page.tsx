import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrderById } from "@/actions/order/get-order-by-id";
import OrderForm from "@/components/orders/order-form";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderById(id);

  if (!result.success || !result.order) notFound();

  const order = result.order;
  const initialValues = {
    buyerId: order.style.programme.buyerId,
    programmeId: order.style.programmeId,
    purchaseOrderIds: order.style.purchaseOrders.map(
      ({ purchaseOrder }) => purchaseOrder.id,
    ),
    styleNumber: order.style.styleNumber,
    color: order.style.color,
    factory: order.factory ?? "",
    qtySet: order.qtySet ?? undefined,
    qtyPiece: order.qtyPiece ?? undefined,
    actualPrice: order.actualPrice ?? undefined,
    factoryPrice: order.factoryPrice ?? undefined,
    shipDate: order.shipDate
      ? new Date(order.shipDate).toISOString().slice(0, 10)
      : "",
    status: order.status,
    remarks: order.remarks ?? "",
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit Order</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the order details. Changes will be recorded in the order
            history.
          </p>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </Link>
      </div>

      <OrderForm mode="edit" orderId={order.id} initialValues={initialValues} />
    </main>
  );
}
