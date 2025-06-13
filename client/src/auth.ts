import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { VerifyPassword } from "./lib/hash";
import { prisma } from "./lib/prisma";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const email = String(credentials?.email).trim().toLowerCase();
        const password = String(credentials?.password).trim();
        console.log(email, "$", password);

        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (!user?.password) {
            return null;
          }
          const passwordCorrect = await VerifyPassword(
            user?.password,
            password
          );
          console.log(`user:${user}`);
          if (!user || !passwordCorrect) return null;
          console.log(`user:${user}`);

          if (!user) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.log("error while login:", error);

          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: any; token?: JWT }) {
      if (session.user) {
        if (token) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.image = token.image;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

  trustHost: true,
});
