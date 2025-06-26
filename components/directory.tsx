"use client";

import { ReactNode, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign, Gem } from "lucide-react";
import { ProductCardDialog } from "@/app/collections/_components/product-card-dialog";

export const Directory = ({
  title,
  bgColor = "bg-primary-color",
  buttonComponent,
}: {
  title: string;
  bgColor?: string;
  buttonComponent: ReactNode;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const directoryData = {
    title,
    bgColor,
    description: "An OG Launch platform",
    views: "200k",
    domainRating: "96",
    isFree: true,
    hasPaidFeatures: true,
    ranking: 10,
  };

  return (
    <>
      <div className="flex select-none justify-between gap-1.5 bg-white border p-2 pr-4 rounded-md">
        <div className="flex gap-2">
          <div
            className={`${bgColor} shrink-0 cursor-pointer text-black font-extrabold p-2 size-12 border rounded-md grid place-items-center group`}
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="relative">
              <div className="bg-white relative rounded-xs text-sm px-1 border border-black -rotate-6 z-10">
                {title[0]}
              </div>
              <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12 group-hover:-rotate-6 transition-transform duration-150 ease-in-out" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-lg">{title}</div>
            <div className="text-xs">An OG Launch platform</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <DollarSign
                  className="size-6 p-1 text-green-400 bg-green-300/30 rounded-full"
                  size={25}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Launch for Free</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Gem
                  className="size-6 p-1 text-yellow-400 bg-yellow-300/30 rounded-full"
                  size={25}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Website offers Paid features</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-xs font-semibold size-6 p-1 text-rose-400 bg-rose-300/30 rounded-full">
                  10
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Top 10</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 items-center">
              <div className="grid place-items-center h-fit">
                <span className="font-bold">200k</span>
                <span className="text-[8px]">Views</span>
              </div>
              <div className="grid place-items-center h-fit">
                <span className="font-bold">96</span>
                <span className="text-[8px]">DR</span>
              </div>
            </div>
          </div>
          {buttonComponent}
        </div>
      </div>
      <ProductCardDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        directory={directoryData}
      />
    </>
  );
};
