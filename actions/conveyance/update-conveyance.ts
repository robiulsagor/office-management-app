"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

type UpdateConveyanceData = {
  id: string;
  employeeId: string;
  date: string;
  from: string;
  to: string;
  bill: number;
  remarks?: string;
};

export async function updateConveyance(
  data: UpdateConveyanceData,
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
      !data.id ||
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

    const existingRecord =
      await prisma.conveyanceRecord.findUnique({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          createdById: true,
        },
      });

    if (!existingRecord) {
      return {
        success: false,
        message: "Conveyance record not found.",
      };
    }

    const isSuperAdmin =
      authResult.user.role === "SUPER_ADMIN";

    const isOwner =
      existingRecord.createdById === authResult.user.id;

    if (!isSuperAdmin && !isOwner) {
      return {
        success: false,
        message:
          "You are not allowed to modify this conveyance.",
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

    const updatedRecord =
      await prisma.conveyanceRecord.update({
        where: {
          id: data.id,
        },
        data: {
          employeeId: data.employeeId,
          date: new Date(`${data.date}T12:00:00`),
          from: data.from.trim(),
          to: data.to.trim(),
          bill: data.bill,
          remarks: data.remarks?.trim() || null,
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
      message: "Conveyance updated successfully.",
      data: {
        id: updatedRecord.id,
        employeeId: updatedRecord.employeeId,
        date: updatedRecord.date
          .toISOString()
          .split("T")[0],
        from: updatedRecord.from,
        to: updatedRecord.to,
        bill: Number(updatedRecord.bill),
        remarks: updatedRecord.remarks ?? undefined,
        createdById: updatedRecord.createdById,
      },
    };
  } catch (error) {
    console.error("Update conveyance error:", error);

    return {
      success: false,
      message: "Failed to update conveyance.",
    };
  }
}