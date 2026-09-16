import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const now = new Date();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        accountStatus: true,
        lastActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 },
      );
    }

    // User has been frozen or deactivated
    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          message: "ACCOUNT_NOT_ACTIVE",
          accountStatus: user.accountStatus,
        },
        { status: 403 },
      );
    }

    // Only update lastActive if the previous activity
    // was more than 4 minutes ago.
    if (
      !user.lastActive ||
      now.getTime() - user.lastActive.getTime() >= 4 * 60 * 1000
    ) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          lastActive: now,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Heartbeat error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}