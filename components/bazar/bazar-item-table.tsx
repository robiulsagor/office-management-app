import { BazarEntry } from "@/types/bazar";

type BazarItemTableProps = {
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

const BazarItemTable = ({
  entries,
}: BazarItemTableProps) => {
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
      <table className="w-full min-w-175">

        <thead>
          <tr className="border-y bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">

            <th className="px-6 py-3">
              Date
            </th>

            <th className="px-6 py-3">
              Items
            </th>

            <th className="px-6 py-3 text-right">
              Deposit
            </th>

            <th className="px-6 py-3 text-right">
              Expense
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
                className="align-top hover:bg-slate-50/70"
              >

                <td className="px-6 py-4 text-sm font-medium">
                  {formatDate(entry.date)}
                </td>

                <td className="px-6 py-4">

                  <div className="space-y-1.5">

                    {entry.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex max-w-sm justify-between gap-8 text-sm"
                      >
                        <span>
                          {item.name}
                        </span>

                        <span className="font-medium">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}

                  </div>

                </td>

                <td className="px-6 py-4 text-right text-sm text-emerald-700">
                  {formatCurrency(entry.deposit)}
                </td>

                <td className="px-6 py-4 text-right text-sm font-semibold text-orange-700">
                  {formatCurrency(expense)}
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

            <td className="px-6 py-4">
              {entries.reduce(
                (sum, entry) =>
                  sum + entry.items.length,
                0,
              )}{" "}
              items
            </td>

            <td className="px-6 py-4 text-right text-emerald-700">
              {formatCurrency(totalDeposit)}
            </td>

            <td className="px-6 py-4 text-right text-orange-700">
              {formatCurrency(totalExpense)}
            </td>

          </tr>
        </tfoot>

      </table>
    </div>
  );
};

export default BazarItemTable;