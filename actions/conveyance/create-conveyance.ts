"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

type CreateConveyanceData = {
  employeeId: string;
  date: string;
  from: string;
  to: string;
  bill: number;
  remarks?: string;
};

export async function createConveyance(
  data: CreateConveyanceData,
) {
  try {
    const authResult = await requireActiveUser();

    if (!authResult.ok) {
      return {
        success: false,
        message: authResult.message,
      };
    }

    if (
      !data.employeeId ||
      !data.date ||
      !data.from.trim() ||
      !data.to.trim()
    ) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      };
    }

    if (!Number.isFinite(data.bill) || data.bill < 0) {
      return {
        success: false,
        message: "Invalid bill amount.",
      };
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: data.employeeId,
      },
      select: {
        id: true,
        employmentStatus: true,
      },
    });

    if (!employee) {
      return {
        success: false,
        message: "Employee not found.",
      };
    }

    if (employee.employmentStatus !== "ACTIVE") {
      return {
        success: false,
        message: "This employee is not active.",
      };
    }

    const entry = await prisma.conveyanceRecord.create({
      data: {
        employeeId: data.employeeId,
        date: new Date(`${data.date}T12:00:00`),
        from: data.from.trim(),
        to: data.to.trim(),
        bill: data.bill,
        remarks: data.remarks?.trim() || null,
        createdById: authResult.user.id,
      },
      select: {
        id: true,
        employeeId: true,
        date: true,
        from: true,
        to: true,
        bill: true,
        remarks: true,
        createdById: true,
      },
    });

    return {
      success: true,
      message: "Conveyance added successfully.",
      data: {
        id: entry.id,
        employeeId: entry.employeeId,
        date: entry.date.toISOString().split("T")[0],
        from: entry.from,
        to: entry.to,
        bill: Number(entry.bill),
        remarks: entry.remarks ?? undefined,
        createdById: entry.createdById,
      },
    };
  } catch (error) {
    console.error("Create conveyance error:", error);

    return {
      success: false,
      message: "Failed to create conveyance.",
    };
  }
}