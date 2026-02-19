import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "USER" | "ADMIN";
      subscriptionStatus: "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
    subscriptionStatus?: "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  }
}
