"use server";

import { setupSchema } from "@/app/(auth)/setup/setup-schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function setupAdmin(data: unknown) {
  const parsed = setupSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const { fullName, username, email, password } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Initial setup is allowed only when no user exists.
      const existingUser = await tx.user.findFirst();

      if (existingUser) {
        throw new Error("SETUP_ALREADY_COMPLETED");
      }

      // Check username
      const existingUsername = await tx.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        throw new Error("USERNAME_EXISTS");
      }

      // Check email
      const existingEmail = await tx.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new Error("EMAIL_EXISTS");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create employee first
      const employee = await tx.employee.create({
        data: {
          employeeCode: `EMP-${Date.now()}`,
          name: fullName,
          email,
          designation: "Administrator",
          joiningDate: new Date(),
          employmentStatus: "ACTIVE",
          salary: 0,
        },
      });

      // Create SUPER_ADMIN account
      const user = await tx.user.create({
        data: {
          employeeId: employee.id,
          username,
          email,
          passwordHash: hashedPassword,
          role: "SUPER_ADMIN",
          accountStatus: "ACTIVE",
        },
      });

      return user;
    });

    return {
      success: true,
      message: "Administrator account created successfully.",
      userId: result.id,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SETUP_ALREADY_COMPLETED") {
        return {
          success: false,
          message: "Setup has already been completed.",
        };
      }

      if (error.message === "USERNAME_EXISTS") {
        return {
          success: false,
          message: "Username already exists.",
        };
      }

      if (error.message === "EMAIL_EXISTS") {
        return {
          success: false,
          message: "Email already exists.",
        };
      }
    }

    console.error("Setup error:", error);

    return {
      success: false,
      message: "Something went wrong while creating the administrator.",
    };
  }
}