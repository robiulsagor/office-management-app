export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "ACCOUNTS"
  | "EMPLOYEE";

export type AccountStatus =
  | "ACTIVE"
  | "FROZEN"
  | "INACTIVE";

export type EmploymentStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "RESIGNED"
  | "TERMINATED";

export type UserEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string | null;
  employmentStatus: EmploymentStatus;
};

export type User = {
  id: string;
  employeeId: string;
  username: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;

  passwordChangedAt: string | null;

  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;

  employee: UserEmployee;
};