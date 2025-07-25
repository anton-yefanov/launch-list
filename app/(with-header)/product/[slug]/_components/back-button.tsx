"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" onClick={() => router.back()}>
      <ArrowLeft className="size-4" />
      Back
    </Button>
  );
}
