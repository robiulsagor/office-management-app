"use client";

import { useState } from "react";

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

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  createEmployeeSchema,
  type CreateEmployeeFormData,
} from "./employee-schema";
import {
  createEmployee,
  updateEmployee,
} from "@/actions/employee/employee-actions";
import { Employee } from "@/types/employee";

type EmployeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeCreated?: () => void;
  editingEmployee?: Employee | null;
};

const emptyForm: CreateEmployeeFormData = {
  employeeId: "",
  name: "",
  designation: "",
  department: "",
  phone: "",
  email: "",
  joiningDate: "",
  salary: "",
  status: "ACTIVE",
  address: "",
  emergencyContact: "",
};

const EmployeeDialog = ({
  open,
  onOpenChange,
  onEmployeeCreated,
  editingEmployee,
}: EmployeeDialogProps) => {
 const [formData, setFormData] =
  useState<CreateEmployeeFormData>(() => {
    if (editingEmployee) {
      return {
        employeeId: editingEmployee.employeeCode,
        name: editingEmployee.name,
        designation: editingEmployee.designation,
        department: editingEmployee.department ?? "",
        phone: editingEmployee.phone ?? "",
        email: editingEmployee.email ?? "",
        joiningDate: editingEmployee.joiningDate.slice(0, 10),
        salary: editingEmployee.salary ?? "",
        status: editingEmployee.employmentStatus,
        address: editingEmployee.address ?? "",
        emergencyContact: editingEmployee.emergencyContact ?? "",
      };
    }

    return emptyForm;
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateEmployeeFormData, string>>
  >({});

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const updateField = (field: keyof CreateEmployeeFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setServerError("");

    const parsed = createEmployeeSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CreateEmployeeFormData, string>> =
        {};

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateEmployeeFormData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    const result = editingEmployee
      ? await updateEmployee(editingEmployee.id, parsed.data)
      : await createEmployee(parsed.data);

    if (!result.success) {
      setServerError(result.message);
      setSubmitting(false);
      return;
    }

    setFormData(emptyForm);
    setErrors({});
    setServerError("");
    setSubmitting(false);

    onOpenChange(false);
    onEmployeeCreated?.();
  };

  const handleDialogChange = (value: boolean) => {
    if (!value && !submitting) {
      setFormData(emptyForm);
      setErrors({});
      setServerError("");
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingEmployee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>

          <DialogDescription>
            {editingEmployee
              ? "Update the employee information."
              : "Enter the information for the new employee."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Basic Information</h3>

              <p className="text-xs text-muted-foreground">
                Employee identification and personal information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Employee ID */}

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>

                <Input
                  id="employeeId"
                  placeholder="e.g. ACS-006"
                  value={formData.employeeId}
                  onChange={(e) => updateField("employeeId", e.target.value)}
                  disabled={submitting}
                />

                {errors.employeeId && (
                  <p className="text-sm text-destructive">
                    {errors.employeeId}
                  </p>
                )}
              </div>

              {/* Name */}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <Input
                  id="name"
                  placeholder="Employee name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  disabled={submitting}
                />

                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Designation */}

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>

                <Input
                  id="designation"
                  placeholder="e.g. Merchandiser"
                  value={formData.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                  disabled={submitting}
                />

                {errors.designation && (
                  <p className="text-sm text-destructive">
                    {errors.designation}
                  </p>
                )}
              </div>

              {/* Department */}

              <div className="space-y-2">
                <Label>Department</Label>

                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    updateField("department", value ?? "")
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Management">Management</SelectItem>

                    <SelectItem value="Merchandising">Merchandising</SelectItem>

                    <SelectItem value="Quality">Quality</SelectItem>

                    <SelectItem value="Accounts">Accounts</SelectItem>

                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                {errors.department && (
                  <p className="text-sm text-destructive">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Contact Information</h3>

              <p className="text-xs text-muted-foreground">
                Employee contact and emergency information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Phone */}

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>

                <Input
                  id="phone"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  disabled={submitting}
                />

                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Email */}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="employee@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={submitting}
                />

                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Emergency Contact */}

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>

                <Input
                  id="emergencyContact"
                  placeholder="01XXXXXXXXX"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    updateField("emergencyContact", e.target.value)
                  }
                  disabled={submitting}
                />

                {errors.emergencyContact && (
                  <p className="text-sm text-destructive">
                    {errors.emergencyContact}
                  </p>
                )}
              </div>

              {/* Address */}

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>

                <Input
                  id="address"
                  placeholder="Employee address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  disabled={submitting}
                />

                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Job Information */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Job Information</h3>

              <p className="text-xs text-muted-foreground">
                Employment and salary information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Joining Date */}

              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>

                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => updateField("joiningDate", e.target.value)}
                  disabled={submitting}
                />

                {errors.joiningDate && (
                  <p className="text-sm text-destructive">
                    {errors.joiningDate}
                  </p>
                )}
              </div>

              {/* Salary */}

              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary</Label>

                <Input
                  id="salary"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.salary}
                  onChange={(e) => updateField("salary", e.target.value)}
                  disabled={submitting}
                />

                {errors.salary && (
                  <p className="text-sm text-destructive">{errors.salary}</p>
                )}
              </div>

              {/* Status */}

              <div className="space-y-2">
                <Label>Status</Label>

                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    updateField("status", value ?? "ACTIVE")
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>

                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>

                    <SelectItem value="RESIGNED">Resigned</SelectItem>

                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>

                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status}</p>
                )}
              </div>
            </div>
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={submitting}
            >
              {submitting
                ? editingEmployee
                  ? "Saving..."
                  : "Adding..."
                : editingEmployee
                  ? "Save Changes"
                  : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
