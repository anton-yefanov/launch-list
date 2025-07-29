"use client";

import { type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DollarSign,
  TrendingUp,
  PawPrint,
  ArrowUpRight,
  Rocket,
} from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { DirectoryTag } from "@/types/DirectoryTag";
import { DirectoryType } from "@/types/DirectoryType";
import Link from "next/link";

export const Directory = ({
  directory,
  buttonComponent,
}: {
  directory: DirectoryType;
  buttonComponent: ReactNode;
}) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDirectoryNameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(directory.url, "_blank");
  };

  return (
    <TooltipProvider>
      {/* Mobile version */}
      <Link
        href={`/website/${directory.slug}`}
        target="_blank"
        className="group flex flex-col select-none bg-white border p-3 rounded-md sm:hidden cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-3 items-center flex-1 min-w-0">
            <div
              style={{ backgroundColor: directory.bgColor }}
              className="shrink-0 transition-all cursor-pointer text-black font-extrabold p-1.5 size-10 border rounded-md grid place-items-center"
            >
              <div className="relative">
                <div className="bg-white relative rounded text-xs px-0.5 border size-5 grid place-items-center border-black -rotate-6 z-10">
                  {directory.name[0].toUpperCase()}
                </div>
                <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded -rotate-12 group-hover:-rotate-6 transition-transform duration-150 ease-in-out" />
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div
                className="flex gap-1 items-center group w-fit cursor-pointer hover:underline"
                onClick={handleDirectoryNameClick}
              >
                <div className="font-semibold text-base truncate">
                  {directory.name}
                </div>
                <ArrowUpRight size={12} className="shrink-0" />
              </div>
              <div className="text-xs text-gray-600">
                Launch to get backlink
              </div>
            </div>
          </div>
          <div className="shrink-0 ml-2" onClick={handleButtonClick}>
            {buttonComponent}
          </div>
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

          <div className="flex items-center -space-x-1.5">
            {directory.tags.find(
              (tag) => tag === DirectoryTag.SmallStartups,
            ) && (
              <Tooltip>
                <TooltipTrigger>
                  <PawPrint
                    className="size-8 p-1.5 text-sky-400 bg-sky-100 rounded-full border-2 border-white relative"
                    size={20}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Perfect for small startups</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.viewsPerMonth >= 20000 && (
              <Tooltip>
                <TooltipTrigger>
                  <TrendingUp
                    className="size-8 p-1.5 text-rose-400 bg-rose-100 rounded-full border-2 border-white relative"
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
                  <div className="text-[14px] font-semibold size-8 p-1 grid place-items-center text-purple-400 bg-purple-100 rounded-full border-2 border-white relative">
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
                    className="size-8 p-1.5 text-yellow-400 bg-yellow-100 rounded-full border-2 border-white relative"
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
                  <div className="size-8 place-items-center grid rounded-full border-2 border-white text-green-400 bg-green-100 relative">
                    <Rocket size={16} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Launch for Free</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </Link>

      {/* Desktop version */}
      <Link
        href={`/website/${directory.slug}`}
        target="_blank"
        className="group hidden sm:flex cursor-pointer select-none justify-between gap-1.5 bg-white border p-2 pr-4 rounded-md hover:bg-gray-50 transition-colors"
      >
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: directory.bgColor }}
            className="shrink-0 transition-all cursor-pointer text-black font-extrabold p-2 size-12 border rounded-md grid place-items-center"
          >
            <div className="relative">
              <div className="bg-white relative grid place-items-center rounded text-sm px-1 border size-6 border-black -rotate-6 z-10">
                {directory.name[0].toUpperCase()}
              </div>
              <div className="absolute size-full bg-black -left-0.5 top-[1px] rounded -rotate-12 group-hover:-rotate-6 transition-transform duration-150 ease-in-out" />
            </div>
          </div>
          <div className="flex flex-col">
            <div
              className="flex gap-1 group items-center group w-fit cursor-pointer"
              onClick={handleDirectoryNameClick}
            >
              <div className="font-semibold text-lg">{directory.name}</div>
              <ArrowUpRight
                size={12}
                className="sm:hidden sm:group-hover:flex"
              />
            </div>
            <div className="text-xs">
              {`Launch here to get a ${directory.domainRating >= 50 ? "high authority " : ""}backlink`}
            </div>
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
            {directory.viewsPerMonth >= 20000 && (
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
                  <div className="size-6 place-items-center grid rounded-full border-2 border-white text-green-400 bg-green-100/70 relative">
                    <Rocket size={12} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Launch for Free</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 items-center justify-center min-w-[70px]">
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
          <div onClick={handleButtonClick}>{buttonComponent}</div>
        </div>
      </Link>
    </TooltipProvider>
  );
};
