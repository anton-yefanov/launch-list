"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMobile } from "@/hooks/use-mobile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Gem,
  ExternalLink,
  Plus,
  Users,
  Globe,
  Hexagon,
  Frown,
  Meh,
  Smile,
  Check,
  TrendingUp,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DirectoryTag } from "@/types/DirectoryTag";
import { DirectoryType } from "@/types/DirectoryType";
import { formatNumber } from "@/lib/formatNumber";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";

interface ProductCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  directory: DirectoryType;
}

export function ProductCardDialog({
  isOpen,
  onClose,
  directory,
}: ProductCardDialogProps) {
  const isMobile = useMobile();

  const content = (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          style={{ backgroundColor: directory.bgColor }}
          className="shrink-0 text-black font-extrabold p-3 size-16 border rounded-lg grid place-items-center select-none"
        >
          <div className="relative">
            <div className="bg-white relative rounded-xs text-lg h-8 w-7.5 p-0 grid place-items-center border border-black -rotate-6 z-10">
              {directory.name[0]}
            </div>
            <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{directory.name}</h2>
          <p className="text-base text-muted-foreground">
            {directory.description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Users className="size-5 text-blue-600" />
          </div>
          <div className="font-bold text-lg">
            {formatNumber(directory.viewsPerMonth)}
          </div>
          <div className="text-xs text-gray-600">Monthly Views</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Hexagon className="size-5 text-green-600" />
          </div>
          <div className="font-bold text-lg">{directory.domainRating}</div>
          <div className="text-xs text-gray-600">Domain Rating</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Globe className="size-5 text-purple-600" />
          </div>
          <div className="font-bold text-lg">High</div>
          <div className="text-xs text-gray-600">Authority</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            {getSubmitDifficultyIcon(directory.submitDifficulty)}
          </div>
          <div className="font-bold text-lg">{directory.submitDifficulty}</div>
          <div className="text-xs text-gray-600">Submit Difficulty</div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3">Features & Pricing</h3>
        <div className="flex flex-wrap gap-2">
          {directory.tags.find((tag) => tag === DirectoryTag.FreeLaunch) && (
            <Badge
              variant="secondary"
              className="text-green-500 bg-green-100/70"
            >
              <Check className="size-3 mr-1" />
              Launch for Free
            </Badge>
          )}
          {directory.tags.find((tag) => tag === DirectoryTag.PaidFeatures) && (
            <Badge
              variant="secondary"
              className="text-yellow-500 bg-yellow-100/70"
            >
              <DollarSign className="size-3 mr-1" />
              Website offers Paid features
            </Badge>
          )}
          {directory.tags.find((tag) => tag === DirectoryTag.HighTraffic) && (
            <Badge variant="secondary" className="text-rose-400 bg-rose-100">
              <TrendingUp className="size-3 mr-1" />
              High Traffic
            </Badge>
          )}
          {directory.tags.find((tag) => tag === DirectoryTag.SmallStartups) && (
            <Badge variant="secondary" className="text-sky-400 bg-sky-100">
              <PawPrint className="size-3 mr-1" />
              Perfect for small startups
            </Badge>
          )}
          {directory.tags.find((tag) => tag === DirectoryTag.AI) && (
            <Badge
              variant="secondary"
              className="text-purple-400 bg-purple-100"
            >
              <div className="text-xs font-semibold p-0">AI</div>
              Focus on AI
            </Badge>
          )}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3">About</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {directory.description}
        </p>
      </div>
      <div className="flex gap-3 pt-4">
        <Button className="bg-primary-color hover:bg-primary-color/90 flex-1">
          <Plus className="size-4" />
          Add to Launch List
        </Button>
        <Link
          href={directory.url}
          className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          target="_blank"
        >
          <ExternalLink className="size-4" />
          Visit Website
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left p-1">
            <DrawerTitle className="sr-only">{directory.name}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {directory.description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{directory.name}</DialogTitle>
          <DialogDescription className="sr-only">
            {directory.description}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

const getSubmitDifficultyIcon = (it: SubmitDifficulty) => {
  switch (it) {
    case SubmitDifficulty.High:
      return <Frown className="size-5 text-red-400" />;
    case SubmitDifficulty.Ok:
      return <Meh className="size-5 text-yellow-500" />;
    case SubmitDifficulty.Low:
      return <Smile className="size-5 text-green-600" />;
  }
};
