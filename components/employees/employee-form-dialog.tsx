import { Employee, EmployeeFormData } from "@/types/employee";
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

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


// --------------------------------------------------
// Empty Form
// --------------------------------------------------

const emptyForm: EmployeeFormData = {
  employeeId: "",
  name: "",
  designation: "",
  department: "",
  phone: "",
  email: "",
  joiningDate: "",
  salary: "",
  status: "Active",
  address: "",
  emergencyContact: "",
};

type EmployeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (data: EmployeeFormData) => void;
};

const EmployeeDialog = ({
  open,
  onOpenChange,
  employee,
  onSave,
}: EmployeeDialogProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>(
    employee
      ? {
          employeeId: employee.employeeId,
          name: employee.name,
          designation: employee.designation,
          department: employee.department,
          phone: employee.phone,
          email: employee.email,
          joiningDate: employee.joiningDate,
          salary: employee.salary,
          status: employee.status,
          address: employee.address,
          emergencyContact: employee.emergencyContact,
        }
      : emptyForm,
  );

  const updateField = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;
    if (!formData.employeeId.trim()) return;

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>

          <DialogDescription>
            {employee
              ? "Update the employee information below."
              : "Enter the information for the new employee."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --------------------------------------- */}
          {/* Basic Information */}
          {/* --------------------------------------- */}

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
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <Input
                  id="name"
                  placeholder="Employee name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>

                <Input
                  id="designation"
                  placeholder="e.g. Merchandiser"
                  value={formData.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label>Department</Label>

                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    updateField("department", value ?? "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Management">Management</SelectItem>

                    <SelectItem value="Merchandising">Merchandising</SelectItem>

                    <SelectItem value="Accounts">Accounts</SelectItem>

                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* Contact Information */}
          {/* --------------------------------------- */}

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
                />
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
                />
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
                />
              </div>

              {/* Address */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>

                <Input
                  id="address"
                  placeholder="Employee address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* Job Information */}
          {/* --------------------------------------- */}

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
                />
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
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>

                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    updateField("status", value as "Active" | "Inactive")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>

                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              {employee ? "Save Changes" : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;