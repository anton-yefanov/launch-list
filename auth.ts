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
    async jwt({ token, user, trigger }) {
      // Only fetch user data on sign in or when explicitly updating
      if (user || trigger === "update") {
        try {
          await connectToDatabase();

          const dbUser = await User.findById(token.sub);
          if (dbUser) {
            token.role = dbUser.role;
            token.launchListCount = dbUser.launchList?.length || 0;
            token.launchedDirectoriesCount =
              dbUser.launchedDirectories?.length || 0;
          }
        } catch (error) {
          console.error("Error fetching user data for JWT:", error);
        }
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;

        // If counts are not in token (e.g., existing session), fetch from DB
        if (
          token.launchListCount === undefined ||
          token.launchedDirectoriesCount === undefined
        ) {
          try {
            await connectToDatabase();
            const dbUser = await User.findById(token.sub);
            if (dbUser) {
              session.user.role = dbUser.role;
              session.user.launchListCount = dbUser.launchList?.length || 0;
              session.user.launchedDirectoriesCount =
                dbUser.launchedDirectories?.length || 0;
            }
          } catch (error) {
            console.error("Error fetching user data for session:", error);
            // Fallback values
            session.user.role = token.role || "REGULAR";
            session.user.launchListCount = 0;
            session.user.launchedDirectoriesCount = 0;
          }
        } else {
          // Use cached values from token
          session.user.role = token.role || "REGULAR";
          session.user.launchListCount = token.launchListCount;
          session.user.launchedDirectoriesCount =
            token.launchedDirectoriesCount;
        }
      }
      return session;
    },
  },
  ...authConfig,
});
