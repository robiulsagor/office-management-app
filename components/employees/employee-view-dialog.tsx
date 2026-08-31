import { Employee } from "@/types/employee";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge,  UserRound } from "lucide-react";

type ViewEmployeeDialogProps = {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ViewEmployeeDialog = ({
  employee,
  open,
  onOpenChange,
}: ViewEmployeeDialogProps) => {
  if (!employee) return null;

  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>

          <DialogDescription>
            Complete information about the employee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-teal-600/10 text-teal-700">
              <UserRound className="size-6" />
            </div>

            <div>
              <h3 className="text-lg font-semibold">{employee.name}</h3>

              <p className="text-sm text-muted-foreground">
                {employee.employeeId}
              </p>
            </div>

            <Badge
              className={
                employee.status === "Active"
                  ? "ml-auto bg-green-100 text-green-700 hover:bg-green-100"
                  : "ml-auto bg-slate-100 text-slate-600 hover:bg-slate-100"
              }
            >
              {employee.status}
            </Badge>
          </div>

          {/* Information */}
          <div className="grid gap-4 rounded-xl border bg-slate-50/50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Designation</p>

              <p className="mt-1 font-medium">{employee.designation || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Department</p>

              <p className="mt-1 font-medium">{employee.department || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Phone</p>

              <p className="mt-1 font-medium">{employee.phone || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Email</p>

              <p className="mt-1 font-medium break-all">
                {employee.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Joining Date</p>

              <p className="mt-1 font-medium">{employee.joiningDate || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Monthly Salary</p>

              <p className="mt-1 font-medium">
                {employee.salary
                  ? `৳${Number(employee.salary).toLocaleString()}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Emergency Contact</p>

              <p className="mt-1 font-medium">
                {employee.emergencyContact || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Address</p>

              <p className="mt-1 font-medium">{employee.address || "—"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default ViewEmployeeDialog;