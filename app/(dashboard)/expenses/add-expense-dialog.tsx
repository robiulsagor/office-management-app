"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ExpenseForm from "@/components/expenses/expense-form";

export default function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer rounded bg-black px-2 py-1 font-bold text-white hover:bg-slate-800 text-sm pl-2 md:pl-0">
        Add Expense
      </DialogTrigger>

      <DialogContent
        className="
         w-[95vw] md:w-[60vw]! max-w-275!
          h-[90dvh] md:h-[80dvh]! max-h-[90dvh]! 
          overflow-hidden
          flex flex-col
          gap-0
          p-6
        "
      >
        <DialogHeader className="shrink-0 pb-5">
          <DialogTitle className="text-lg font-semibold">
            Add Expense
          </DialogTitle>
          <DialogDescription>
            Add a new company expense.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ExpenseForm
            onSuccess={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
