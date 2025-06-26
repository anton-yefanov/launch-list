import { Button } from "@/components/ui/button";
import { Funnel, ListFilter, Save, Plus, DollarSign, Gem } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CollectionPage() {
  return (
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
            <Save />
            Save as Launch List
          </Button>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" className="size-8">
                <ListFilter />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Sort</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" className="size-8">
                <Funnel />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Filter</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Directory title="Product Hunt" bgColor="bg-orange-600" />
    </div>
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

const Directory = ({
  title,
  bgColor = "bg-primary-color",
}: {
  title: string;
  bgColor?: string;
}) => {
  return (
    <div className="flex select-none justify-between gap-1.5 bg-white border p-2 pr-4 rounded-md">
      <div className="flex gap-2">
        <div
          className={`${bgColor} shrink-0 cursor-pointer text-black font-extrabold p-2 size-12 border rounded-md grid place-items-center group`}
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
          <Tooltip>
            <TooltipTrigger className="h-fit">
              <Button variant="outline" size="sm">
                <Plus />
                Add
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Add to Launch List</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
