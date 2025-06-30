"use client";

import Image from "next/image";
import { Dot, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyStartupsPage() {
  return (
    <div>
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-semibold mb-4">My startups</h1>
        <Button size="sm" variant="outline">
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
        <div className="flex flex-col">
          <div className="font-semibold text-lg">Flex</div>
          <div className="mb-1">
            The ultimate AI social media scheduling tool
          </div>
          <div className="flex text-xs items-center">
            <div>by Anton</div>
            <Dot size={16} className="text-gray-300" />
            <div>AI</div>
            <Dot size={16} className="text-gray-300" />
            <div>Directory</div>
          </div>
        </div>
        <Button className="ml-auto active:scale-95 transition-all duration-120 bg-primary-color hover:bg-primary-color/80">
          Launch
          <Rocket />
        </Button>
      </div>
    </>
  );
};
