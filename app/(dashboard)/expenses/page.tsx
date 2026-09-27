import { Metadata } from "next";
import AddExpenseDialog from "./add-expense-dialog";
import ExpenseList from "./expense-list";
import MonthSelector from "@/components/month-selector";

type ExpensesPageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Office Expenses",
  description: "Built with Love by Robiul islam Sagor",
};

export default async function ExpensesPage({
  searchParams,
}: ExpensesPageProps) {
  const params = await searchParams;

  const currentDate = new Date();

  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const month = params.month || currentMonth;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Expenses
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage office expenses.
          </p>
        </div>

        <AddExpenseDialog />
      </div>

      {/* Month Selector */}
      <div className="flex justify-center">
        <MonthSelector
          month={month}
          baseUrl="/expenses"
        />
      </div>

      {/* Expense List */}
      <ExpenseList month={month} />
    </div>
  );
}
