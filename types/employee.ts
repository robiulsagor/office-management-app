export type EmployeeStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "RESIGNED"
  | "TERMINATED";

export type Employee = {
  id: string;
  employeeCode: string;
  name: string;
  nameBn: string | null;
  designation: string;
  department: string | null;
  phone: string | null;
  email: string | null;
  joiningDate: string;
  salary?: string;
  address: string | null;
  emergencyContact: string | null;
  employmentStatus: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeFormData = {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  joiningDate: string;
  salary: string;
  status: EmployeeStatus;
  address: string;
  emergencyContact: string;
};