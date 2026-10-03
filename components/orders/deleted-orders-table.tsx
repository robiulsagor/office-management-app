
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { restoreOrder } from "@/actions/order/restore-order";

export type DeletedOrder = {
  id: string;
  styleNumber: string;
  programmeName: string;
  buyerName: string;
  factory: string | null;
  status: string;
  deletedAt: string | null;
  deletedBy: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RestoreOrderButton({ order }: { order: DeletedOrder }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleRestore() {
    if (pending) return;

    setPending(true);
    setError("");

    try {
      const result = await restoreOrder(order.id);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Restore order UI error:", err);
      setError("Something went wrong while restoring this order.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Restore
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!pending) setOpen(nextOpen);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Order {order.styleNumber} will return to the active Orders list.
              Its existing history will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={pending}
              onClick={(event) => {
                event.preventDefault();
                void handleRestore();
              }}
            >
              {pending ? "Restoring..." : "Restore Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function DeletedOrdersTable({
  orders,
}: {
  orders: DeletedOrder[];
}) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
        <Trash2 className="h-10 w-10 text-muted-foreground" />
        <h2 className="font-medium">Trash is empty</h2>
        <p className="text-sm text-muted-foreground">
          Soft-deleted orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Style Number</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Factory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deleted By</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.styleNumber}
                </TableCell>
                <TableCell>{order.buyerName}</TableCell>
                <TableCell>{order.programmeName}</TableCell>
                <TableCell>{order.factory || "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {order.status.replaceAll("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{order.deletedBy}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(order.deletedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <RestoreOrderButton order={order} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
