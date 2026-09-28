"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import ExpenseForm from "@/components/expenses/expense-form";

type EditExpenseDialogProps = {
  expense: {
    id: string;
    date: string;
    categoryId: string;
    amount: number;
    description?: string;
  };
};

export default function EditExpenseDialog({
  expense,
}: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
     <DialogTrigger>
  <Button
    type="button"
    variant="ghost"
    size="icon"
    title="Edit expense"
  >
    <Pencil className="size-4" />
  </Button>
</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>

          <DialogDescription>
            Update the expense details.
          </DialogDescription>
        </DialogHeader>

        <ExpenseForm
          mode="edit"
          expense={expense}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}