"use server";

import { auth } from "@/auth";
import { createUserSchema } from "@/components/user/user-schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser(data: unknown) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN"
  ) {
    return {
      success: false,
      message: "You do not have permission to create users.",
    };
  }

  const parsed = createUserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const {
  username,
  email,
  password,
  role,
  employeeId,
} = parsed.data;

  try {
    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return {
        success: false,
        message: "Username already exists.",
      };
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        user: true,
      },
    });

    if (!employee) {
      return {
        success: false,
        message: "Employee not found.",
      };
    }

    if (employee.user) {
      return {
        success: false,
        message: "This employee already has a user account.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

   const user = await prisma.user.create({
  data: {
    employeeId: employee.id,
    username,
    email,
    passwordHash,
    role,
    accountStatus: "ACTIVE",
  },
});

    return {
      success: true,
      message: "User created successfully.",
      user,
    };
  } catch (error) {
    console.error("Create user error:", error);

    return {
      success: false,
      message: "Something went wrong while creating the user.",
    };
  }
}

export async function getEmployeesWithoutUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
      employees: [],
    };
  }

  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN"
  ) {
    return {
      success: false,
      message: "You do not have permission.",
      employees: [],
    };
  }

  try {
    const employees = await prisma.employee.findMany({
      where: {
        user: null,
        employmentStatus: "ACTIVE",
      },
      select: {
        id: true,
        employeeCode: true,
        name: true,
        designation: true,
        department: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      employees,
    };
  } catch (error) {
    console.error("Get available employees error:", error);

    return {
      success: false,
      message: "Failed to load employees.",
      employees: [],
    };
  }
}