import OrderForm from "@/components/orders/order-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateOrderPage() {
  return (
    <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center justify-between">
      <h1 className="mb-6 text-2xl font-semibold">Create Order</h1>

        <Link
          href="/orders"
          className="text-sm font-medium text-primary hover:underline flex items-center border rounded-lg p-2"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        </div>

      <OrderForm />
    </div>
  );
}
