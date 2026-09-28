"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { deleteExpense } from "@/actions/expenses/delete-expense";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type DeleteExpenseDialogProps = {
  expense: {
    id: string;
    categoryName: string;
    amount: number;
  };
};

export default function DeleteExpenseDialog({
  expense,
}: DeleteExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteExpense(expense.id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete expense.");
        return;
      }

      toast.success("Expense deleted successfully!");

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Delete expense error:", error);

      toast.error("Something went wrong while deleting the expense.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Delete expense"
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Expense</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border bg-muted/30 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Category</span>

            <span className="font-medium">{expense.categoryName}</span>
          </div>

          <div className="mt-2 flex justify-between gap-4">
            <span className="text-muted-foreground">Amount</span>

            <span className="font-medium">
              ৳{expense.amount.toLocaleString("en-BD")}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
