"use client";

import { ReactNode, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
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
import { LoginForm } from "@/components/login-form";

interface LoginDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
}

export function LoginDialog({ open, onOpenChange, title }: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useMobile();

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only">Sign in to continue</DrawerTitle>
            <DrawerDescription className="sr-only">
              Please sign in to upvote products and access all features.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <LoginForm title={title} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Sign in to continue</DialogTitle>
          <DialogDescription className="sr-only">
            Please sign in to upvote products and access all features.
          </DialogDescription>
        </DialogHeader>
        <LoginForm title={title} />
      </DialogContent>
    </Dialog>
  );
}
