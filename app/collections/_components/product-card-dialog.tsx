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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Gem,
  ExternalLink,
  Plus,
  Star,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react";

interface DirectoryData {
  title: string;
  bgColor: string;
  description: string;
  views: string;
  domainRating: string;
  isFree: boolean;
  hasPaidFeatures: boolean;
  ranking: number;
}

interface ProductCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  directory: DirectoryData;
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
          className={`${directory.bgColor} shrink-0 text-black font-extrabold p-3 size-16 border rounded-lg grid place-items-center`}
        >
          <div className="relative">
            <div className="bg-white relative rounded-xs text-lg px-2 py-1 border border-black -rotate-6 z-10">
              {directory.title[0]}
            </div>
            <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{directory.title}</h2>
          <p className="text-base mt-1 text-muted-foreground">
            {directory.description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Users className="size-5 text-blue-600" />
          </div>
          <div className="font-bold text-lg">{directory.views}</div>
          <div className="text-xs text-gray-600">Monthly Views</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="size-5 text-green-600" />
          </div>
          <div className="font-bold text-lg">{directory.domainRating}</div>
          <div className="text-xs text-gray-600">Domain Rating</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Star className="size-5 text-yellow-600" />
          </div>
          <div className="font-bold text-lg">#{directory.ranking}</div>
          <div className="text-xs text-gray-600">Ranking</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Globe className="size-5 text-purple-600" />
          </div>
          <div className="font-bold text-lg">High</div>
          <div className="text-xs text-gray-600">Authority</div>
        </div>
      </div>

      <Separator />

      {/* Features Section */}
      <div>
        <h3 className="font-semibold mb-3">Features & Pricing</h3>
        <div className="flex flex-wrap gap-2">
          {directory.isFree && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <DollarSign className="size-3 mr-1" />
              Free Submission
            </Badge>
          )}
          {directory.hasPaidFeatures && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              <Gem className="size-3 mr-1" />
              Premium Features
            </Badge>
          )}
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            High Traffic
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Tech Audience
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-3">About</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {directory.title} is one of the most popular platforms for launching
          and discovering new products. With over {directory.views} monthly
          views and a strong community of makers and early adopters, it's an
          excellent place to get your product in front of the right audience.
          The platform offers both free and premium submission options to
          maximize your product's visibility.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button className="bg-primary-color hover:bg-primary-color/90 flex-1">
          <Plus className="size-4 mr-2" />
          Add to Launch List
        </Button>
        <Button variant="outline" className="flex-1">
          <ExternalLink className="size-4 mr-2" />
          Visit Website
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left p-1">
            <DrawerTitle className="sr-only">{directory.title}</DrawerTitle>
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
          <DialogTitle className="sr-only">{directory.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {directory.description}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
