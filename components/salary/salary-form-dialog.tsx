"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  PaymentMethod,
  SalaryRecord,
  SalaryStatus,
} from "@/types/salary";

type SalaryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMonth: Date;
  editingRecord: SalaryRecord | null;
  onSave: (record: SalaryRecord) => void;
};

type EmployeeOption = {
  id: string;
  name: string;
  designation: string;
  department: string;
};

const employees: EmployeeOption[] = [
  {
    id: "emp-1",
    name: "Rahim Ahmed",
    designation: "Junior Merchandiser",
    department: "Merchandising",
  },
  {
    id: "emp-2",
    name: "Karim Hasan",
    designation: "Accountant",
    department: "Accounts",
  },
  {
    id: "emp-3",
    name: "Sakib Khan",
    designation: "Merchandiser",
    department: "Merchandising",
  },
  {
    id: "emp-4",
    name: "Nusrat Jahan",
    designation: "Admin Officer",
    department: "Admin",
  },
];

const SalaryFormDialog = ({
  open,
  onOpenChange,
  selectedMonth,
  editingRecord,
  onSave,
}: SalaryFormDialogProps) => {
  const [employeeId, setEmployeeId] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");
  const [status, setStatus] =
    useState<SalaryStatus>("pending");

  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | "">("");

  const [remarks, setRemarks] = useState("");

  const isEditing = Boolean(editingRecord);

  const selectedEmployee = employees.find(
    (employee) => employee.id === employeeId,
  );

  // --------------------------------------------------
  // Populate form
  // --------------------------------------------------

  useEffect(() => {
    if (!open) return;

    if (editingRecord) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmployeeId(editingRecord.employeeId);
      setBasicSalary(
        String(editingRecord.basicSalary),
      );
      setAllowances(
        String(editingRecord.allowances),
      );
      setDeductions(
        String(editingRecord.deductions),
      );
      setStatus(editingRecord.status);
      setPaymentDate(
        editingRecord.paymentDate ?? "",
      );
      setPaymentMethod(
        editingRecord.paymentMethod ?? "",
      );
      setRemarks(editingRecord.remarks);
    } else {
      setEmployeeId("");
      setBasicSalary("");
      setAllowances("");
      setDeductions("");
      setStatus("pending");
      setPaymentDate("");
      setPaymentMethod("");
      setRemarks("");
    }
  }, [open, editingRecord]);

  // --------------------------------------------------
  // Net salary
  // --------------------------------------------------

  const netSalary = useMemo(() => {
    const basic = Number(basicSalary) || 0;
    const allowance = Number(allowances) || 0;
    const deduction = Number(deductions) || 0;

    return basic + allowance - deduction;
  }, [basicSalary, allowances, deductions]);

  // --------------------------------------------------
  // Month
  // --------------------------------------------------

  const month = `${selectedMonth.getFullYear()}-${String(
    selectedMonth.getMonth() + 1,
  ).padStart(2, "0")}`;

  const monthName = selectedMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!employeeId) return;

    if (!selectedEmployee) return;

    const record: SalaryRecord = {
      id:
        editingRecord?.id ??
        crypto.randomUUID(),

      employeeId,

      employeeName: selectedEmployee.name,

      designation: selectedEmployee.designation,

      department: selectedEmployee.department,

      month,

      basicSalary: Number(basicSalary) || 0,

      allowances: Number(allowances) || 0,

      deductions: Number(deductions) || 0,

      netSalary,

      status,

      paymentDate:
        status === "paid"
          ? paymentDate || null
          : null,

      paymentMethod:
        status === "paid"
          ? paymentMethod || null
          : null,

      remarks,
    };

    onSave(record);

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Salary"
              : "Add Salary"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the salary information for this employee."
              : `Add salary information for ${monthName}.`}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Employee */}

          <div className="space-y-2">
            <Label>Employee</Label>

            <Select
              value={employeeId}
              onValueChange={(value) => {
                if (value !== null) {
                  setEmployeeId(value);
                }
              }}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>

              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name} —{" "}
                    {employee.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedEmployee && (
              <p className="text-xs text-muted-foreground">
                {selectedEmployee.department}
              </p>
            )}
          </div>

          {/* Salary */}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Basic Salary</Label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={basicSalary}
                onChange={(e) =>
                  setBasicSalary(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Allowances</Label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={allowances}
                onChange={(e) =>
                  setAllowances(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Deductions</Label>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={deductions}
                onChange={(e) =>
                  setDeductions(e.target.value)
                }
              />
            </div>
          </div>

          {/* Net Salary */}

          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Net Salary
              </span>

              <span className="text-2xl font-bold">
                ৳{netSalary.toLocaleString("en-BD")}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Basic + Allowances − Deductions
            </p>
          </div>

          {/* Payment Status */}

          <div className="space-y-2">
            <Label>Payment Status</Label>

            <Select
              value={status}
              onValueChange={(value) => {
                if (
                  value === "paid" ||
                  value === "pending"
                ) {
                  setStatus(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pending">
                  Pending
                </SelectItem>

                <SelectItem value="paid">
                  Paid
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment information */}

          {status === "paid" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Payment Date</Label>

                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) =>
                    setPaymentDate(e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>

                <Select
                  value={paymentMethod}
                  onValueChange={(value) => {
                    if (
                      value === "cash" ||
                      value === "bank" ||
                      value === "mobile_banking"
                    ) {
                      setPaymentMethod(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="cash">
                      Cash
                    </SelectItem>

                    <SelectItem value="bank">
                      Bank
                    </SelectItem>

                    <SelectItem value="mobile_banking">
                      Mobile Banking
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Remarks */}

          <div className="space-y-2">
            <Label>Remarks</Label>

            <Input
              placeholder="Optional remarks"
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isEditing
                ? "Save Changes"
                : "Add Salary"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryFormDialog;