"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AccountStatus,
  UserAccount,
  UserRole,
} from "@/types/user";

import UserFilters from "./user-filters";
import UserManagementTable from "./user-management-table";
import UserAccountDialog from "./user-account-dialog";
import ResetPasswordDialog from "./reset-password-dialog";
import FreezeAccountDialog from "./freeze-account-dialog";

const initialUsers: UserAccount[] = [
  {
    id: "user-1",
    employeeId: "EMP-001",
    employeeName: "Rahim Ahmed",
    designation: "Junior Merchandiser",
    department: "Merchandising",
    username: "rahim",
    email: "rahim@acs.com",
    role: "employee",
    accountStatus: "active",
    employmentStatus: "active",
    lastLogin: "2026-09-01 09:12",
    passwordChangedAt: "2026-08-15",
    createdAt: "2026-01-05",
  },
  {
    id: "user-2",
    employeeId: "EMP-002",
    employeeName: "Karim Hasan",
    designation: "Accountant",
    department: "Accounts",
    username: "karim",
    email: "karim@acs.com",
    role: "accounts",
    accountStatus: "active",
    employmentStatus: "active",
    lastLogin: "2026-08-31 17:42",
    passwordChangedAt: "2026-07-20",
    createdAt: "2026-01-05",
  },
  {
    id: "user-3",
    employeeId: "EMP-003",
    employeeName: "Sakib Khan",
    designation: "Merchandiser",
    department: "Merchandising",
    username: "sakib",
    email: "sakib@acs.com",
    role: "employee",
    accountStatus: "frozen",
    employmentStatus: "active",
    lastLogin: "2026-08-20 11:15",
    passwordChangedAt: "2026-06-10",
    createdAt: "2026-01-10",
  },
  {
    id: "user-4",
    employeeId: "EMP-004",
    employeeName: "Arif Hossain",
    designation: "Manager",
    department: "Management",
    username: "arif",
    email: "arif@acs.com",
    role: "admin",
    accountStatus: "active",
    employmentStatus: "active",
    lastLogin: "2026-09-01 08:50",
    passwordChangedAt: "2026-08-01",
    createdAt: "2025-12-15",
  },
  {
    id: "user-5",
    employeeId: "EMP-005",
    employeeName: "Nayeem Islam",
    designation: "Office Assistant",
    department: "Administration",
    username: "nayeem",
    email: "nayeem@acs.com",
    role: "employee",
    accountStatus: "frozen",
    employmentStatus: "resigned",
    lastLogin: "2026-07-15 14:20",
    passwordChangedAt: "2026-05-12",
    createdAt: "2026-02-01",
  },
];

const UserManagementPage = () => {
  const [users, setUsers] =
    useState<UserAccount[]>(initialUsers);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] =
    useState<AccountStatus | "all">("all");

  const [accountDialogOpen, setAccountDialogOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<UserAccount | null>(null);

  const [resetPasswordUser, setResetPasswordUser] =
    useState<UserAccount | null>(null);

  const [freezeUser, setFreezeUser] =
    useState<UserAccount | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.employeeName.toLowerCase().includes(query) ||
        user.employeeId.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        user.accountStatus === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const handleEdit = (user: UserAccount) => {
    setEditingUser(user);
    setAccountDialogOpen(true);
  };

  const handleSaveAccount = (
    updatedUser: UserAccount,
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user,
      ),
    );

    setEditingUser(null);
  };

  const handleFreezeConfirm = () => {
    if (!freezeUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === freezeUser.id
          ? {
              ...user,
              accountStatus:
                user.accountStatus === "active"
                  ? "frozen"
                  : "active",
            }
          : user,
      ),
    );

    setFreezeUser(null);
  };

  const handlePasswordReset = () => {
    if (!resetPasswordUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === resetPasswordUser.id
          ? {
              ...user,
              passwordChangedAt:
                new Date()
                  .toISOString()
                  .split("T")[0],
            }
          : user,
      ),
    );

    setResetPasswordUser(null);
  };

  return (
    <div className="mx-auto w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight md:text-2xl">
              User Management
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage employee accounts, roles and access.
            </p>
          </div>
        </div>

        <Button
          type="button"
          className="bg-teal-600 hover:bg-teal-700"
          onClick={() => {
            setEditingUser(null);
            setAccountDialogOpen(true);
          }}
        >
          <UserPlus className="mr-2 size-4" />
          Add User
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg">
              User Accounts
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1
                ? "account"
                : "accounts"}{" "}
              found.
            </p>
          </div>

          <UserFilters
            search={search}
            onSearchChange={setSearch}
            role={roleFilter}
            onRoleChange={setRoleFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </CardHeader>

        <CardContent className="p-0">
          <UserManagementTable
            users={filteredUsers}
            onEdit={handleEdit}
            onResetPassword={setResetPasswordUser}
            onToggleFreeze={setFreezeUser}
          />
        </CardContent>
      </Card>

      {/* Account Dialog */}
      <UserAccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
        editingUser={editingUser}
        onSave={handleSaveAccount}
      />

      {/* Reset Password */}
      <ResetPasswordDialog
        user={resetPasswordUser}
        open={Boolean(resetPasswordUser)}
        onOpenChange={(open) => {
          if (!open) {
            setResetPasswordUser(null);
          }
        }}
        onConfirm={handlePasswordReset}
      />

      {/* Freeze / Unfreeze */}
      <FreezeAccountDialog
        user={freezeUser}
        open={Boolean(freezeUser)}
        onOpenChange={(open) => {
          if (!open) {
            setFreezeUser(null);
          }
        }}
        onConfirm={handleFreezeConfirm}
      />
    </div>
  );
};

export default UserManagementPage;