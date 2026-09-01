import { BazarEntry } from "@/types/bazar";

type BazarDayTableProps = {
  entries: BazarEntry[];
};

const formatCurrency = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-BD",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

const BazarDayTable = ({
  entries,
}: BazarDayTableProps) => {
  const totalDeposit = entries.reduce(
    (sum, entry) => sum + entry.deposit,
    0,
  );

  const totalExpense = entries.reduce(
    (sum, entry) =>
      sum +
      entry.items.reduce(
        (itemSum, item) => itemSum + item.price,
        0,
      ),
    0,
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160">

        <thead>
          <tr className="border-y bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-6 py-3">
              Date
            </th>

            <th className="px-6 py-3 text-right">
              Deposit
            </th>

            <th className="px-6 py-3 text-right">
              Expense
            </th>

            <th className="px-6 py-3 text-right">
              Balance
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">

          {entries.map((entry) => {
            const expense = entry.items.reduce(
              (sum, item) => sum + item.price,
              0,
            );

            return (
              <tr
                key={entry.id}
                className="hover:bg-slate-50/70"
              >
                <td className="px-6 py-4 text-sm font-medium">
                  {formatDate(entry.date)}
                </td>

                <td className="px-6 py-4 text-right text-sm text-emerald-700">
                  {formatCurrency(entry.deposit)}
                </td>

                <td className="px-6 py-4 text-right text-sm text-orange-700">
                  {formatCurrency(expense)}
                </td>

                <td className="px-6 py-4 text-right text-sm font-semibold">
                  {formatCurrency(
                    entry.deposit - expense,
                  )}
                </td>
              </tr>
            );
          })}

        </tbody>

        <tfoot>
          <tr className="border-t-2 bg-slate-50 font-bold">

            <td className="px-6 py-4">
              Total
            </td>

            <td className="px-6 py-4 text-right text-emerald-700">
              {formatCurrency(totalDeposit)}
            </td>

            <td className="px-6 py-4 text-right text-orange-700">
              {formatCurrency(totalExpense)}
            </td>

            <td className="px-6 py-4 text-right">
              {formatCurrency(
                totalDeposit - totalExpense,
              )}
            </td>

          </tr>
        </tfoot>

      </table>
    </div>
  );
};

export default BazarDayTable;