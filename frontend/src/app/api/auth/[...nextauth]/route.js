import NextAuth, { NextAuthOptions } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { setCookie } from "nookies";
import { defineAxiosHeaderWithToken } from "@/api";
import { api } from "@/api";

const nextAuthOptions = {
  session: {
    strategy: "jwt",
    jwt: true,
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "text" },
      },
      authorize: async (credentials) => {
        const data = {
          email: credencials?.email,
          password: credencials?.password,
        };
        const response = await api.post("/auth/", data);

        const user = await response;
        if (user && response) {
          setCookie(null, "token", response.data.token, {
            maxAge: 68400 * 7,
            path: "/",
          });
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      console.log("No JWT: ", token);
      return { ...token, ...user };
    },
    session: async ({ session, token, user }) => {
      session.user = token;
      console.log("Na sessão: ", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
