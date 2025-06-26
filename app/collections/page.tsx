"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilterIcon as Funnel,
  ListFilter,
  Plus,
  FileInput,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Directory } from "@/components/directory";
import { useMemo } from "react";

export default function CollectionPage() {
  const AddButton = useMemo(() => {
    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Plus />
          Add
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Add to Launch List</p>
        </TooltipContent>
      </Tooltip>
    );
  }, []);

  return (
    <TooltipProvider>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Card title="I launched on 100+ directories" category="Blog" />
          <Card
            title="Best directories for Smalls Startup (75+)"
            category="Collection"
          />
          <Card
            title="Best directories for Smalls Startup (75+)"
            category="Collection"
          />
        </div>
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-2">
            <div className="text-xl font-semibold">75 Directories</div>
            <Button variant="outline" size="sm">
              <FileInput />
              Save all to Launch List
            </Button>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger
                className={cn(buttonVariants({ variant: "outline" }), "size-8")}
              >
                <ListFilter />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Sort</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                className={cn(buttonVariants({ variant: "outline" }), "size-8")}
              >
                <Funnel />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Filter</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Directory
            title="Product Hunt"
            bgColor="bg-orange-600"
            buttonComponent={AddButton}
          />
          <Directory
            title="Indie Hackers"
            bgColor="bg-blue-600"
            buttonComponent={AddButton}
          />
          <Directory
            title="Hacker News"
            bgColor="bg-orange-500"
            buttonComponent={AddButton}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

const Card = ({ title, category }: { title: string; category: string }) => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50/70 rounded-lg border p-4 select-none">
      <div className="font-semibold">{title}</div>
      <div className="text-xs mt-2">{category}</div>
    </div>
  );
};
