"use client";

import Image from "next/image";
import { Plus, Rocket } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MyStartupsPage() {
  return (
    <div>
      <div className="flex items-center justify-between px-2.5">
        <h1 className="text-2xl font-semibold mb-4">My startups</h1>
        <Button variant="outline">
          <Plus /> Add new
        </Button>
      </div>
      <Product />
    </div>
  );
}

const Product = () => {
  return (
    <>
      <div className="rounded-lg p-2.5 flex gap-2 select-none hover:bg-gray-100/50">
        <div className="shrink-0">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            draggable={false}
            className="rounded"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-semibold text-lg">Flex</div>
          <div>The ultimate AI social media scheduling tool</div>
        </div>
        <Link
          href="/my-startups/launch/1"
          className={cn(
            buttonVariants({ variant: "default" }),
            "ml-auto my-auto active:scale-95 transition-all duration-120 bg-primary-color hover:bg-primary-color/80",
          )}
        >
          Launch <Rocket />
        </Link>
      </div>
    </>
  );
};
