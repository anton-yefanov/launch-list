"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, Briefcase } from "lucide-react";
import { track } from "@vercel/analytics";

const DIRECTORY_SERVICE_PRODUCT_ID =
  process.env.NEXT_PUBLIC_DODO_DIRECTORY_SERVICE_PRODUCT_ID;

export const ServiceBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueToPayment = async () => {
    track("Continue to payment clicked");
    if (!DIRECTORY_SERVICE_PRODUCT_ID) {
      console.error("Product ID not configured");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/checkout/dodo?productId=${DIRECTORY_SERVICE_PRODUCT_ID}`,
      );
      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full rounded-xl bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200 px-4 py-3 mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="size-4 text-sky-600 shrink-0" />
          <span className="text-sm font-medium text-sky-900">
            Submission Service to 100+ directories
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsOpen(true);
            track("Learn more clicked");
          }}
          className="shrink-0 border-sky-300 text-sky-700 hover:bg-sky-50"
        >
          Learn more
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="size-5 text-sky-600" />
              Directory Submission Service
            </DialogTitle>
            <DialogDescription>
              Boost your SEO and online presence with our manual submission
              service
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              We&apos;ll manually submit your startup to 100+ high-quality
              directories to maximize your visibility and search engine
              rankings.
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">
                  100+ high-quality directory submissions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">
                  Improved SEO with quality backlinks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">
                  Detailed report of all submissions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Done within 7 days</span>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-sky-50 rounded-lg border border-sky-100">
              <div className="text-center">
                <span className="text-2xl font-bold text-sky-700">$49</span>
                <span className="text-sm text-muted-foreground ml-1">
                  one-time
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full"
              onClick={handleContinueToPayment}
              disabled={isLoading}
            >
              {isLoading ? "Redirecting..." : "Continue to payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
