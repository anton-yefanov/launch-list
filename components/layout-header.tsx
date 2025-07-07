"use client";

import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  File,
  List,
  HelpCircle,
  LogOut,
  Plus,
  Rocket,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/use-mobile";

export const LayoutHeader = () => {
  const pathname = usePathname();
  const isMyLaunchListPage = pathname === "/my-launch-list";
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuth = status === "authenticated";
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const isMobile = useMobile();

  const handleSignOut = () => {
    signOut({
      redirectTo: "/",
    });
  };

  const handleEmailContact = () => {
    window.open("mailto:antonyefanov@gmail.com", "_blank");
  };

  const getButtonContent = useCallback(() => {
    if (!isAuth) {
      return {
        href: "/collections",
        icon: <List />,
        text: isMobile ? "Browse" : "Browse collection",
      };
    } else {
      return {
        href: isMyLaunchListPage ? "/collections" : "/my-launch-list",
        icon: isMyLaunchListPage ? <List /> : <File />,
        text: isMyLaunchListPage ? "Browse collection" : "Launch List",
      };
    }
  }, [isAuth, isMobile, isMyLaunchListPage]);

  const buttonContent = getButtonContent();

  return (
    <>
      <div className="pt-8 pb-4 flex justify-between sticky top-0 z-30 bg-background">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="shrink-0 select-none active:scale-95 transition-all duration-100"
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={36}
              height={36}
              draggable={false}
              className="rounded"
            />
          </Link>
          <Link
            href={
              isAuth
                ? `https://tally.so/r/nW6pYJ?email=${user?.email}&redirect=${process.env.NEXT_PUBLIC_URL}/my-startups`
                : "/login"
            }
            target={isAuth ? "_blank" : "_self"}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "active:scale-95 transition-all duration-100",
            )}
          >
            <Plus />
            Launch here
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={buttonContent.href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "group active:scale-95 transition-all duration-100",
            )}
          >
            {buttonContent.icon}
            {buttonContent.text}
          </Link>

          {status === "loading" ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session?.user?.image || undefined}
                      alt={session?.user?.name || "User avatar"}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href="/my-startups"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Rocket className="size-4" />
                    My startups
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsHelpDialogOpen(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="size-4" />
                  Get help
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default" }),
                "active:scale-95 transition-all duration-100 bg-primary-color hover:bg-primary-color/90",
              )}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="sm:max-w-md select-none">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Need Help?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Image
                src="/anton_avatar.jpg"
                alt="Profile photo"
                width={120}
                height={120}
                draggable={false}
                className="rounded-full object-cover"
              />
            </div>
            <div className="text-center space-y-2">
              <div className="font-medium">
                👋 I&#39;m Anton, creator of Launch List
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Feel free to reach out to me with any question directly through
                email or send me a message on 𝕏
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <Button
                onClick={handleEmailContact}
                className="flex-1 flex items-center gap-2"
                variant="outline"
              >
                <Mail className="size-4" />
                Email
              </Button>
              <Link
                href="https://x.com/anton_yefanov"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "flex-1 flex items-center gap-2",
                )}
              >
                <MessageCircle className="size-4" />
                Message on 𝕏
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
