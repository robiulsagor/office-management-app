import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import { format } from "date-fns";

type RecentExpense = {
  id: string;
  date: Date;
  categoryName: string;
  amount: number;
  description: string | null;
};

type RecentExpensesProps = {
  expenses: RecentExpense[];
};

const RecentExpenses = ({ expenses }: RecentExpensesProps) => {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-semibold">Recent Expenses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest expenses from this month
          </p>
        </div>

        <Link
          href="/expenses"
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="divide-y">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <Receipt className="mb-3 size-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">No expenses yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              No expenses have been recorded this month.
            </p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Receipt className="size-4 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {expense.categoryName}
                </p>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {expense.description || "No description"} ·{" "}
                  {format(expense.date, "dd MMM yyyy")}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold">
                ৳{expense.amount.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;