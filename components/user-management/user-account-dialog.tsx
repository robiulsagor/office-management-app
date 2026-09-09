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
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  User,
  UserRole,
  AccountStatus,
} from "@/types/user";
import { updateUser } from "@/actions/user/user-actions";
import toast from "react-hot-toast";

type UserAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  onSuccess:(() => void) | undefined
};

const UserAccountDialog = ({
  open,
  onOpenChange,
  editingUser,
  onSuccess,
}: UserAccountDialogProps) => {
  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState<UserRole>("EMPLOYEE");

  const [accountStatus, setAccountStatus] =
    useState<AccountStatus>("ACTIVE");

  useEffect(() => {
    if (!open || !editingUser) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(editingUser.username);
    setEmail(editingUser.email);
    setRole(editingUser.role);
    setAccountStatus(
      editingUser.accountStatus,
    );
  }, [open, editingUser]);

 const handleSubmit = async (
  e: React.FormEvent,
) => {
  e.preventDefault();

  if (!editingUser) return;

  const result = await updateUser(
    editingUser.id,
    {
      username: username.trim(),
      email: email.trim(),
      role,
      accountStatus,
    },
  );

  if (!result.success) {
    // এখানে পরে toast দেখাব
    toast.error(result.message || "Error updating user.");
    console.error(result.message);
    return;
  }

  onOpenChange(false);

  // এখানে একটা refresh callback দরকার হবে
  onSuccess?.()
};

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Account Settings
          </DialogTitle>

          <DialogDescription>
            Manage account access for{" "}
            {editingUser?.employee.name ??
              "this user"}
            .
          </DialogDescription>
        </DialogHeader>

        {editingUser && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Employee Information */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">
                {editingUser.employee.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {editingUser.employee.employeeCode}
                {" · "}
                {editingUser.employee.designation}
              </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Username
              </Label>

              <Input
                id="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                required
                minLength={3}
                maxLength={50}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email address"
                required
              />
            </div>

            {/* System Role */}
            <div className="space-y-2">
              <Label>
                System Role
              </Label>

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
                  <SelectItem value="SUPER_ADMIN">
                    Super Admin
                  </SelectItem>

                  <SelectItem value="ADMIN">
                    Admin
                  </SelectItem>

                  <SelectItem value="ACCOUNTS">
                    Accounts
                  </SelectItem>

                  <SelectItem value="EMPLOYEE">
                    Employee
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account Status */}
            <div className="space-y-2">
              <Label>
                Account Status
              </Label>

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
                  <SelectItem value="ACTIVE">
                    Active
                  </SelectItem>

                  <SelectItem value="FROZEN">
                    Frozen
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Status - Read Only */}
            <div className="space-y-2">
              <Label>
                Employment Status
              </Label>

              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                {editingUser.employee.employmentStatus
                  .replace("_", " ")
                  .replace(
                    /^\w/,
                    (char) =>
                      char.toUpperCase(),
                  )}
              </div>

              <p className="text-xs text-muted-foreground">
                Employment status is managed
                from the Employee page.
              </p>
            </div>

            {/* Footer */}
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