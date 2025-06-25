"use client";

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, ChevronUp, Dot } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import scss from "./styles.module.scss";
import Link from "next/link";

export default function LaunchPage() {
  return (
    <div>
      <div className="pb-8 flex justify-between">
        <div className="shrink-0 select-none">
          <Image
            src="/logo.png"
            alt="logo"
            width={36}
            height={36}
            draggable={false}
            className="rounded"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-primary-color hover:bg-primary-color/90 active:scale-90 transition-all duration-120">
            <Plus />
            Submit
          </Button>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Login
          </Link>
        </div>
      </div>
      <div className="border rounded-lg p-8 grid overflow-hidden grid-cols-1 sm:grid-cols-2 group">
        <div>
          <div className="text-3xl font-medium mb-4">
            Don&#39;t forget
            <br /> to launch
            <br /> everywhere!
          </div>
          <Button className="px-10 bg-primary-color hover:bg-primary-color/90 active:scale-95 transition-all duration-120">
            Browse collection
          </Button>
        </div>
        <div className="w-full h-full min-w-1 relative">
          <div className="h-45 w-80 border p-4 shadow-lg group-hover:shadow-xl rounded-t-lg absolute -right-0 -bottom-11 group-hover:-bottom-9 transition-all duration-125">
            Top directories 2025
          </div>
        </div>
      </div>
      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-2">*/}
      {/*  <FeaturedProduct />*/}
      {/*  <FeaturedProduct />*/}
      {/*  <FeaturedProduct />*/}
      {/*  <FeaturedProduct />*/}
      {/*</div>*/}
      <div className="flex justify-between items-center px-2.5 my-4 flex-col-reverse gap-2 sm:flex-row">
        <h1 className="text-4xl font-semibold">Launching now</h1>
        <div className="flex flex-col gap-2 items-center">
          <div className="text-xs">Next launch week in</div>
          <FlipClockCountdown
            to={new Date().getTime() + 24 * 3600 * 1000 + 5000}
            renderOnServer
            className={scss.flipclock}
          />
        </div>
      </div>
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <h2 className="text-3xl font-semibold my-4 px-2.5">Last week winners</h2>
      <WinnerProduct place={1} />
      <WinnerProduct place={2} />
      <WinnerProduct place={3} />
    </div>
  );
}

const WinnerProduct = ({ place }: { place: 1 | 2 | 3 }) => {
  return (
    <div className="relative rounded-lg p-2.5 flex gap-2 select-none">
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
      <Image
        src={getCupByPlace(place)}
        alt="logo"
        width={50}
        height={50}
        draggable={false}
        className="rounded absolute -left-5 top-2 -rotate-10"
      />
      <Button
        variant="outline"
        className="size-12.5 ml-auto flex flex-col gap-0 hover:bg-background"
      >
        12
      </Button>
    </div>
  );
};

const FeaturedProduct = () => {
  return (
    <div className="border rounded-lg p-2.5 flex gap-2 select-none hover:bg-gray-100/50 cursor-pointer">
      <div className="shrink-0">
        <Image
          src="/logo.png"
          alt="logo"
          width={75}
          height={75}
          draggable={false}
          className="rounded"
        />
      </div>
      <div className="flex flex-col space-y-1 w-full">
        <div className="flex justify-between">
          <div className="font-semibold text-lg">Flex</div>
          <span className="text-xs py-1 px-2 rounded bg-primary-color/10 h-fit">
            Featured
          </span>
        </div>
        <div className="text-sm">
          The ultimate AI social media scheduling tool
        </div>
      </div>
    </div>
  );
};

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
            ? "border-primary-color text-primary-color hover:text-primary-color"
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

const getCupByPlace = (place: 1 | 2 | 3): string => {
  switch (place) {
    case 1:
      return "/golden_cup.png";
    case 2:
      return "/silver_cup.png";
    case 3:
      return "/bronze_cup.png";
  }
};
