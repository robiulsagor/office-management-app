"use server";

import { auth } from "@/auth";
import { createEmployeeSchema } from "@/components/employees/employee-schema";
import { prisma } from "@/lib/prisma";

export async function createEmployee(data: unknown) {
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
      message: "You do not have permission to create employees.",
    };
  }

  const parsed = createEmployeeSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Invalid form data.",
    };
  }

  const {
    employeeId,
    name,
    designation,
    department,
    phone,
    email,
    joiningDate,
    salary,
    status,
    address,
    emergencyContact,
  } = parsed.data;

  try {
    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          employeeCode: employeeId,
        },
      });

    if (existingEmployee) {
      return {
        success: false,
        message: "Employee ID already exists.",
      };
    }

    if (email) {
      const existingEmail =
        await prisma.employee.findFirst({
          where: {
            email,
          },
        });

      if (existingEmail) {
        return {
          success: false,
          message: "Employee email already exists.",
        };
      }
    }

    console.log("Creating employee with data:", parsed.data);

    const employee = await prisma.employee.create({
      data: {
        employeeCode: employeeId,
        name,
        designation,
        department: department || null,
        phone: phone || null,
        email: email || null,
        joiningDate: new Date(joiningDate),
        salary,
        employmentStatus: status,
        address: address || null,
        emergencyContact: emergencyContact || null,
      },
    });

    console.log("CREATED EMPLOYEE:", employee);

    return {
      success: true,
      message: "Employee created successfully.",
      employeeId: employee.id,
    };
  } catch (error) {
    console.error("Create employee error:", error);

    return {
      success: false,
      message: "Something went wrong while creating the employee.",
    };
  }
}

export const deleteEmployee = async (empId: string) => {
  const session = await auth()

  if(!session?.user?.id){
    return {
      success: false,
      message: "Unauthorized!",
    }
  }

  if(session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN"){
    return {
      success: false,
      message: "You do not have permission to delete an employee!"
    }
  }

  try {
     await prisma.employee.delete({
      where: {
        id: empId
      }
    })

    return {
      success: true,
      message: "Employee record deleted!"
    }
  } catch (error) {
    console.error("Something went wrong when deleting employee! ", error)

    return {
      success: false,
      message:  "Failed to delete employee!"
    }
  }
}

export async function getEmployees() {
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
      message: "You do not have permission to view employees.",
      employees: [],
    };
  }

  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedEmployees = employees.map((employee) => ({
      id: employee.id,
      employeeCode: employee.employeeCode,
      name: employee.name,
      nameBn: employee.nameBn,
      designation: employee.designation,
      department: employee.department,
      phone: employee.phone,
      email: employee.email,
      address: employee.address,
      emergencyContact: employee.emergencyContact,

      joiningDate: employee.joiningDate.toISOString(),

      employmentStatus: employee.employmentStatus,

      salary: employee?.salary?.toString(),

      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    }));

    return {
      success: true,
      employees: serializedEmployees,
    };
  } catch (error) {
    console.error("Get employees error:", error);

    return {
      success: false,
      message: "Failed to load employees.",
      employees: [],
    };
  }
}