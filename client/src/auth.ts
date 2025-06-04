import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
interface Credentials {
  email: string;
  password: string;
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials: Credentials) {

        
      },
    }),
  ],
});
