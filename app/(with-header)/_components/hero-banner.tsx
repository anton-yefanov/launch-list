"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export const HeroBanner = () => {
  const { status } = useSession();
  const isAuth = status === "authenticated";

  return (
    <div className="select-none rounded-2xl shadow-none text-center py-10 px-10 bg-gradient-to-b relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Launch your Product Today
        </h1>
        <h2 className="text-lg sm:text-2xl font-bold">
          Get a Badge &{" "}
          <Link
            href="https://frogdr.com/launch-list.org"
            target="_blank"
            className="hover:underline"
          >
            40+
          </Link>{" "}
          DR Backlink
          <Tooltip>
            <TooltipTrigger className="ml-1 sm:ml-2">
              <Info className="size-3 sm:size-4" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-50 text-center">
              <p>
                Top 3 Products receive a high-authority dofollow Backlink.{" "}
                <b>Dofollow Backlink is guaranteed</b> when you embed a badge
                with dofollow link to https://www.launch-list.org on your
                website&#39;s home page
              </p>
            </TooltipContent>
          </Tooltip>
        </h2>
        <div className="w-full flex flex-col gap-3 mt-8 px-2 sm:px-34">
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = isAuth ? "/submit/product" : "/login";
            }}
            className="cursor-pointer flex-1 hover:scale-102 transition-all duration-100 active:scale-98"
          >
            Submit Product to Launch List
            <Image
              src="/logo_clear.svg"
              alt="logo"
              width={20}
              height={20}
              draggable={false}
              className="rounded"
            />
          </Button>
          <Link
            href="/websites"
            className="text-sm hover:underline w-fit mx-auto"
          >
            Explore Launch Websites
          </Link>
        </div>
      </div>
    </div>
  );
};
