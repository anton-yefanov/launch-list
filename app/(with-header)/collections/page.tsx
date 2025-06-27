"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilterIcon as Funnel,
  ListFilter,
  FileInput,
  FilePlus,
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DIRECTORIES_V2 } from "@/constants/directories_v2";

export default function CollectionPage() {
  const router = useRouter();

  const AddButton = useMemo(() => {
    return (
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            toast("Directory Added to Launch List", {
              description: "View now or later",
              action: {
                label: "View",
                onClick: () => router.push("/my-launch-list"),
              },
            });
          }}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <FilePlus />
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
              Add all to Launch List
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
          {DIRECTORIES_V2.map((directory) => (
            <Directory
              key={directory.name}
              directory={directory}
              buttonComponent={AddButton}
            />
          ))}
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
