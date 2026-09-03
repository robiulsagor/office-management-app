import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials.password || !credentials.username) {
          return null;
        }

        const username = String(credentials.username);
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: {
            username,
          },
          include: {
            employee: true,
          },
        });

        if (!user) {
          return null;
        }

        if (user.accountStatus !== "ACTIVE") {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.employee?.name,
          username: user.username,
          role: user.role,
          employeeId: user.employeeId,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
});
