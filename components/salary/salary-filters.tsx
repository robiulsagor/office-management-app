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

type SalaryFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;

  status: "all" | "paid" | "pending";
  onStatusChange: (
    value: "all" | "paid" | "pending",
  ) => void;

  department: string;
  onDepartmentChange: (value: string) => void;
};

const SalaryFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  department,
  onDepartmentChange,
}: SalaryFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search employee..."
          className="pl-9"
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) => {
          if (
            value === "all" ||
            value === "paid" ||
            value === "pending"
          ) {
            onStatusChange(value);
          }
        }}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Status
          </SelectItem>

          <SelectItem value="paid">
            Paid
          </SelectItem>

          <SelectItem value="pending">
            Pending
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={department}
        onValueChange={(value) => {
          if (value !== null) {
            onDepartmentChange(value);
          }
        }}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Departments
          </SelectItem>

          <SelectItem value="Merchandising">
            Merchandising
          </SelectItem>

          <SelectItem value="Accounts">
            Accounts
          </SelectItem>

          <SelectItem value="Admin">
            Admin
          </SelectItem>

          <SelectItem value="Management">
            Management
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SalaryFilters;