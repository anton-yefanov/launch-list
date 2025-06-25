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
        <div className="flex flex-col items-center sm:items-start ">
          <div className="text-3xl text-center sm:text-left font-medium mb-4">
            Don&#39;t forget
            <br /> to launch,
            <br /> everywhere!
          </div>
          <Button className="px-16 bg-primary-color hover:bg-primary-color/90 active:scale-95 transition-all duration-120">
            Browse all
          </Button>
        </div>
        <div className="h-40 w-full relative">
          <div className="h-50 bg-gradient-to-br from-white to-sky-50 border p-4 shadow-lg sm:-bottom-2 -bottom-6 group-hover:-bottom-0 group-hover:shadow-xl rounded-t-lg -right-0 relative transition-all duration-125">
            <div className="flex gap-1.5 mb-2">
              <Image
                src="/star_icon.png"
                alt="star"
                width={20}
                height={20}
                draggable={false}
                className="select-none"
              />
              <span className="text-sm select-none font-semibold">
                Best directories 2025
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Directory title="Product Hunt" bgColor="bg-orange-600" />
              <Directory title="Tiny Launch" bgColor="bg-rose-600" />
              <Directory title="Launch List" bgColor="bg-slate-600" />
            </div>
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

const Directory = ({
  title,
  bgColor = "bg-primary-color",
}: {
  title: string;
  bgColor?: string;
}) => {
  return (
    <div className="flex select-none justify-between gap-1.5 bg-white border p-1 pr-3 rounded-md">
      <div className="flex gap-1.5">
        <div
          className={`${bgColor} text-black font-extrabold p-2 size-10 border rounded-md grid place-items-center`}
        >
          <div className="relative">
            <div className="bg-white relative rounded-xs text-sm px-1 border border-black -rotate-6 z-10">
              {title[0]}
            </div>
            <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs">Free</div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="grid place-items-center">
          <span className="font-bold h-[10px]">200k</span>
          <span className="text-[8px]">Views</span>
        </div>
        <div className="grid place-items-center">
          <span className="font-bold h-[10px]">96</span>
          <span className="text-[8px]">DR</span>
        </div>
      </div>
    </div>
  );
};

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
