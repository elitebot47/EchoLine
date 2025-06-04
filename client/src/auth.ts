import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import { JWT } from "next-auth/jwt";
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
        // if (!credentials.email || !credentials.password) {
        //   return null;
        // }

        const email = String(credentials?.email).trim().toLowerCase();
        const password = credentials?.password;
        console.log(email, "$", password);

        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          console.log(`user:${user}`);
          if (!user || user.password !== password) return null;
          console.log(`user:${user}`);

          if (!user) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
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
      }
      return token;
    },
    async session({ session, token }: { session: any; token?: JWT }) {
      if (session.user) {
        if (token) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
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
