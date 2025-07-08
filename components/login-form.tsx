"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { ReactNode } from "react";

export const LoginForm = ({ title }: { title: ReactNode }) => {
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
        {/*<Button*/}
        {/*  variant="outline"*/}
        {/*  size="lg"*/}
        {/*  className="active:scale-98 transition-all duration-100"*/}
        {/*>*/}
        {/*  <Image*/}
        {/*    src="/github_logo.webp"*/}
        {/*    alt="github logo"*/}
        {/*    width={24}*/}
        {/*    height={24}*/}
        {/*  />*/}
        {/*  <div className="">Continue with GitHub</div>*/}
        {/*</Button>*/}
        {/*<Button*/}
        {/*  variant="outline"*/}
        {/*  size="lg"*/}
        {/*  className="active:scale-98 transition-all duration-100"*/}
        {/*>*/}
        {/*  <Image src="/x_logo.png" alt="twitter logo" width={22} height={22} />*/}
        {/*  Continue with Twitter*/}
        {/*</Button>*/}
        {/*<div className="mx-auto text-xs select-none">OR</div>*/}
        {/*<Input*/}
        {/*  type="email"*/}
        {/*  placeholder="Enter your personal or work email"*/}
        {/*  className="select-none"*/}
        {/*/>*/}
        {/*<Button className="active:scale-98 transition-all duration-100">*/}
        {/*  Continue with email*/}
        {/*</Button>*/}
      </Card>
    </>
  );
};
