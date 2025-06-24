"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronUp, Dot } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LaunchPage() {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Launching this week</h1>
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
    </>
  );
}

const Product = () => {
  const [upvoted, setUpvoted] = useState<boolean>(false);

  return (
    <div className="rounded-lg p-2.5 flex gap-2 select-none hover:bg-gray-100/50">
      <div className="shrink-0 pt-1">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          draggable={false}
          className="rounded"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <div className="font-semibold">Flex</div>
        <div>The ultimate AI social media scheduling tool</div>
        <div className="flex text-xs items-center">
          <div>by Anton</div>
          <Dot size={16} className="text-gray-300" />
          <div>AI</div>
          <Dot size={16} className="text-gray-300" />
          <div>Directory</div>
        </div>
      </div>
      <Button
        variant="outline"
        className={cn(
          "cursor-pointer size-12.5 ml-auto active:scale-90 flex flex-col gap-0 transition-all duration-120",
          upvoted
            ? "border-primary-orange text-primary-orange hover:text-primary-orange"
            : "",
        )}
        onClick={() => setUpvoted(!upvoted)}
      >
        <ChevronUp strokeWidth={2} />
        12
      </Button>
    </div>
  );
};
