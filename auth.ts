import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./src/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "@/modules/user/user.service";
import bcrypt from "bcryptjs";
import { UserStatus } from "@/generated/prisma/enums";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await getUserFromDb(credentials.email as string);

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string,
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        console.log("user", user)
        return user;
        // return {
        //   id: user.id,
        //   email: user.email,
        //   name: user.name,
        //   image: user.image,
        //   status: user.status,
        // };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.status = token.status as UserStatus;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
