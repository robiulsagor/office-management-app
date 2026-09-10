"use client";

import { useState } from "react";

import {
  MoreHorizontal,
  KeyRound,
  Pencil,
  Snowflake,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import type { User } from "@/types/user";

import UserAccountDialog from "@/components/user-management/user-account-dialog";
import ResetPasswordDialog from "@/components/user-management/reset-password-dialog";
import FreezeAccountDialog from "@/components/user-management/freeze-account-dialog";

type UserManagementTableProps = {
  users: User[];
  onUsersChanged?: () => void;
};

const roleLabel = (role: User["role"]) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";

    case "ADMIN":
      return "Admin";

    case "ACCOUNTS":
      return "Accounts";

    case "EMPLOYEE":
      return "Employee";

    default:
      return role;
  }
};

const formatEmploymentStatus = (
  status: User["employee"]["employmentStatus"],
) => {
  return status.replace("_", " ").replace(/^\w/, (char) => char.toUpperCase());
};

const formatLastLogin = (lastLogin: User["lastLogin"]) => {
  if (!lastLogin) {
    return {
      date: "Never",
      time: null,
    };
  }

  const loginDate = new Date(lastLogin);
  const now = new Date();

  const isToday = loginDate.toDateString() === now.toDateString();

  const yesterday = new Date(now);

  yesterday.setDate(now.getDate() - 1);

  const isYesterday = loginDate.toDateString() === yesterday.toDateString();

  const time = loginDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return {
      date: "Today",
      time,
    };
  }

  if (isYesterday) {
    return {
      date: "Yesterday",
      time,
    };
  }

  return {
    date: loginDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time,
  };
};

const PASSWORD_STATUS_WINDOW = 3 * 60 * 60 * 1000;

const getPasswordStatus = (user: User) => {
  if (!user.passwordResetAt) {
    return "none";
  }

  if (!user.passwordChangedAt) {
    return "pending";
  }

  const resetAt = new Date(user.passwordResetAt).getTime();

  const changedAt = new Date(user.passwordChangedAt).getTime();

  const expiresAt = resetAt + PASSWORD_STATUS_WINDOW;

  if (changedAt >= resetAt && changedAt <= expiresAt) {
    return "changed";
  }

  return "expired";
};

const UserManagementTable = ({
  users,
  onUsersChanged,
}: UserManagementTableProps) => {
  // ==========================================
  // Dialog selected users
  // ==========================================

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  const [freezeUser, setFreezeUser] = useState<User | null>(null);

  // ==========================================
  // Dialog open states
  // ==========================================

  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);

  // ==========================================
  // Empty state
  // ==========================================

  if (users.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">No users found</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>

              <TableHead>Username</TableHead>

              <TableHead>Role</TableHead>

              <TableHead>Account</TableHead>

              <TableHead>Last Login</TableHead>

              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => {
              const passwordStatus = getPasswordStatus(user);
              const lastLogin = formatLastLogin(user.lastLogin);

              return (
                <TableRow key={user.id}>
                  {/* Employee */}
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.employee.name}</p>

                      <p className="text-xs text-muted-foreground">
                        {user.employee.employeeCode}
                        {" · "}
                        {user.employee.designation}
                      </p>
                    </div>
                  </TableCell>

                  {/* Username */}
                  <TableCell>
                    <span className="font-medium text-sm">{user.username}</span>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Badge variant="outline">{roleLabel(user.role)}</Badge>
                  </TableCell>

                  {/* Account Status */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={
                          user.accountStatus === "ACTIVE"
                            ? "default"
                            : "destructive"
                        }
                        className="w-fit"
                      >
                        {user.accountStatus === "ACTIVE"
                          ? "Active"
                          : user.accountStatus === "FROZEN"
                            ? "Frozen"
                            : "Inactive"}
                      </Badge>

                      {user.employee.employmentStatus !== "ACTIVE" && (
                        <span className="text-xs text-muted-foreground">
                          {formatEmploymentStatus(
                            user.employee.employmentStatus,
                          )}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {passwordStatus === "changed" && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                          <span className="size-1.5 rounded-full bg-green-500" />
                          Password changed
                        </div>
                      )}

                      {passwordStatus === "pending" && (
                        <div className="text-xs text-muted-foreground">
                          User hasn&quot;t changed password yet
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Last Login */}
                  <TableCell>
                    {lastLogin.time ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {lastLogin.date}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {lastLogin.time}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Never
                      </span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {/* Account Settings */}
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingUser(user);
                            setUserDialogOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 size-4" />
                          Account Settings
                        </DropdownMenuItem>

                        {/* Reset Password */}
                        <DropdownMenuItem
                          onClick={() => {
                            setResetPasswordUser(user);
                            setResetPasswordDialogOpen(true);
                          }}
                        >
                          <KeyRound className="mr-2 size-4" />
                          Reset Password
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Freeze / Unfreeze */}
                        <DropdownMenuItem
                          onClick={() => {
                            setFreezeUser(user);
                            setFreezeDialogOpen(true);
                          }}
                        >
                          {user.accountStatus === "ACTIVE" ? (
                            <>
                              <Snowflake className="mr-2 size-4" />
                              Freeze Account
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 size-4" />
                              Unfreeze Account
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ======================================
          Account Settings Dialog
          ====================================== */}

      <UserAccountDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        editingUser={editingUser}
        onSuccess={onUsersChanged}
      />

      {/* ======================================
          Reset Password Dialog
          ====================================== */}

      <ResetPasswordDialog
        user={resetPasswordUser}
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
        onSuccess={onUsersChanged}
      />

      {/* ======================================
          Freeze Account Dialog
          ====================================== */}

      <FreezeAccountDialog
        user={freezeUser}
        open={freezeDialogOpen}
        onOpenChange={setFreezeDialogOpen}
        onConfirm={() => {
          console.log("Toggle freeze:", freezeUser?.id);

          onUsersChanged?.();
        }}
      />
    </>
  );
};

export default UserManagementTable;
