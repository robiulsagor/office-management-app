"use client";

import MonthSelector from "@/components/month-selector";

type ReportFiltersProps = {
  month: string;
  showBazar: boolean;
  showExpenses: boolean;
  showDeposits: boolean;
  onShowBazarChange: (checked: boolean) => void;
  onShowExpensesChange: (checked: boolean) => void;
  onShowDepositsChange: (checked: boolean) => void;
};

export default function ReportFilters({
  month,
  showBazar,
  showExpenses,
  showDeposits,
  onShowBazarChange,
  onShowExpensesChange,
  onShowDepositsChange,
}: ReportFiltersProps) {
  return (
    <section className="rounded-xl border bg-card p-4 sm:p-5 print:hidden">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Report Month</p>

          <MonthSelector month={month} basePath="/report" />
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium">
            Select report data
          </legend>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showBazar}
                onChange={(event) =>
                  onShowBazarChange(event.target.checked)
                }
                className="size-4 accent-primary"
              />
              Bazar
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showExpenses}
                onChange={(event) =>
                  onShowExpensesChange(event.target.checked)
                }
                className="size-4 accent-primary"
              />
              Other Expenses
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showDeposits}
                onChange={(event) =>
                  onShowDepositsChange(event.target.checked)
                }
                className="size-4 accent-primary"
              />
              Deposits
            </label>
          </div>
        </fieldset>
      </div>
    </section>
  );
}