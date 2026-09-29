"use client";

import { useMemo, useState } from "react";

import { Plus, Printer, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ConveyanceEmployee, ConveyanceEntry } from "@/types/conveyance";

import ConveyanceEmployeeSelector from "./conveyance-employee-selector";
import ConveyanceTable from "./conveyance-table";
import ConveyanceFormDialog from "./conveyance-form-dialog";
import ConveyanceMonthSelector from "./conveyance-month-selector";
import { createConveyance } from "@/actions/conveyance/create-conveyance";
import { updateConveyance } from "@/actions/conveyance/update-conveyance";
import { deleteConveyance } from "@/actions/conveyance/delete-conveyance";

type ConveyancePageProps = {
  month: string;
  employees: ConveyanceEmployee[];
  initialEntries: ConveyanceEntry[];
};

const getMonthDate = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Date(year, monthNumber - 1, 1);
};

const ConveyancePage = ({
  month,
  employees,
  initialEntries,
}: ConveyancePageProps) => {
  const selectedMonth = useMemo(() => getMonthDate(month), [month]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    employees[0]?.id ?? "",
  );

  const [entries, setEntries] = useState<ConveyanceEntry[]>(initialEntries);

  const [formOpen, setFormOpen] = useState(false);

  const [editingEntry, setEditingEntry] = useState<ConveyanceEntry | null>(
    null,
  );

  const selectedEmployee = employees.find(
    (employee) => employee.id === selectedEmployeeId,
  );

  const monthlyEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        const date = new Date(`${entry.date}T00:00:00`);

        return (
          date.getFullYear() === selectedMonth.getFullYear() &&
          date.getMonth() === selectedMonth.getMonth()
        );
      })
      .filter((entry) => entry.employeeId === selectedEmployeeId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [entries, selectedMonth, selectedEmployeeId]);

  const totalBill = useMemo(() => {
    return monthlyEntries.reduce((sum, entry) => sum + entry.bill, 0);
  }, [monthlyEntries]);

  const handleAdd = () => {
    setEditingEntry(null);
    setFormOpen(true);
  };

  const handleEdit = (entry: ConveyanceEntry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleSave = async (entry: ConveyanceEntry) => {
    if (editingEntry) {
      const result = await updateConveyance({
        id: entry.id,
        employeeId: entry.employeeId,
        date: entry.date,
        from: entry.from,
        to: entry.to,
        bill: entry.bill,
        remarks: entry.remarks,
      });

      if (!result.success || !result.data) {
        window.alert(result.message || "Failed to update conveyance.");
        return;
      }

      setEntries((prev) =>
        prev.map((item) => (item.id === result.data!.id ? result.data! : item)),
      );

      setEditingEntry(null);
      return;
    }

    const result = await createConveyance({
      employeeId: entry.employeeId,
      date: entry.date,
      from: entry.from,
      to: entry.to,
      bill: entry.bill,
      remarks: entry.remarks,
    });

    if (!result.success || !result.data) {
      window.alert(result.message || "Failed to add conveyance.");
      return;
    }

    setEntries((prev) => [...prev, result.data!]);

    setEditingEntry(null);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conveyance?",
    );

    if (!confirmed) {
      return;
    }

    const result = await deleteConveyance(id);

    if (!result.success) {
      window.alert(result.message || "Failed to delete conveyance.");
      return;
    }

    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handlePrint = () => {
    if (!selectedEmployee) return;

    sessionStorage.setItem(
      "conveyance-print-data",
      JSON.stringify({
        month,
        employee: selectedEmployee,
        entries: monthlyEntries,
      }),
    );

    window.open("/print/conveyance", "_blank");
  };

  const monthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (!selectedEmployee) {
    return <div className="p-10 text-center">No employee found.</div>;
  }

  return (
    <div className="mx-auto w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
            <ReceiptText className="size-5" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight md:text-2xl">
              Conveyance
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage employee conveyance expenses.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ConveyanceMonthSelector month={month} />

          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 size-4" />
            Print
          </Button>

          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handleAdd}
          >
            <Plus className="mr-2 size-4" />
            Add Conveyance
          </Button>
        </div>
      </div>

      {/* Employee Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Employees</CardTitle>

          <p className="text-sm text-muted-foreground">
            Select an employee to view their conveyance history.
          </p>
        </CardHeader>

        <CardContent>
          <ConveyanceEmployeeSelector
            employees={employees}
            selectedEmployeeId={selectedEmployeeId}
            onEmployeeChange={setSelectedEmployeeId}
          />
        </CardContent>
      </Card>

      {/* Selected Employee */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-bold">{selectedEmployee.name}</p>

              <p className="text-sm text-muted-foreground">
                {selectedEmployee.designation}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">{monthName}</p>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Total Trips</p>

                <p className="text-xl font-bold">{monthlyEntries.length}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Total Bill</p>

                <p className="text-xl font-bold">
                  ৳{totalBill.toLocaleString("en-BD")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conveyance History</CardTitle>

          <p className="text-sm text-muted-foreground">
            {monthlyEntries.length}{" "}
            {monthlyEntries.length === 1 ? "trip" : "trips"} recorded for{" "}
            {monthName}.
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {monthlyEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ReceiptText className="size-10 text-muted-foreground/40" />

              <p className="mt-3 font-medium">No conveyance data found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a conveyance entry for this employee.
              </p>
            </div>
          ) : (
            <ConveyanceTable
              entries={monthlyEntries}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Form */}
      <ConveyanceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        selectedEmployee={selectedEmployee}
        editingEntry={editingEntry}
        onSave={handleSave}
      />
    </div>
  );
};

export default ConveyancePage;
