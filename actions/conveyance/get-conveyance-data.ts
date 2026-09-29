"use server";

import { requireActiveUser } from "@/lib/auth/require-active-user";
import { prisma } from "@/lib/prisma";

export async function getConveyanceData(month: string) {
  try {
    const authResult = await requireActiveUser();

    if (!authResult.ok) {
      return {
        success: false,
        message: authResult.message,
        employees: [],
        entries: [],
      };
    }

    const [employees, entries] = await Promise.all([
      prisma.employee.findMany({
        where: {
          employmentStatus: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
          designation: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.conveyanceRecord.findMany({
        where: {
          date: {
            gte: new Date(`${month}-01T00:00:00`),
            lt: (() => {
              const [year, monthNumber] = month
                .split("-")
                .map(Number);

              return new Date(
                year,
                monthNumber,
                1,
              );
            })(),
          },
        },
        orderBy: {
          date: "asc",
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
      }),
    ]);

    return {
      success: true,
      employees: employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        designation: employee.designation,
      })),
      entries: entries.map((entry) => ({
        id: entry.id,
        employeeId: entry.employeeId,
        date: entry.date.toISOString().split("T")[0],
        from: entry.from,
        to: entry.to,
        bill: Number(entry.bill),
         remarks: entry.remarks ?? undefined,   
        createdById: entry.createdById,
      })),
    };
  } catch (error) {
    console.error("Get conveyance data error:", error);

    return {
      success: false,
      message: "Failed to load conveyance data.",
      employees: [],
      entries: [],
    };
  }
}