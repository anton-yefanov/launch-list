import { NextAuthConfig } from "next-auth";
import Google from "@auth/core/providers/google";

export default {
  providers: [Google({})],
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
