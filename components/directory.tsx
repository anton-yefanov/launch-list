"use client";

import { type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, DollarSign, TrendingUp, PawPrint } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { DirectoryTag } from "@/types/DirectoryTag";
import { useRouter } from "next/navigation";

interface DirectoryType {
  _id: string;
  name: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: string[];
  submitDifficulty: string;
}

export const Directory = ({
  directory,
  buttonComponent,
}: {
  directory: DirectoryType;
  buttonComponent: ReactNode;
}) => {
  const router = useRouter();

  return (
    <TooltipProvider>
      <div className="flex flex-col select-none bg-white border p-3 rounded-md sm:hidden">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-3 items-center flex-1">
            <div
              style={{ backgroundColor: directory.bgColor }}
              className="shrink-0 transition-all cursor-pointer text-black font-extrabold p-1.5 size-10 border rounded-md grid place-items-center group"
              onClick={() => router.push(`/directory/${directory._id}`)}
            >
              <div className="relative">
                <div className="bg-white relative rounded-xs text-xs px-0.5 border h-5 w-4 grid place-items-center border-black -rotate-6 z-10">
                  {directory.name[0].toUpperCase()}
                </div>
                <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12 group-hover:-rotate-6 transition-transform duration-150 ease-in-out" />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div className="font-semibold text-base truncate">
                {directory.name}
              </div>
              <div className="text-xs text-gray-600">An OG Launch platform</div>
            </div>
          </div>
          <div className="shrink-0 ml-2">{buttonComponent}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="font-bold text-sm">
                {formatNumber(directory.viewsPerMonth)}
              </div>
              <div className="text-[10px] text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm">{directory.domainRating}</div>
              <div className="text-[10px] text-gray-500">DR</div>
            </div>
          </div>

          <div className="flex items-center -space-x-0.5">
            {directory.tags.find(
              (tag) => tag === DirectoryTag.SmallStartups,
            ) && (
              <Tooltip>
                <TooltipTrigger>
                  <PawPrint
                    className="size-5 p-0.5 text-sky-400 bg-sky-100 rounded-full border border-white relative"
                    size={20}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Perfect for small startups</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.viewsPerMonth >= 10000 && (
              <Tooltip>
                <TooltipTrigger>
                  <TrendingUp
                    className="size-5 p-0.5 text-rose-400 bg-rose-100 rounded-full border border-white relative"
                    size={20}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>High traffic</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.tags.find((tag) => tag === DirectoryTag.AI) && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-[10px] font-semibold size-5 grid place-items-center p-0 text-purple-400 bg-purple-100 rounded-full border border-white relative">
                    AI
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Focus on AI</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.tags.find(
              (tag) => tag === DirectoryTag.PaidFeatures,
            ) && (
              <Tooltip>
                <TooltipTrigger>
                  <DollarSign
                    className="size-5 p-0.5 text-yellow-400 bg-yellow-100 rounded-full border border-white relative"
                    size={20}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Website offers Paid features</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.tags.find((tag) => tag === DirectoryTag.FreeLaunch) && (
              <Tooltip>
                <TooltipTrigger>
                  <Check
                    className="size-5 p-0.5 text-green-400 bg-green-100 rounded-full border border-white relative"
                    size={20}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Launch for Free</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div className="hidden sm:flex select-none justify-between gap-1.5 bg-white border p-2 pr-4 rounded-md">
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: directory.bgColor }}
            className="shrink-0 transition-all cursor-pointer text-black font-extrabold p-2 size-12 border rounded-md grid place-items-center group"
            onClick={() => router.push(`/directory/${directory._id}`)}
          >
            <div className="relative">
              <div className="bg-white relative rounded-xs text-sm px-1 border h-6 w-5.5 grid place-items-center border-black -rotate-6 z-10">
                {directory.name[0].toUpperCase()}
              </div>
              <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12 group-hover:-rotate-6 transition-transform duration-150 ease-in-out" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-lg">{directory.name}</div>
            <div className="text-xs">An OG Launch platform</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-1">
            {directory.tags.find(
              (tag) => tag === DirectoryTag.SmallStartups,
            ) && (
              <Tooltip>
                <TooltipTrigger>
                  <PawPrint
                    className="size-6 p-1 text-sky-400 bg-sky-100 rounded-full border-2 border-white relative"
                    size={25}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Perfect for small startups</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.viewsPerMonth >= 10000 && (
              <Tooltip>
                <TooltipTrigger>
                  <TrendingUp
                    className="size-6 p-1 text-rose-400 bg-rose-100 rounded-full border-2 border-white relative"
                    size={25}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>High traffic</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.tags.find((tag) => tag === DirectoryTag.AI) && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-xs font-semibold size-6 grid place-items-center p-0 text-purple-400 bg-purple-100 rounded-full border-2 border-white relative">
                    AI
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Focus on AI</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.tags.find(
              (tag) => tag === DirectoryTag.PaidFeatures,
            ) && (
              <Tooltip>
                <TooltipTrigger>
                  <DollarSign
                    className="size-6 p-1 text-yellow-500 bg-yellow-100/70 rounded-full border-2 border-white relative"
                    size={25}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Website offers Paid features</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.tags.find((tag) => tag === DirectoryTag.FreeLaunch) && (
              <Tooltip>
                <TooltipTrigger>
                  <Check
                    className="size-6 p-1 text-green-500 bg-green-100/70 rounded-full border-2 border-white relative"
                    size={25}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Launch for Free</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 items-center">
              <div className="grid place-items-center h-fit w-10">
                <span className="font-bold text-sm">
                  {formatNumber(directory.viewsPerMonth)}
                </span>
                <span className="text-[8px]">Views</span>
              </div>
              <div className="grid place-items-center h-fit">
                <span className="font-bold text-sm">
                  {directory.domainRating}
                </span>
                <span className="text-[8px]">DR</span>
              </div>
            </div>
          </div>
          {buttonComponent}
        </div>
      </div>
    </TooltipProvider>
  );
};
