import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getExpenses } from "@/actions/expenses/get-expenses";

type ExpenseListProps = {
  month: string;
};

export default async function ExpenseList({
  month,
}: ExpenseListProps) {
  const result = await getExpenses(month);

  if (!result.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {result.message || "Failed to load expenses."}
      </div>
    );
  }

  const expenses = result.data;

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Total Expense
        </p>

        <p className="mt-1 text-2xl font-semibold">
          ৳{totalExpense.toLocaleString("en-BD")}
        </p>
      </div>

      {expenses.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No expenses found for this month.
          </p>
        </div>
      )}

      {expenses.length > 0 && (
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
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Date(
                        expense.date,
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-4 py-3">
                      {expense.categoryName}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.description || "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                      ৳
                      {expense.amount.toLocaleString("en-BD")}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Edit expense"
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Delete expense"
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
      )}
    </div>
  );
}