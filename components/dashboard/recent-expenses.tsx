import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
  const monthName = format(new Date(), "MMMM yyyy");

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-semibold">Recent Expenses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest expenses for {monthName}
          </p>
        </div>

        <Link
          href="/expenses"
          className="flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="divide-y">
        {expenses.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No expenses found for this month.
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <p className="font-medium">{expense.categoryName}</p>

                <p className="truncate text-sm text-muted-foreground">
                  {expense.description || "No description"} ·{" "}
                  {format(expense.date, "dd MMM yyyy")}
                </p>
              </div>

              <p className="shrink-0 font-semibold">
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
