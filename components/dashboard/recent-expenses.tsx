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

const RecentExpenses = ({
  expenses,
}: RecentExpensesProps) => {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-semibold">Recent Expenses</h2>
        <p className="text-sm text-muted-foreground">
          Latest expenses from this month
        </p>
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
                <p className="font-medium">
                  {expense.categoryName}
                </p>

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