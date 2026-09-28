import { performance } from "node:perf_hooks";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireActiveUser() {
  const totalStart = performance.now();

  const authStart = performance.now();

  const session = await auth();

  console.log(
    `[requireActiveUser] auth(): ${(
      performance.now() - authStart
    ).toFixed(0)}ms`,
  );

  if (!session?.user?.id) {
    console.log(
      `[requireActiveUser] total: ${(
        performance.now() - totalStart
      ).toFixed(0)}ms`,
    );

    return {
      ok: false as const,
      message: "Unauthorized",
    };
  }

  const userQueryStart = performance.now();

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

  console.log(
    `[requireActiveUser] user query: ${(
      performance.now() - userQueryStart
    ).toFixed(0)}ms`,
  );

  if (!user) {
    console.log(
      `[requireActiveUser] total: ${(
        performance.now() - totalStart
      ).toFixed(0)}ms`,
    );

    return {
      ok: false as const,
      message: "User not found",
    };
  }

  if (user.accountStatus !== "ACTIVE") {
    console.log(
      `[requireActiveUser] total: ${(
        performance.now() - totalStart
      ).toFixed(0)}ms`,
    );

    return {
      ok: false as const,
      message: "ACCOUNT_NOT_ACTIVE",
    };
  }

  console.log(
    `[requireActiveUser] total: ${(
      performance.now() - totalStart
    ).toFixed(0)}ms`,
  );

  return {
    ok: true as const,
    user,
  };
}