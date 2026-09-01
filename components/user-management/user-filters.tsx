"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AccountStatus,
  UserRole,
} from "@/types/user";

type UserFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;

  role: UserRole | "all";
  onRoleChange: (value: UserRole | "all") => void;

  status: AccountStatus | "all";
  onStatusChange: (
    value: AccountStatus | "all",
  ) => void;
};

const UserFilters = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: UserFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search employee..."
          className="pl-9 sm:w-56"
        />
      </div>

      <Select
        value={role}
        onValueChange={(value) =>
          onRoleChange(
            value as UserRole | "all",
          )
        }
      >
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="Role" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Roles
          </SelectItem>

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

      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(
            value as AccountStatus | "all",
          )
        }
      >
        <SelectTrigger className="sm:w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Status
          </SelectItem>

          <SelectItem value="active">
            Active
          </SelectItem>

          <SelectItem value="frozen">
            Frozen
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilters;