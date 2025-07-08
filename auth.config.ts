import { NextAuthConfig } from "next-auth";
import Google from "@auth/core/providers/google";
import Resend from "next-auth/providers/resend";

export default {
  providers: [Google, Resend],
  session: {
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;
