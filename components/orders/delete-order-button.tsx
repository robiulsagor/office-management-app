
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteOrder } from "@/actions/order/delete-order";
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
import toast from "react-hot-toast";

export default function DeleteOrderButton({
  orderId,
}: {
  orderId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) return;

    setError("");
    setIsDeleting(true);

    try {
      const result = await deleteOrder(orderId);

      if (!result.success) {
        setError(result.message || "Failed to delete order.");
        return;
      }

      setOpen(false);
      toast.success("Order deleted successfully.");
      router.replace("/orders");
      router.refresh();
    } catch (err) {
      console.error("Delete order failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Order
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isDeleting) setOpen(nextOpen);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this order?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This order will be removed from the active order list.
              Its version history, audit logs, and snapshots will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
