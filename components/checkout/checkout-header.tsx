"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CheckoutHeader() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/launch"
        className={cn(buttonVariants({ variant: "outline" }), "size-[32px]")}
      >
        <ChevronLeft />
      </Link>
      <span className="font-semibold">Launch List</span>
    </div>
  );
}
