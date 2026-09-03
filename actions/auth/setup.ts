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

  //    check if user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: {
        in: ["ADMIN", "SUPER_ADMIN"],
      },
    },
  });

  if (existingAdmin) {
    return {
      success: false,
      message: "Setup has already been completed.",
      user: existingAdmin,
    };
  }

  //   check if username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Username already exists.",
    };
  }

  // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
    await prisma.$transaction(async (tx) => {
      // Create employee first
      const employee = await tx.employee.create({
        data: {
          employeeCode: `EMP-${Date.now()}`,
          name: fullName,
          email,
          designation: "Administrator",
          joiningDate: new Date(),
          employmentStatus: "ACTIVE",
        },
      });

      // Create login account
      await tx.user.create({
        data: {
          employeeId: employee.id,
          username,
          passwordHash: hashedPassword,
          role: "SUPER_ADMIN",
          accountStatus: "ACTIVE",
        },
      });
    });

    return {
      success: true,
      message: "Administrator account created successfully.",
    };
  } catch (error) {
    console.error("Setup error:", error);

    return {
      success: false,
      message: "Something went wrong while creating the administrator.",
    };
  }
}
