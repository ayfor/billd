import type { NextAuthConfig } from "next-auth";

// Edge-safe base config (imported by middleware). No bcrypt / Prisma / pg here —
// those would break the edge runtime. The Credentials provider with the real
// authorize() lives in src/lib/auth.ts (Node runtime only).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
