import {
  BriefcaseBusiness,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Employee } from "@/types/employee";

const EmployeeTable = ({
  filteredEmployees,
  handleViewEmployee,
  handleEditEmployee,
  handleDeleteEmployee,
}: {
  filteredEmployees: Employee[];
  handleViewEmployee: (employee: Employee) => void;
  handleEditEmployee: (employee: Employee) => void;
  handleDeleteEmployee: (employeeId: string) => void;
}) => {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        {filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="size-10 text-muted-foreground/40" />

            <p className="mt-3 font-medium">No employees found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-y bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3">Employee</th>

                <th className="px-4 py-3">Designation</th>

                <th className="px-4 py-3">Department</th>

                <th className="px-4 py-3">Phone</th>

                <th className="px-4 py-3">Joining Date</th>

                <th className="px-4 py-3">Status</th>

                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleViewEmployee(employee)}
                      className="flex items-center gap-3 text-left"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-600/10 text-teal-700">
                        <UserRound className="size-4" />
                      </div>

                      <div>
                        <p className="font-medium hover:text-teal-700">
                          {employee.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {employee.employeeId}
                        </p>
                      </div>
                    </button>
                  </td>

                  {/* Designation */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness className="size-4 text-muted-foreground" />

                      <span className="text-sm">{employee.designation}</span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-4">
                    <span className="text-sm">{employee.department}</span>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4">
                    <span className="text-sm">{employee.phone}</span>
                  </td>

                  {/* Joining Date */}
                  <td className="px-4 py-4">
                    <span className="text-sm">{employee.joiningDate}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <Badge
                      className={
                        employee.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <UserRound className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Pencil className="mr-2 size-4" />
                          Edit Employee
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete Employee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* mobile view */}

      <div className="space-y-3 p-4 md:hidden">
        {filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="size-10 text-muted-foreground/40" />

            <p className="mt-3 font-medium">No employees found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="rounded-xl border bg-slate-50/50 p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleViewEmployee(employee)}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-600/10 text-teal-700">
                    <UserRound className="size-4" />
                  </div>

                  <div>
                    <p className="font-semibold">{employee.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {employee.employeeId}
                    </p>
                  </div>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Open menu</span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewEmployee(employee)}
                    >
                      <UserRound className="mr-2 size-4" />
                      View Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit Employee
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete Employee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Information */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Designation</p>

                  <p className="mt-1 font-medium">{employee.designation}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Department</p>

                  <p className="mt-1 font-medium">{employee.department}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>

                  <p className="mt-1 font-medium">{employee.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Joining Date</p>

                  <p className="mt-1 font-medium">{employee.joiningDate}</p>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 border-t pt-3">
                <Badge
                  className={
                    employee.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                  }
                >
                  {employee.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default EmployeeTable;
