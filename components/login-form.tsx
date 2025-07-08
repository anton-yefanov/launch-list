"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

export const LoginForm = ({ title }: { title: ReactNode }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    try {
      const result = await signIn("resend", {
        email,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
        redirect: false,
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
      } else {
        // Redirect to verification page or show success message
        window.location.href =
          "/auth/verify-request?email=" + encodeURIComponent(email);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-2 text-center select-none">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          draggable={false}
          className="rounded mx-auto mb-4"
        />
        {title}
      </div>
      <Card className="shadow-none p-7 gap-2">
        <Button
          onClick={() =>
            signIn("google", {
              redirectTo: DEFAULT_LOGIN_REDIRECT,
            })
          }
          variant="outline"
          size="lg"
          className="active:scale-98 transition-all duration-100"
        >
          <Image
            src="/google_logo.png"
            alt="google logo"
            width={18}
            height={18}
          />
          <div className="">Continue with Google</div>
        </Button>

        <div className="mx-auto text-xs select-none">OR</div>

        <form onSubmit={handleEmailSignIn} className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your personal or work email"
            className="select-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="active:scale-98 transition-all duration-100 w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? "Sending..." : "Continue with email"}
          </Button>
        </form>
      </Card>
    </>
  );
};
