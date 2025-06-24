import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-4xl font-semibold text-center">Welcome back</h1>
      <Card className="shadow-none p-7 gap-2">
        <Button variant="outline" size="lg" className="py-6">
          <Image
            src="/google_logo.png"
            alt="google logo"
            width={18}
            height={18}
          />
          <div className="text-lg font-semibold">Continue with Google</div>
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="lg">
            <Image
              src="/github_logo.webp"
              alt="github logo"
              width={24}
              height={24}
            />
            <div className="">Continue with GitHub</div>
          </Button>
          <Button variant="outline" size="lg">
            <Image
              src="/x_logo.png"
              alt="twitter logo"
              width={22}
              height={22}
            />
            Continue with Twitter
          </Button>
        </div>
      </Card>
    </div>
  );
}
