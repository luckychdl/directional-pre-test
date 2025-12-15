/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!API_BASE_URL)
          throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");

        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) return null;

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const accessToken = data.token ?? data.accessToken;
        if (!accessToken) return null;

        return { ...data?.user, accessToken } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.user.id = token.userId;
      session.user.email = token.email;
      return session;
    },
  },
};
