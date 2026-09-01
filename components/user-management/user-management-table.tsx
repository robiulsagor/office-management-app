"use client";

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

import { UserAccount } from "@/types/user";

type UserManagementTableProps = {
  users: UserAccount[];
  onEdit: (user: UserAccount) => void;
  onResetPassword: (user: UserAccount) => void;
  onToggleFreeze: (user: UserAccount) => void;
};

const roleLabel = (role: UserAccount["role"]) => {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "accounts":
      return "Accounts";
    default:
      return "Employee";
  }
};

const UserManagementTable = ({
  users,
  onEdit,
  onResetPassword,
  onToggleFreeze,
}: UserManagementTableProps) => {
  if (users.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">
          No users found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {user.employeeName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {user.employeeId} ·{" "}
                    {user.designation}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                {user.department}
              </TableCell>

              <TableCell>
                <Badge variant="outline">
                  {roleLabel(user.role)}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge
                    variant={
                      user.accountStatus ===
                      "active"
                        ? "default"
                        : "destructive"
                    }
                    className="w-fit"
                  >
                    {user.accountStatus ===
                    "active"
                      ? "Active"
                      : "Frozen"}
                  </Badge>

                  {user.employmentStatus !==
                    "active" && (
                    <span className="text-xs text-muted-foreground">
                      {user.employmentStatus
                        .replace("_", " ")
                        .replace(
                          /^\w/,
                          (c) => c.toUpperCase(),
                        )}
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <span className="text-sm">
                  {user.lastLogin ?? "Never"}
                </span>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="mr-2 size-4" />
                      Account Settings
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        onResetPassword(user)
                      }
                    >
                      <KeyRound className="mr-2 size-4" />
                      Reset Password
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() =>
                        onToggleFreeze(user)
                      }
                    >
                      {user.accountStatus ===
                      "active" ? (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagementTable;