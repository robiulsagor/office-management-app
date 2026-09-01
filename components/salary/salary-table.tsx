"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SalaryRecord } from "@/types/salary";

type SalaryTableProps = {
  records: SalaryRecord[];
  onEdit: (record: SalaryRecord) => void;
  onDelete: (record: SalaryRecord) => void;
};

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString("en-BD")}`;
};

const SalaryTable = ({ records, onEdit, onDelete }: SalaryTableProps) => {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="font-medium">No salary records found</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-225">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Employee</th>

            <th className="px-4 py-3">Department</th>

            <th className="px-4 py-3 text-right">Basic</th>

            <th className="px-4 py-3 text-right">Allowance</th>

            <th className="px-4 py-3 text-right">Deduction</th>

            <th className="px-4 py-3 text-right">Net Salary</th>

            <th className="px-4 py-3 text-center">Status</th>

            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b last:border-0 hover:bg-slate-50/70"
            >
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{record.employeeName}</p>

                  <p className="text-xs text-muted-foreground">
                    {record.designation}
                  </p>
                </div>
              </td>

              <td className="px-4 py-4 text-sm">{record.department}</td>

              <td className="px-4 py-4 text-right text-sm">
                {formatCurrency(record.basicSalary)}
              </td>

              <td className="px-4 py-4 text-right text-sm">
                {formatCurrency(record.allowances)}
              </td>

              <td className="px-4 py-4 text-right text-sm">
                {formatCurrency(record.deductions)}
              </td>

              <td className="px-4 py-4 text-right font-semibold">
                {formatCurrency(record.netSalary)}
              </td>

              <td className="px-4 py-4 text-center">
                <span
                  className={
                    record.status === "paid"
                      ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                      : "inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
                  }
                >
                  {record.status === "paid" ? "Paid" : "Pending"}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(record)}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(record)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryTable;
