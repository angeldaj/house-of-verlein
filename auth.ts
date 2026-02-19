import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";



const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type Role = "USER" | "ADMIN";
type SubscriptionStatus = "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";

type AppJWT = JWT & {
  id?: string;
  role?: Role;
  subscriptionStatus?: SubscriptionStatus;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),

  // Required: Credentials provider works with JWT session strategy
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
          select: { id: true, email: true, name: true, passwordHash: true },
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
    jwt: async ({ token, user }) => {
      const t = token as AppJWT;

      // primer login
      if (user?.id) t.id = user.id;

      const id = t.id ?? t.sub;
      if (!id) return t;

      // evita query si ya lo tenemos
      if (t.role && t.subscriptionStatus) return t;

      const dbUser = await prisma.user.findUnique({
        where: { id },
        select: { role: true, subscriptionStatus: true },
      });

      t.id = id;
      t.role = (dbUser?.role ?? "USER") as Role;
      t.subscriptionStatus = (dbUser?.subscriptionStatus ?? "INACTIVE") as SubscriptionStatus;

      return t;
    },

    session: async ({ session, token }) => {
      const t = token as AppJWT;
      const id = t.id ?? t.sub;

      if (session.user && id) session.user.id = id;
      if (session.user) {
        session.user.role = (t.role ?? "USER") as Role;
        session.user.subscriptionStatus = (t.subscriptionStatus ?? "INACTIVE") as SubscriptionStatus;
      }

      return session;
    },
  },
});
