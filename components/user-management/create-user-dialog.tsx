/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import {
  createUser,
  getEmployeesWithoutUser,
} from "@/actions/user/user-actions";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AvailableEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string | null;
};

type CreateUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const CreateUserDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserDialogProps) => {
  const [employees, setEmployees] = useState<AvailableEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loading, setLoading] = useState(false);

  const [employeeId, setEmployeeId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "ACCOUNTS" | "EMPLOYEE">(
    "EMPLOYEE",
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    setError("");

    try {
      const result = await getEmployeesWithoutUser();

      if (result.success) {
        setEmployees(result.employees);
      } else {
        setEmployees([]);
        setError(result.message ?? "Failed to load employees.");
      }
    } catch (error) {
      console.error("Load available employees error:", error);
      setEmployees([]);
      setError("Failed to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    setEmployeeId("");
    setUsername("");
    setEmail("");
    setRole("EMPLOYEE");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");

    loadEmployees();
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await createUser({
        employeeId,
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        role,
      });

      if (!result.success) {
        setError(result.message ?? "Failed to create user.");
        return;
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Create user error:", error);
      setError("Something went wrong while creating the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5" />
            Create New User
          </DialogTitle>

          <DialogDescription>
            Create a login account for an existing employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Employee */}
          <div className="space-y-2">
            <Label>Employee</Label>

            <Select
              value={employeeId}
              onValueChange={(value) => setEmployeeId(value ?? "")}
              disabled={loading || loadingEmployees}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingEmployees
                      ? "Loading employees..."
                      : "Select employee"
                  }
                >
                  {employeeId
                    ? (() => {
                        const selectedEmployee = employees.find(
                          (employee) => employee.id === employeeId,
                        );

                        if (!selectedEmployee) {
                          return null;
                        }

                        return (
                          <span>
                            {selectedEmployee.name} —{" "}
                            {selectedEmployee.employeeCode}
                          </span>
                        );
                      })()
                    : null}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {employees.length === 0 && !loadingEmployees ? (
                  <SelectItem value="none" disabled>
                    No employees available
                  </SelectItem>
                ) : (
                  employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} — {employee.employeeCode}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {employeeId && (
              <p className="text-xs text-muted-foreground">
                {
                  employees.find((employee) => employee.id === employeeId)
                    ?.designation
                }
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>

            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. rahim"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="employee@example.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>

            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as "ADMIN" | "ACCOUNTS" | "EMPLOYEE")
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>

                <SelectItem value="ACCOUNTS">Accounts</SelectItem>

                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                disabled={loading}
                autoComplete="new-password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Password must meet the minimum requirements.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                disabled={loading}
                autoComplete="new-password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading || loadingEmployees || employees.length === 0}
            >
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
