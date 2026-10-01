"use client";

import { useState } from "react";

import OrdersTable from "./orders-table";
import OrdersAlterTable from "./orders-alter-table";

type OrdersViewProps = {
  orders: React.ComponentProps<typeof OrdersTable>["orders"];
};

export default function OrdersView({
  orders,
}: OrdersViewProps) {
  const [view, setView] = useState<"normal" | "alter">(
    "normal"
  );

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          View:
        </span>

        <div className="flex rounded-md border bg-background p-1">
          <button
            type="button"
            onClick={() => setView("normal")}
            className={`cursor-pointer rounded px-3 py-1.5 text-sm transition-colors ${
              view === "normal"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Normal
          </button>

          <button
            type="button"
            onClick={() => setView("alter")}
            className={`cursor-pointer rounded px-3 py-1.5 text-sm transition-colors ${
              view === "alter"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Alter
          </button>
        </div>
      </div>

      {/* Selected View */}
      {view === "normal" ? (
        <OrdersTable orders={orders} />
      ) : (
        <OrdersAlterTable orders={orders} />
      )}
    </div>
  );
}