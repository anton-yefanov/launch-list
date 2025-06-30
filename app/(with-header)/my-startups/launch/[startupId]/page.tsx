"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronUp, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LaunchWeek from "@/app/(with-header)/my-startups/launch/[startupId]/_components/launch-week";

export default function StartupLaunchPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-3">Select launch week</h1>
      <div className="flex flex-col gap-2 mb-2">
        <LaunchWeek />
        <LaunchWeek />
        <LaunchWeek />
        <LaunchWeek />
      </div>
      {/*<div className="mb-1 font-medium text-lg">Preview</div>*/}
      {/*<Product />*/}
    </div>
  );
}

const Product = () => {
  const [upvoted, setUpvoted] = useState<boolean>(false);

  const handleUpvoteClick = () => {
    setUpvoted(!upvoted);

    console.log("User is authenticated - add your upvote logic here");
  };

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
          onClick={handleUpvoteClick}
          className={cn(
            "cursor-pointer size-12.5 ml-auto active:scale-90 flex flex-col gap-0 transition-all duration-120",
            upvoted
              ? "border-primary-color text-primary-color hover:text-primary-color"
              : "",
          )}
        >
          <ChevronUp strokeWidth={2} />1
        </Button>
      </div>
    </>
  );
};
