import { formatAmount } from "@/components/report/report-utils";

type ReportSummaryProps = {
  showBazar: boolean;
  showExpenses: boolean;
  showDeposits: boolean;
  totalExpenses: number;
  totalDeposits: number;
  remainingBalance: number;
};

export default function ReportSummary({
  showBazar,
  showExpenses,
  showDeposits,
  totalExpenses,
  totalDeposits,
  remainingBalance,
}: ReportSummaryProps) {
  const hasExpenseColumn = showBazar || showExpenses;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 print:grid-cols-3">
      {hasExpenseColumn && (
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Expenses</p>

          <p className="mt-2 text-2xl font-bold">
            {formatAmount(totalExpenses)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {[
              showBazar ? "Bazar" : null,
              showExpenses ? "Other Expenses" : null,
            ]
              .filter(Boolean)
              .join(" + ")}{" "}
            selected above
          </p>
        </div>
      )}

      {showDeposits && (
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Deposits</p>

          <p className="mt-2 text-2xl font-bold">
            {formatAmount(totalDeposits)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Selected month only
          </p>
        </div>
      )}

      {showDeposits && hasExpenseColumn && (
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Remaining Balance</p>

          <p
            className={`mt-2 text-2xl font-bold ${
              remainingBalance < 0 ? "text-destructive" : ""
            }`}
          >
            {formatAmount(remainingBalance)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Deposits − Expenses
          </p>
        </div>
      )}
    </section>
  );
}