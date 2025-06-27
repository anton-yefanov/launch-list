import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const LoginForm = () => {
  return (
    <>
      <div className="mb-6 text-center select-none">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            draggable={false}
            className="rounded mx-auto mb-4"
          />
        </Link>
        <h1 className="text-2xl font-semibold">
          <span className="font-normal">Let&#39;s launch your product,</span>
          <br /> everywhere!
        </h1>
      </div>
      <Card className="shadow-none p-7 gap-2">
        <Button
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
        <div className="mx-auto text-xs select-none">OR</div>
        <Input
          type="email"
          placeholder="Enter your personal or work email"
          className="select-none"
        />
        <Button className="active:scale-98 transition-all duration-100">
          Continue with email
        </Button>
      </Card>
    </>
  );
};
