"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConveyanceEntry } from "@/types/conveyance";

type ConveyanceTableProps = {
  entries: ConveyanceEntry[];
  onEdit: (entry: ConveyanceEntry) => void;
  onDelete: (entry: ConveyanceEntry) => void;
};

const ConveyanceTable = ({
  entries,
  onEdit,
  onDelete,
}: ConveyanceTableProps) => {
  const totalBill = entries.reduce(
    (sum, entry) => sum + entry.bill,
    0,
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-175">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-sm">
            <th className="px-4 py-3 font-semibold">
              Date
            </th>

            <th className="px-4 py-3 font-semibold">
              From
            </th>

            <th className="px-4 py-3 font-semibold">
              To
            </th>

            <th className="px-4 py-3 text-right font-semibold">
              Bill
            </th>

            <th className="w-24 px-4 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-b last:border-b-0 hover:bg-slate-50/50"
            >
              <td className="px-4 py-3 text-sm">
                {entry.date}
              </td>

              <td className="px-4 py-3 text-sm">
                {entry.from}
              </td>

              <td className="px-4 py-3 text-sm">
                {entry.to}
              </td>

              <td className="px-4 py-3 text-right text-sm font-medium">
                ৳{entry.bill.toLocaleString("en-BD")}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(entry)}
                  >
                    <Pencil className="size-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(entry)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="bg-slate-50 font-semibold">
            <td
              colSpan={3}
              className="px-4 py-3 text-right"
            >
              Total
            </td>

            <td className="px-4 py-3 text-right">
              ৳{totalBill.toLocaleString("en-BD")}
            </td>

            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ConveyanceTable;
