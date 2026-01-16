import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Ensure Prisma client is initialized
if (!prisma) {
  console.error("Prisma client is not initialized");
}

const isProduction = process.env.NODE_ENV === "production";
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (isProduction && !nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is required in production.");
}

if (!isProduction) {
  console.warn("dev-only: NEXTAUTH_SECRET is not required in development, but set it for production.");
}

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Auth] Authorize called with email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing email or password");
          return null;
        }

        try {
          // Ensure Prisma is available
          if (!prisma) {
            console.error("[Auth] Prisma client is not available");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("[Auth] User not found:", credentials.email);
            return null;
          }

          if (!user.password) {
            console.log("[Auth] User has no password set:", credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isValid) {
            console.log("[Auth] Invalid password for:", credentials.email);
            return null;
          }

          console.log("[Auth] Login successful for:", credentials.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[Auth] Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      if (user) {
        token.role = user.role as string;
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/giris",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret:
    nextAuthSecret ??
    process.env.AUTH_SECRET ??
    "fallback-secret-for-development-min-32-chars-long",
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
