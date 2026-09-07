"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createUserSchema, type CreateUserFormData } from "./user-schema";
import {
  createUser,
  getEmployeesWithoutUser,
} from "@/actions/user/user-actions";

type AvailableEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string | null;
};

type UserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function UserDialog({ open, onOpenChange, onSuccess }: UserDialogProps) {
  const [employees, setEmployees] = useState<AvailableEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      employeeId: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "EMPLOYEE",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedEmployee = watch("employeeId");
  const selectedRole = watch("role");

  useEffect(() => {
    if (!open) return;

    const loadEmployees = async () => {
      setLoadingEmployees(true);
      setServerError("");

      const result = await getEmployeesWithoutUser();

      if (result.success) {
        setEmployees(result.employees);
      } else {
        setEmployees([]);
        setServerError(result.message || "Failed to load employees");
      }

      setLoadingEmployees(false);
    };

    loadEmployees();
  }, [open]);

  const onSubmit = async (data: CreateUserFormData) => {
    setSubmitting(true);
    setServerError("");

    const result = await createUser(data);

    if (!result.success) {
      setServerError(result.message);
      setSubmitting(false);
      return;
    }

    reset();
    setEmployees([]);
    onOpenChange(false);
    onSuccess?.();

    setSubmitting(false);
  };

  const handleDialogChange = (value: boolean) => {
    if (!value) {
      reset();
      setEmployees([]);
      setServerError("");
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add User Account</DialogTitle>

          <DialogDescription>
            Create a login account for an existing employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Employee */}
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>

            <Select
              value={selectedEmployee}
              onValueChange={(value) => {
                if (value) {
                  setValue("employeeId", value, {
                    shouldValidate: true,
                  });
                }
              }}
              disabled={loadingEmployees || submitting}
            >
              <SelectTrigger id="employee">
                <SelectValue
                  placeholder={
                    loadingEmployees
                      ? "Loading employees..."
                      : "Select employee"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {employees.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No employees available
                  </div>
                ) : (
                  employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.employeeCode})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {errors.employeeId && (
              <p className="text-sm text-destructive">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>

            <Input
              id="username"
              placeholder="Enter username"
              autoComplete="off"
              disabled={submitting}
              {...register("username")}
            />

            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="employee@example.com"
              autoComplete="email"
              disabled={submitting}
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={submitting}
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={submitting}
                {...register("confirmPassword")}
              />

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>

            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setValue("role", value as CreateUserFormData["role"], {
                  shouldValidate: true,
                })
              }
              disabled={submitting}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>

                <SelectItem value="ACCOUNTS">Accounts</SelectItem>

                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Server Error */}
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

            <Button type="submit" disabled={submitting || loadingEmployees}>
              {submitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
