import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/database/mongo";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export const { handlers, auth } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.NODE_ENV === "development" ? "test" : "prod",
  }),
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;

        try {
          await connectToDatabase();

          const user = await User.findById(token.sub);
          if (user) {
            session.user.role = user.role;
          }
        } catch (error) {
          console.error("Error fetching user role for session:", error);
        }
      }
      return session;
    },
  },
  ...authConfig,
});
