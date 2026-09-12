"use client";

import { useEffect, useMemo, useState } from "react";

import UserManagementTable from "@/components/user-management/user-management-table";
import UserFilters from "@/components/user-management/user-filters";

import type { User, UserRole, AccountStatus } from "@/types/user";
import { getUsers } from "@/actions/user/user-actions";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import CreateUserDialog from "./create-user-dialog";

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [createUserOpen, setCreateUserOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");

  const [role, setRole] = useState<UserRole | "all">("all");

  const [status, setStatus] = useState<AccountStatus | "all">("all");

  const loadUsers = async () => {
    setLoading(true);

    const result = await getUsers();

    if (result.success) {
      setUsers(result.users);
    }

    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.employee.name.toLowerCase().includes(searchValue) ||
        user.employee.employeeCode.toLowerCase().includes(searchValue) ||
        user.username.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole = role === "all" || user.role === role;

      const matchesStatus = status === "all" || user.accountStatus === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage system user accounts and access.
          </p>
        </div>

        <Button onClick={() => setCreateUserOpen(true)}>
          <Plus className="mr-2 size-4" />
          New User
        </Button>
      </div>

      {/* Filters */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
      />

      {/* Users Table */}
      <div className="rounded-lg border bg-background">
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <UserManagementTable
            users={filteredUsers}
            onUsersChanged={loadUsers}
          />
        )}
      </div>

      <CreateUserDialog
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onSuccess={loadUsers}
      />
    </div>
  );
};

export default UserManagementPage;
