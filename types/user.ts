export type UserRole = "super_admin" | "admin" | "accounts" | "employee";

export type AccountStatus = "active" | "frozen";

export type EmploymentStatus =
  | "active"
  | "on_leave"
  | "resigned"
  | "terminated"
  | "retired";

export type UserAccount = {
  id: string;
  employeeId: string;

  employeeName: string;
  designation: string;
  department: string;

  username: string;
  email: string;

  role: UserRole;
  accountStatus: AccountStatus;
  employmentStatus: EmploymentStatus;

  lastLogin: string | null;
  passwordChangedAt: string | null;

  createdAt: string;
};
