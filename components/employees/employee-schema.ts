import { z } from "zod";

export const createEmployeeSchema = z.object({
  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .max(50, "Employee ID is too long"),

  name: z.string().min(1, "Full name is required").max(100, "Name is too long"),

  designation: z.string().min(1, "Designation is required"),

  department: z.string().min(1, "Department is required"),

  phone: z.string().optional(),

  email: z.string().email("Invalid email address").optional().or(z.literal("")),

  joiningDate: z.string().min(1, "Joining date is required"),

  salary: z.string().min(1, "Salary is required"),

  status: z.enum(["ACTIVE", "ON_LEAVE", "RESIGNED", "TERMINATED"]),

  address: z.string().optional(),

  emergencyContact: z.string().optional(),
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
