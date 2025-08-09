import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Not Found ‒ Launch List",
  description:
    "The startup you are looking for could not be found. Browse other startups on Launch List.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Startup not found
      </h1>
      <p className="text-gray-600 mb-6">
        The startup you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link href="/">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Launch Page
        </Button>
      </Link>
    </div>
  );
}
