import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireActiveUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false as const,
      message: "Unauthorized",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      employeeId: true,
      username: true,
      role: true,
      accountStatus: true,
    },
  });

  if (!user) {
    return {
      ok: false as const,
      message: "User not found",
    };
  }

  if (user.accountStatus !== "ACTIVE") {
    return {
      ok: false as const,
      message: "ACCOUNT_NOT_ACTIVE",
    };
  }

  return {
    ok: true as const,
    user,
  };
}