"use client";

import { useMemo, useState } from "react";
import { Banknote, Plus, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SalaryRecord } from "@/types/salary";

import SalaryMonthSelector from "./salary-month-selector";
import SalarySummary from "./salary-summary";
import SalaryTable from "./salary-table";
import SalaryFormDialog from "./salary-form-dialog";
import SalaryFilters from "./salary-filters";

type SalaryPageProps = {
  month: string;
};

const initialSalaryData: SalaryRecord[] = [
  {
    id: "salary-1",
    employeeId: "emp-1",
    employeeName: "Rahim Ahmed",
    designation: "Junior Merchandiser",
    department: "Merchandising",
    month: "2026-09",
    basicSalary: 18000,
    allowances: 3000,
    deductions: 500,
    netSalary: 20500,
    status: "paid",
    paymentDate: "2026-09-01",
    paymentMethod: "cash",
    remarks: "",
  },
  {
    id: "salary-2",
    employeeId: "emp-2",
    employeeName: "Karim Hasan",
    designation: "Accountant",
    department: "Accounts",
    month: "2026-09",
    basicSalary: 25000,
    allowances: 3000,
    deductions: 0,
    netSalary: 28000,
    status: "pending",
    paymentDate: null,
    paymentMethod: null,
    remarks: "",
  },
  {
    id: "salary-3",
    employeeId: "emp-3",
    employeeName: "Sakib Khan",
    designation: "Merchandiser",
    department: "Merchandising",
    month: "2026-09",
    basicSalary: 22000,
    allowances: 2500,
    deductions: 1000,
    netSalary: 23500,
    status: "paid",
    paymentDate: "2026-09-01",
    paymentMethod: "bank",
    remarks: "",
  },
];

const SalaryPage = ({ month }: SalaryPageProps) => {
  const selectedMonth = useMemo(() => {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Date(year, monthNumber - 1, 1);
}, [month]);

  const [records, setRecords] =
    useState<SalaryRecord[]>(initialSalaryData);

  const [formOpen, setFormOpen] = useState(false);

  const [editingRecord, setEditingRecord] =
    useState<SalaryRecord | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<"all" | "paid" | "pending">("all");

  const [departmentFilter, setDepartmentFilter] =
    useState("all");

  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // Selected month
  // --------------------------------------------------

const selectedMonthString = month;

  // --------------------------------------------------
  // Filter records
  // --------------------------------------------------

const monthlyRecords = useMemo(() => {
  return records
    .filter((record) => record.month === selectedMonthString)
    .filter((record) => {
      if (statusFilter === "all") return true;
      return record.status === statusFilter;
    })
    .filter((record) => {
      if (departmentFilter === "all") return true;
      return record.department === departmentFilter;
    })
    .filter((record) => {
      if (!search.trim()) return true;

      const query = search.toLowerCase();

      return (
        record.employeeName.toLowerCase().includes(query) ||
        record.designation.toLowerCase().includes(query)
      );
    })
    .sort((a, b) =>
      a.employeeName.localeCompare(b.employeeName),
    );
}, [
  records,
  selectedMonthString,
  statusFilter,
  departmentFilter,
  search,
]);

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const totalSalary = useMemo(() => {
    return monthlyRecords.reduce(
      (sum, record) => sum + record.netSalary,
      0,
    );
  }, [monthlyRecords]);

  const totalPaid = useMemo(() => {
    return monthlyRecords
      .filter((record) => record.status === "paid")
      .reduce((sum, record) => sum + record.netSalary, 0);
  }, [monthlyRecords]);

  const totalPending = useMemo(() => {
    return monthlyRecords
      .filter((record) => record.status === "pending")
      .reduce((sum, record) => sum + record.netSalary, 0);
  }, [monthlyRecords]);

  // --------------------------------------------------
  // Add / Edit
  // --------------------------------------------------

  const handleEdit = (record: SalaryRecord) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleSave = (record: SalaryRecord) => {
    setRecords((prev) => {
      const exists = prev.some(
        (item) => item.id === record.id,
      );

      if (exists) {
        return prev.map((item) =>
          item.id === record.id ? record : item,
        );
      }

      return [...prev, record];
    });

    setEditingRecord(null);
  };

  const handleDelete = (record: SalaryRecord) => {
    const confirmed = window.confirm(
      `Delete salary record for ${record.employeeName}?`,
    );

    if (!confirmed) return;

    setRecords((prev) =>
      prev.filter((item) => item.id !== record.id),
    );
  };

  // --------------------------------------------------
  // Print
  // --------------------------------------------------

  const handlePrint = () => {
    sessionStorage.setItem(
      "salary-print-data",
      JSON.stringify({
        month: selectedMonthString,
        records: monthlyRecords,
      }),
    );

    window.open("/print/salary", "_blank");
  };

  return (
    <div className="mx-auto w-full space-y-6 pb-10">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
            <Banknote className="size-5" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight md:text-2xl">
              Salary
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage monthly employee salaries and payments.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
         <SalaryMonthSelector month={month} />

          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="mr-2 size-4" />
            Print
          </Button>

          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => {
              setEditingRecord(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Add Salary
          </Button>
        </div>
      </div>

      {/* Summary */}

      <SalarySummary
        totalSalary={totalSalary}
        totalPaid={totalPaid}
        totalPending={totalPending}
        employeeCount={monthlyRecords.length}
      />

      {/* Table */}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">
              Salary History
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {monthlyRecords.length}{" "}
              {monthlyRecords.length === 1
                ? "employee"
                : "employees"}{" "}
              recorded for this month.
            </p>
          </div>

          <SalaryFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            department={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
          />
        </CardHeader>

        <CardContent className="p-0">
          <SalaryTable
            records={monthlyRecords}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Form */}

      <SalaryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        selectedMonth={selectedMonth}
        editingRecord={editingRecord}
        onSave={handleSave}
      />
    </div>
  );
};

export default SalaryPage;