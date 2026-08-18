import { z } from "zod";

export const setupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Please enter your full name")
      .trim(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .trim(),

    email: z
      .string()
      .email("Please enter a valid email address")
      .trim(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SetupFormValues = z.infer<typeof setupSchema>;