"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type DepositPurpose = "BAZAR" | "OTHER";

type CreateDepositData = {
  date: string;
  amount: number;
  purpose?: DepositPurpose;
  remarks?: string;
};

export async function createDeposit(data: CreateDepositData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    if (!data.date || Number.isNaN(Date.parse(data.date))) {
      return {
        success: false,
        message: "Please provide a valid deposit date.",
      };
    }

    if (
      typeof data.amount !== "number" ||
      !Number.isFinite(data.amount) ||
      data.amount <= 0
    ) {
      return {
        success: false,
        message: "Deposit amount must be greater than zero.",
      };
    }

    if (
      data.purpose !== undefined &&
      data.purpose !== "BAZAR" &&
      data.purpose !== "OTHER"
    ) {
      return {
        success: false,
        message: "Invalid deposit purpose.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        employeeId: true,
        accountStatus: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User account was not found.",
      };
    }

    if (user.accountStatus !== "ACTIVE") {
      return {
        success: false,
        message: "Your account is not active.",
      };
    }

    await prisma.deposit.create({
      data: {
        date: new Date(`${data.date}T12:00:00`),
        amount: data.amount,
        purpose: data.purpose ?? null,
        remarks: data.remarks?.trim() || null,
        employeeId: user.employeeId,
        createdById: user.id,
      },
    });

    revalidatePath("/deposit");
    revalidatePath("/bazar");
    revalidatePath("/expense");

    return {
      success: true,
      message: "Deposit created successfully.",
    };
  } catch (error) {
    console.error("Create deposit error:", error);

    return {
      success: false,
      message: "Failed to create deposit.",
    };
  }
}

export async function getMyDeposits() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in.",
        deposits: [],
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        employeeId: true,
        accountStatus: true,
      },
    });

    if (!user || user.accountStatus !== "ACTIVE") {
      return {
        success: false,
        message: "Your account is not active.",
        deposits: [],
      };
    }

    const deposits = await prisma.deposit.findMany({
      where: {
        employeeId: user.employeeId,
      },
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        date: true,
        amount: true,
        purpose: true,
        remarks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      message: "Deposits fetched successfully.",
      deposits: deposits.map((deposit) => ({
        ...deposit,
        amount: Number(deposit.amount),
      })),
    };
  } catch (error) {
    console.error("Get deposits error:", error);

    return {
      success: false,
      message: "Failed to fetch deposits.",
      deposits: [],
    };
  }
}
