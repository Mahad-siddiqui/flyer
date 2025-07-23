import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            plan: true,
            _count: {
              select: { flyers: true },
            },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          planId: user.planId,
          subscriptionStatus: user.subscriptionStatus,
          flyersUsed: user.flyersUsed,
          plan: user.plan,
          flyerCount: user._count.flyers,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist user data in JWT token
      if (user) {
        token.id = user.id;
        token.planId = user.planId;
        token.subscriptionStatus = user.subscriptionStatus;
        token.flyersUsed = user.flyersUsed;
        token.plan = user.plan;
        token.flyerCount = user.flyerCount;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        ...session.user,
        id: token.id as string,
        planId: token.planId as string,
        subscriptionStatus: token.subscriptionStatus as string,
        flyersUsed: token.flyersUsed as number,
        plan: token.plan as any,
        flyerCount: token.flyerCount as number,
      };
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create free plan for new users
            const freePlan = await prisma.plan.findFirst({
              where: { name: "Free" },
            });

            if (freePlan) {
              await prisma.user.update({
                where: { email: user.email! },
                data: { planId: freePlan.id },
              });
            }
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt", // Changed from "database" to "jwt"
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};