import MonthSelector from "@/components/month-selector";
import AddExpenseDialog from "./add-expense-dialog";
import ExpenseList from "./expense-list";

type ExpensesPageProps = { searchParams: Promise<{ month?: string }> };

export default async function ExpensesPage({
  searchParams,
}: ExpensesPageProps) {
  const params = await searchParams;
  const currentDate = new Date();

  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const month = params.month || currentMonth;

  console.log("ExpensesPage - month:", month);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>

          <p className="text-sm text-muted-foreground">
            Manage company expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <MonthSelector month={month} baseUrl={"/expenses"} />
          <AddExpenseDialog />
        </div>
      </div>

      {/* Expense list will come here */}

      <ExpenseList month={month} />
    </div>
  );
}
