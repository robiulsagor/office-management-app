import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Please enter your username").trim(),
  password: z.string().min(6, "Please Enter valid password").trim(),
});

export type LoginFormValues  = z.infer<typeof loginSchema>;