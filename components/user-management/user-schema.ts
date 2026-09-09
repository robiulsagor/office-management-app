import { z } from "zod";

export const createUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username is too long"),

    email: z
      .string()
      .email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Please confirm the password"),

    role: z.enum([
      "ADMIN",
      "ACCOUNTS",
      "EMPLOYEE",
    ]),

    employeeId: z
      .string()
      .min(1, "Please select an employee"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type CreateUserFormData = z.infer<typeof createUserSchema>;