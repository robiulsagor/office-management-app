"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ExpenseForm from "@/components/expenses/expense-form";
import { useRouter } from "next/navigation";

export default function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 rounded cursor-pointer">
          Add Expense
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>

          <DialogDescription>Add a new company expense.</DialogDescription>
        </DialogHeader>

        <ExpenseForm onSuccess={() => {
          setOpen(false);
         router.refresh();
        }} />
      </DialogContent>
    </Dialog>
  );
}
