 export type Employee = {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  joiningDate: string;
  salary: string;
  status: "Active" | "Inactive";
  address: string;
  emergencyContact: string;
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
  status: "Active" | "Inactive";
  address: string;
  emergencyContact: string;
};