"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="ghost" className="mb-4">
      <ArrowLeft className="size-4 mr-2" />
      Back
    </Button>
  );
}
