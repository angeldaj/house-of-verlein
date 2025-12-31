import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      subscriptionStatus: "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
    subscriptionStatus?: "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  }
}
