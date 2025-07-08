import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/database/mongo";

export const { handlers, auth } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.NODE_ENV === "development" ? "test" : "prod",
  }),
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  ...authConfig,
});
