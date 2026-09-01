"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AccountStatus,
  EmploymentStatus,
  UserAccount,
  UserRole,
} from "@/types/user";

type UserAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: UserAccount | null;
  onSave: (user: UserAccount) => void;
};

const UserAccountDialog = ({
  open,
  onOpenChange,
  editingUser,
  onSave,
}: UserAccountDialogProps) => {
  const [role, setRole] =
    useState<UserRole>("employee");

  const [accountStatus, setAccountStatus] =
    useState<AccountStatus>("active");

  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatus>("active");

  useEffect(() => {
    if (!open || !editingUser) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(editingUser.role);
    setAccountStatus(editingUser.accountStatus);
    setEmploymentStatus(
      editingUser.employmentStatus,
    );
  }, [open, editingUser]);

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!editingUser) {
      // We are not creating a database user yet.
      // This will be implemented when the backend exists.
      onOpenChange(false);
      return;
    }

    onSave({
      ...editingUser,
      role,
      accountStatus,
      employmentStatus,
    });

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingUser
              ? "Account Settings"
              : "Add User"}
          </DialogTitle>

          <DialogDescription>
            {editingUser
              ? `Manage account access for ${editingUser.employeeName}.`
              : "User creation will be connected to the employee database later."}
          </DialogDescription>
        </DialogHeader>

        {editingUser && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Employee */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">
                {editingUser.employeeName}
              </p>

              <p className="text-sm text-muted-foreground">
                {editingUser.employeeId} ·{" "}
                {editingUser.designation}
              </p>

              <p className="text-sm text-muted-foreground">
                {editingUser.email}
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>System Role</Label>

              <Select
                value={role}
                onValueChange={(value) =>
                  setRole(value as UserRole)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="super_admin">
                    Super Admin
                  </SelectItem>

                  <SelectItem value="admin">
                    Admin
                  </SelectItem>

                  <SelectItem value="accounts">
                    Accounts
                  </SelectItem>

                  <SelectItem value="employee">
                    Employee
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account Status */}
            <div className="space-y-2">
              <Label>Account Status</Label>

              <Select
                value={accountStatus}
                onValueChange={(value) =>
                  setAccountStatus(
                    value as AccountStatus,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">
                    Active
                  </SelectItem>

                  <SelectItem value="frozen">
                    Frozen
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Status */}
            <div className="space-y-2">
              <Label>
                Employment Status
              </Label>

              <Select
                value={employmentStatus}
                onValueChange={(value) =>
                  setEmploymentStatus(
                    value as EmploymentStatus,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">
                    Active
                  </SelectItem>

                  <SelectItem value="on_leave">
                    On Leave
                  </SelectItem>

                  <SelectItem value="resigned">
                    Resigned
                  </SelectItem>

                  <SelectItem value="terminated">
                    Terminated
                  </SelectItem>

                  <SelectItem value="retired">
                    Retired
                  </SelectItem>
                </SelectContent>
              </Select>
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserAccountDialog;