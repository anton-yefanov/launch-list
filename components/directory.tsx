"use client";

import { ReactNode, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign, Gem } from "lucide-react";
import { ProductCardDialog } from "@/app/(with-header)/collections/_components/product-card-dialog";
import { formatNumber } from "@/lib/formatNumber";
import { DirectoryTag } from "@/types/DirectoryTag";
import { DirectoryType } from "@/types/DirectoryType";

export const Directory = ({
  directory,
  buttonComponent,
}: {
  directory: DirectoryType;
  buttonComponent: ReactNode;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex select-none justify-between gap-1.5 bg-white border p-2 pr-4 rounded-md">
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: directory.bgColor }}
            className="shrink-0 cursor-pointer text-black font-extrabold p-2 size-12 border rounded-md grid place-items-center group"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="relative">
              <div className="bg-white relative rounded-xs text-sm px-1 border border-black -rotate-6 z-10">
                {directory.name[0]}
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
          <div className="flex items-center -space-x-2">
            {directory.tags.find((tag) => tag === DirectoryTag.FreeLaunch) && (
              <Tooltip>
                <TooltipTrigger>
                  <DollarSign
                    className="size-6 p-1 text-green-400 bg-green-100 rounded-full border-2 border-white relative"
                    size={25}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Launch for Free</p>
                </TooltipContent>
              </Tooltip>
            )}
            {directory.tags.find(
              (tag) => tag === DirectoryTag.PaidFeatures,
            ) && (
              <Tooltip>
                <TooltipTrigger>
                  <Gem
                    className="size-6 p-1 text-yellow-400 bg-yellow-100 rounded-full border-2 border-white relative"
                    size={25}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Website offers Paid features</p>
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
      <ProductCardDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        directory={directory}
      />
    </>
  );
};
