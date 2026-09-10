"use server";

import { auth } from "@/auth";
import { createUserSchema } from "@/components/user-management/user-schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getUsers() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
      users: [],
    };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "You do not have permission to view users.",
      users: [],
    };
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedUsers = users.map((user) => ({
      id: user.id,
      employeeId: user.employeeId,
      username: user.username,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,

      passwordChangedAt: user.passwordChangedAt?.toISOString() ?? null,

      lastLogin: user.lastLogin?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),

      employee: {
        id: user.employee.id,
        employeeCode: user.employee.employeeCode,
        name: user.employee.name,
        designation: user.employee.designation,
        department: user.employee.department,
        employmentStatus: user.employee.employmentStatus,
      },
    }));

    return {
      success: true,
      users: serializedUsers,
    };
  } catch (error) {
    console.error("Get users error:", error);

    return {
      success: false,
      message: "Failed to load users.",
      users: [],
    };
  }
}

export async function createUser(data: unknown) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
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

  const { username, email, password, role, employeeId } = parsed.data;

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

export async function updateUser(
  userId: string,
  data: {
    username: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "ACCOUNTS" | "EMPLOYEE";
    accountStatus: "ACTIVE" | "FROZEN" | "INACTIVE";
  },
) {
  const session = await auth();

  // Authentication check
  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  // Permission check
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "You do not have permission to update users.",
    };
  }

  try {
    // Check user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Check username uniqueness
    const usernameExists = await prisma.user.findFirst({
      where: {
        username: data.username,
        NOT: {
          id: userId,
        },
      },
    });

    if (usernameExists) {
      return {
        success: false,
        message: "Username is already in use.",
      };
    }

    // Check email uniqueness
    const emailExists = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: userId,
        },
      },
    });

    if (emailExists) {
      return {
        success: false,
        message: "Email is already in use.",
      };
    }

    // Update user
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: data.username,
        email: data.email,
        role: data.role,
        accountStatus: data.accountStatus,
      },
    });

    return {
      success: true,
      message: "User updated successfully.",
    };
  } catch (error) {
    console.error("Update user error:", error);

    return {
      success: false,
      message: "Failed to update user.",
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

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
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
