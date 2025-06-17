import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Check if user exists in database
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // User exists, add user data to token
          token.id = existingUser.id;
          token.name = existingUser.name;
          token.email = existingUser.email;
          token.image = existingUser.image;
        } else {
          // Create new user if doesn't exist
          const newUser = await db.user.create({
            data: {
              name: user.name,
              email: user.email!,
              image: user.image,
            },
          });
          token.id = newUser.id;
          token.name = newUser.name;
          token.email = newUser.email;
          token.image = newUser.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        // Set token data to session
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to home page after successful login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});