/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import EmployeeStats from "@/components/employees/employee-stats";
import EmployeeFilters from "@/components/employees/employee-filters";
import EmployeeTable from "@/components/employees/employee-table";
import { Employee } from "@/types/employee";
import EmployeeDialog from "@/components/employees/employee-form-dialog";
import ViewEmployeeDialog from "@/components/employees/employee-view-dialog";
import {
  deleteEmployee,
  getEmployees,
} from "@/actions/employee/employee-actions";
import toast from "react-hot-toast";
import StaggerContainer from "@/components/animations/stagger-container";
import StaggerItem from "@/components/animations/stagger-item";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");

  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // ------------------------------------------------
  // Statistics
  // ------------------------------------------------

  const activeEmployees = employees.filter(
    (employee) => employee.employmentStatus === "ACTIVE",
  ).length;

  const inactiveEmployees = employees.filter((employee) =>
    ["ON_LEAVE", "RESIGNED", "TERMINATED"].includes(employee.employmentStatus),
  ).length;

  // ------------------------------------------------
  // Filtering
  // ------------------------------------------------

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const matchesSearch =
        !searchValue ||
        employee.name.toLowerCase().includes(searchValue) ||
        employee.employeeCode.toLowerCase().includes(searchValue) ||
        employee.designation.toLowerCase().includes(searchValue);

      const matchesDepartment =
        department === "all" || employee.department === department;

      const matchesStatus =
        status === "all" || employee.employmentStatus.toLowerCase() === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, search, department, status]);

  // ------------------------------------------------
  // Open Add Dialog
  // ------------------------------------------------

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeDialogOpen(true);
  };

  // ------------------------------------------------
  // Open Edit Dialog
  // ------------------------------------------------

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setEmployeeDialogOpen(true);
  };

  // ------------------------------------------------
  // Delete Employee
  // ------------------------------------------------

  const handleDeleteEmployee = async (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId);

    if (!employee) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`,
    );

    if (!confirmed) return;

    try {
      const deleted = await deleteEmployee(employeeId);
      if (deleted.success) {
        toast.success(deleted.message);
        loadEmployees();
      } else {
        toast.error(deleted.message);
      }
    } catch (error) {
      toast.error(`Failed to delete the employee - ${employee.name}`);
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
    setViewDialogOpen(true);
  };

  const loadEmployees = async () => {
    const result = await getEmployees();

    if (!result.success) {
      console.error(result.message);
      return;
    }
    setEmployees(result.employees);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="mx-auto w-full space-y-6 ">
      <title>Employees - Adventure Clothing & Sourcing</title>
      {/* ============================================ */}
      {/* Page Header */}
      {/* ============================================ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
            <Users className="size-5" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight md:text-2xl">
              Employees
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage employees of Adventure Clothing & Sourcing.
            </p>
          </div>
        </div>

        <Button
          onClick={handleAddEmployee}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="mr-2 size-4" />
          Add Employee
        </Button>
      </div>

      {/* ============================================ */}
      {/* Summary Cards */}
      {/* ============================================ */}

      <StaggerContainer className="flex flex-col gap-6 ">
        <EmployeeStats
          totalEmployees={employees.length}
          activeEmployees={activeEmployees}
          inactiveEmployees={inactiveEmployees}
        />

        {/* ============================================ */}
        {/* Employee List */}
        {/* ============================================ */}

        <StaggerItem key="employee-list" className="w-full">
          <Card>
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-lg">Employee List</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  View and manage all employees.
                </p>
              </div>

              {/* Filters */}
              <EmployeeFilters
                search={search}
                setSearch={setSearch}
                department={department}
                setDepartment={setDepartment}
                status={status}
                setStatus={setStatus}
              />
            </CardHeader>

            <CardContent className="p-0">
              <EmployeeTable
                filteredEmployees={filteredEmployees}
                handleViewEmployee={handleViewEmployee}
                handleEditEmployee={handleEditEmployee}
                handleDeleteEmployee={handleDeleteEmployee}
              />
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
      {/* ============================================ */}
      {/* Add / Edit Dialog */}
      {/* ============================================ */}

      <EmployeeDialog
        key={editingEmployee?.id ?? "new"}
        open={employeeDialogOpen}
        onOpenChange={setEmployeeDialogOpen}
        onEmployeeCreated={loadEmployees}
        editingEmployee={editingEmployee}
      />

      {/* ============================================ */}
      {/* View Dialog */}
      {/* ============================================ */}

      <ViewEmployeeDialog
        employee={viewingEmployee}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};

export default Employees;
