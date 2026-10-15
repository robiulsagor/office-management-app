
import { getExpenses } from "@/actions/expenses/get-expenses";
import EditExpenseDialog from "@/components/expenses/edit-expense-dialog";
import DeleteExpenseDialog from "./delete-expense-dialog";

type ExpenseListProps = {
  month: string;
};

export default async function ExpenseList({ month }: ExpenseListProps) {
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

  const groupedExpenses = expenses.reduce<
    Record<string, typeof expenses>
  >((groups, expense) => {
    if (!groups[expense.date]) groups[expense.date] = [];
    groups[expense.date].push(expense);
    return groups;
  }, {});

  const groupedDates = Object.keys(groupedExpenses).sort((a, b) =>
    b.localeCompare(a),
  );

  const formatMoney = (amount: number) =>
    `৳${amount.toLocaleString("en-BD")}`;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">Monthly Total Expense</p>
        <p className="mt-1 text-2xl font-semibold">
          {formatMoney(totalExpense)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {expenses.length} expense item(s)
        </p>
      </div>

      {expenses.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No expenses found for this month.
          </p>
        </div>
      )}

      {groupedDates.map((date) => {
        const dayExpenses = groupedExpenses[date];
        const dailyTotal = dayExpenses.reduce(
          (total, expense) => total + expense.amount,
          0,
        );

        return (
          <section key={date} className="overflow-hidden rounded-lg border">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/50 px-4 py-3">
              <div>
                <h3 className="font-semibold">
                  {new Date(`${date}T12:00:00`).toLocaleDateString("en-GB")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {dayExpenses.length} item(s)
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Daily Total</p>
                <p className="font-semibold">{formatMoney(dailyTotal)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
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
                  {dayExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">{expense.categoryName}</td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {expense.description || "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                        {formatMoney(expense.amount)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <EditExpenseDialog
                            expense={{
                              id: expense.id,
                              date: expense.date,
                              categoryId: expense.categoryId,
                              amount: expense.amount,
                              description: expense.description,
                            }}
                          />

                          <DeleteExpenseDialog
                            expense={{
                              id: expense.id,
                              categoryName: expense.categoryName,
                              amount: expense.amount,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
