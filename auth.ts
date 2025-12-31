import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // OK si tu lib/prisma exporta default. Si exporta named, cámbialo a: import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // ✅ REQUIRED para Credentials en v5
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],

  callbacks: {
    // ✅ Mete datos en el JWT
    jwt: async ({ token, user }) => {
      // En el primer login, `user` viene de authorize()
      if (user) {
        token.id = user.id;
      }

      const id = (token.id ?? token.sub) as string | undefined;
      if (!id) return token;

      // Evita query en cada request si ya tenemos los campos
      if (token.role && token.subscriptionStatus) return token;

      const dbUser = await prisma.user.findUnique({
        where: { id },
        select: { role: true, subscriptionStatus: true },
      });

      token.id = id;
      token.role = dbUser?.role ?? "USER";
      token.subscriptionStatus = dbUser?.subscriptionStatus ?? "INACTIVE";

      return token;
    },

    // ✅ Expone en session.user sin usar any
    session: async ({ session, token }) => {
      const id = (token.id ?? token.sub) as string | undefined;
      if (id) session.user.id = id;

      session.user.role = (token.role ?? "USER") as "USER" | "ADMIN";
      session.user.subscriptionStatus = (token.subscriptionStatus ?? "INACTIVE") as
        | "INACTIVE"
        | "ACTIVE"
        | "PAST_DUE"
        | "CANCELED";

      return session;
    },
  },
});
