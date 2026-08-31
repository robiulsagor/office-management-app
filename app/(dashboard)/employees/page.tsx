"use client";

import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import EmployeeStats from "@/components/employees/employee-stats";
import EmployeeFilters from "@/components/employees/employee-filters";
import EmployeeTable from "@/components/employees/employee-table";
import { Employee, EmployeeFormData } from "@/types/employee";
import EmployeeDialog from "@/components/employees/employee-form-dialog";
import ViewEmployeeDialog from "@/components/employees/employee-view-dialog";

// --------------------------------------------------
// Mock Data
// --------------------------------------------------

const initialEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "ACS-001",
    name: "Md. Rahim",
    designation: "Managing Director",
    department: "Management",
    phone: "01711-111111",
    email: "rahim@acs.com",
    joiningDate: "2022-01-01",
    salary: "80000",
    status: "Active",
    address: "Uttara, Dhaka",
    emergencyContact: "01700-111111",
  },
  {
    id: "2",
    employeeId: "ACS-002",
    name: "Md. Karim",
    designation: "Merchandiser",
    department: "Merchandising",
    phone: "01711-222222",
    email: "karim@acs.com",
    joiningDate: "2023-03-15",
    salary: "30000",
    status: "Active",
    address: "Mirpur, Dhaka",
    emergencyContact: "01700-222222",
  },
  {
    id: "3",
    employeeId: "ACS-003",
    name: "Sadia Akter",
    designation: "Accountant",
    department: "Accounts",
    phone: "01811-333333",
    email: "sadia@acs.com",
    joiningDate: "2023-06-10",
    salary: "28000",
    status: "Active",
    address: "Mohammadpur, Dhaka",
    emergencyContact: "01700-333333",
  },
  {
    id: "4",
    employeeId: "ACS-004",
    name: "Hasan Mahmud",
    designation: "Admin Executive",
    department: "Admin",
    phone: "01911-444444",
    email: "hasan@acs.com",
    joiningDate: "2024-02-05",
    salary: "25000",
    status: "Active",
    address: "Uttara, Dhaka",
    emergencyContact: "01700-444444",
  },
  {
    id: "5",
    employeeId: "ACS-005",
    name: "Nusrat Jahan",
    designation: "Junior Merchandiser",
    department: "Merchandising",
    phone: "01611-555555",
    email: "nusrat@acs.com",
    joiningDate: "2024-08-20",
    salary: "22000",
    status: "Inactive",
    address: "Badda, Dhaka",
    emergencyContact: "01700-555555",
  },
];

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

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
    (employee) => employee.status === "Active",
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive",
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
        employee.employeeId.toLowerCase().includes(searchValue) ||
        employee.designation.toLowerCase().includes(searchValue);

      const matchesDepartment =
        department === "all" || employee.department === department;

      const matchesStatus =
        status === "all" || employee.status.toLowerCase() === status;

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
  // Save Employee
  // ------------------------------------------------

  const handleSaveEmployee = (formData: EmployeeFormData) => {
    if (editingEmployee) {
      // Update existing employee

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingEmployee.id
            ? {
                ...employee,
                ...formData,
              }
            : employee,
        ),
      );
    } else {
      // Add new employee

      const newEmployee: Employee = {
        id: crypto.randomUUID(),
        ...formData,
      };

      setEmployees((prev) => [...prev, newEmployee]);
    }

    setEditingEmployee(null);
  };

  // ------------------------------------------------
  // Delete Employee
  // ------------------------------------------------

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId);

    if (!employee) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`,
    );

    if (!confirmed) return;

    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== employeeId),
    );
  };

  // ------------------------------------------------
  // View Employee
  // ------------------------------------------------

  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
    setViewDialogOpen(true);
  };

  return (
    <div className="mx-auto w-full space-y-6 pb-10">
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

      <EmployeeStats
        totalEmployees={employees.length}
        activeEmployees={activeEmployees}
        inactiveEmployees={inactiveEmployees}
      />

      {/* ============================================ */}
      {/* Employee List */}
      {/* ============================================ */}

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
          {/* ======================================== */}
          {/* Desktop Table */}
          {/* ======================================== */}

          <EmployeeTable
            filteredEmployees={filteredEmployees}
            handleViewEmployee={handleViewEmployee}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
          />
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* Add / Edit Dialog */}
      {/* ============================================ */}

      <EmployeeDialog
        open={employeeDialogOpen}
        onOpenChange={setEmployeeDialogOpen}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
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
