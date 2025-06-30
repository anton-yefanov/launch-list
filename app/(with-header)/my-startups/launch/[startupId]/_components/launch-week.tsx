"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMobile } from "@/hooks/use-mobile";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type LaunchOption = { id: string; title: string; benefits: string[] };

const LAUNCH_OPTIONS: LaunchOption[] = [
  {
    id: "free",
    title: "Free Launch",
    benefits: [
      "Your website on homepage for a week",
      "Badge for your website",
      "High authority backlink",
    ],
  },
  {
    id: "premium",
    title: "Premium Launch",
    benefits: [
      "Skip queue",
      "Your website on homepage for a week",
      "Badge for your website",
      "High authority backlink, guaranteed",
    ],
  },
];

const LaunchWeek = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMobile();

  const LaunchCard = ({
    option,
    className = "",
  }: {
    option: LaunchOption;
    className?: string;
  }) => (
    <div
      className={`flex flex-col justify-between border rounded-lg p-4 ${className}`}
    >
      <div>
        <div className="font-medium text-xl mb-2">{option.title}</div>
        <div className="text-sm mb-2">What you get:</div>
        <ul className={isMobile ? "mb-4" : ""}>
          {option.benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-center gap-1.5 text-sm justify-start mb-1"
            >
              <Check size={16} className="shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      <Button className="mt-auto w-full hover:scale-101 transition-all duration-100 active:scale-99">
        Select
      </Button>
    </div>
  );

  const LaunchOptions = () => {
    if (isMobile) {
      return (
        <div className="space-y-4">
          {LAUNCH_OPTIONS.map((option) => (
            <LaunchCard key={option.id} option={option} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {LAUNCH_OPTIONS.map((option) => (
          <LaunchCard key={option.id} option={option} className="h-80" />
        ))}
      </div>
    );
  };

  const LaunchTrigger = () => (
    <div
      className="flex justify-between p-4 border hover:border-gray-300 rounded-md select-none cursor-pointer hover:scale-101 transition-all duration-100 active:scale-99"
      onClick={() => setOpen(true)}
    >
      <div>July 30 - June 6</div>
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium text-green-400 bg-green-100 px-2 rounded">
          Free available
        </div>
        <Separator orientation="vertical" />
        <div className="text-sm font-medium text-amber-400 bg-amber-100/60 px-2 rounded">
          Premium available
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <LaunchTrigger />
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh] overflow-hidden">
            <DrawerHeader className="flex-shrink-0">
              <DrawerTitle>Choose Your Launch Option</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <LaunchOptions />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <LaunchTrigger />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Launch Option</DialogTitle>
          </DialogHeader>
          <LaunchOptions />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LaunchWeek;
