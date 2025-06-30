"use client";

import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { File, List, HelpCircle, LogOut, Plus, Rocket } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const LayoutHeader = () => {
  const pathname = usePathname();
  const isMyLaunchListPage = pathname === "/my-launch-list";
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="pb-8 flex justify-between">
      <div className="flex items-center gap-2">
        <Link href="/launch" className="shrink-0 select-none">
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
          href="https://tally.so/r/nW6pYJ"
          target="_blank"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Plus />
          Submit
        </Link>
        {/*<Link*/}
        {/*  href="/pricing"*/}
        {/*  className={cn(*/}
        {/*    buttonVariants({ variant: "outline" }),*/}
        {/*    "active:scale-95 transition-all duration-100",*/}
        {/*  )}*/}
        {/*>*/}
        {/*  Get featured*/}
        {/*</Link>*/}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={isMyLaunchListPage ? "/collections" : "/my-launch-list"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "group active:scale-95 transition-all duration-100",
          )}
        >
          {isMyLaunchListPage ? <List /> : <File />}
          {isMyLaunchListPage ? "Browse collection" : "Launch List"}
        </Link>

        {status === "loading" ? (
          <Skeleton className="h-9 w-9 rounded-full" />
        ) : status === "authenticated" ? (
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
              <DropdownMenuItem asChild>
                <Link
                  href="/help"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="size-4" />
                  Get help
                </Link>
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
  );
};
