import { NextAuthConfig } from "next-auth";
import Google from "@auth/core/providers/google";
import { Resend } from "resend";
import { User } from "@/models/User";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    {
      id: "resend",
      name: "Email",
      type: "email",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await resend.emails.send({
            from: "auth@launch-list.org",
            to: email,
            subject: "Sign in to Launch List",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Sign in to Launch List</h2>
                <p>Click the button below to sign in to your account:</p>
                <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                  Sign In
                </a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${url}</p>
                <p>This link will expire in 24 hours.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Error sending magic link:", error);
          throw new Error("Failed to send verification email");
        }
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  events: {
    async createUser({ user }) {
      try {
        await User.findByIdAndUpdate(user.id, { role: "REGULAR" });
        console.log(
          `Set role to REGULAR for newly created user: ${user.email}`,
        );
      } catch (error) {
        console.error("Error setting role for new user:", error);
      }
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
