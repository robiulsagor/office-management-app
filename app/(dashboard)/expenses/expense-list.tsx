
"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Expense = {
  id: string;
  date: string;
  categoryName: string;
  description?: string;
  amount: number;
};

const dummyExpenses: Expense[] = [
  {
    id: "1",
    date: "2026-09-27",
    categoryName: "Office Supplies",
    description: "Printer paper",
    amount: 400,
  },
  {
    id: "2",
    date: "2026-09-25",
    categoryName: "Office Supplies",
    description: "Printer ink",
    amount: 850,
  },
  {
    id: "3",
    date: "2026-09-23",
    categoryName: "Maintenance",
    description: "Office light replacement",
    amount: 500,
  },
  {
    id: "4",
    date: "2026-09-20",
    categoryName: "Transport",
    description: "Courier expense",
    amount: 350,
  },
  {
    id: "5",
    date: "2026-09-18",
    categoryName: "Internet",
    description: "Monthly internet bill",
    amount: 1200,
  },
];

type ExpenseListProps = {
  month: string;
};

export default function ExpenseList({
  month,
}: ExpenseListProps) {
  const totalExpense = dummyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Total Expense
        </p>

        <p className="mt-1 text-2xl font-semibold">
          ৳{totalExpense.toLocaleString("en-BD")}
        </p>
      </div>

      {/* Expense Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Date
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Category
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Description
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Amount
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {dummyExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-muted/30"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(expense.date).toLocaleDateString(
                      "en-GB",
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {expense.categoryName}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {expense.description || "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                    ৳{expense.amount.toLocaleString("en-BD")}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Edit expense"
                        onClick={() =>
                          console.log(
                            "Edit expense:",
                            expense.id,
                          )
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Delete expense"
                        onClick={() =>
                          console.log(
                            "Delete expense:",
                            expense.id,
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
