import NextAuth from "next-auth";
import { Plan } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      planId?: string | null;
      subscriptionStatus?: string | null;
      flyersUsed?: number;
      plan?: Plan | null;
      flyerCount?: number;
    };
  }

  interface User {
    id: string;
    planId?: string | null;
    subscriptionStatus?: string | null;
    flyersUsed?: number;
    plan?: Plan | null;
    flyerCount?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    planId?: string | null;
    subscriptionStatus?: string | null;
    flyersUsed?: number;
    plan?: Plan | null;
    flyerCount?: number;
  }
}
