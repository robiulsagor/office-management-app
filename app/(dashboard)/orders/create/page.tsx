import OrderForm from "@/components/orders/order-form";

export default function CreateOrderPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Create Order
      </h1>

      <OrderForm />
    </div>
  );
}