"use client";

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { File, List } from "lucide-react";

export const LayoutHeader = () => {
  const pathname = usePathname();
  const isMyLaunchListPage = pathname === "/my-launch-list";

  return (
    <div className="pb-8 flex justify-between">
      <div className="flex items-center gap-2">
        <Link href="/public" className="shrink-0 select-none">
          <Image
            src="/logo.png"
            alt="logo"
            width={36}
            height={36}
            draggable={false}
            className="rounded"
          />
        </Link>
        <Button
          variant="outline"
          className="active:scale-95 transition-all duration-100"
        >
          Launch here!
        </Button>
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
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "default" }),
            "active:scale-95 transition-all duration-100 bg-primary-color hover:bg-primary-color/90",
          )}
        >
          Login
        </Link>
      </div>
    </div>
  );
};
