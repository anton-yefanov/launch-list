"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Rocket, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmitProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFormSubmission = async (payload: any) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setError(null);

      try {
        console.log("Submitting form data:", payload);
        const response = await fetch("/api/submit/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          console.log("Submission successful:", result);
          // Redirect to select launch week
          const redirectUrl = result.aiReview.approved
            ? `${process.env.NEXT_PUBLIC_URL}/my-products/launch/${result.slug}`
            : `${process.env.NEXT_PUBLIC_URL}/my-products`;
          router.push(redirectUrl);
        } else {
          console.error("Submission failed:", result);
          setError(result.error || result.details || "Unknown error");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setError(
          "An error occurred while submitting the form. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.includes?.("Tally.FormSubmitted")) {
        try {
          const payload = JSON.parse(event.data).payload;
          console.log("Received Tally submission:", payload);
          handleFormSubmission(payload);
        } catch (error) {
          console.error("Error parsing Tally message:", error);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isSubmitting, router]);

  return (
    <div>
      {!error && (
        <div className="select-none rounded-2xl shadow-none text-center py-10 px-10 relative overflow-hidden">
          <div className="z-2">
            <h1 className="flex text-3xl justify-center items-center gap-2 font-bold mt-2 mb-1 pl-1.5">
              New Launch on Launch List <Rocket />
            </h1>
            <h2 className="relative font-md">
              <b>
                Top 3 products receive Winner Badges and high-authority Backlink
              </b>
            </h2>
          </div>
        </div>
      )}
      <div className="bg-background">
        {isSubmitting && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-0 select-none">
              <CardContent className="flex flex-col text-center items-center p-6">
                <Loader2 className="size-8 animate-spin text-primary" />
                <div className="space-y-1 mt-4">
                  <p className="text-sm font-medium">Submitting your product</p>
                  <p className="text-xs text-muted-foreground">
                    Please wait a moment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex flex-col items-center gap-4 max-w-md text-center">
              <AlertCircle className="size-12 text-destructive" />
              <p className="text-lg font-medium text-destructive">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                <RefreshCw className="size-4 mr-1" />
                Refresh Page
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            data-tally-src="https://tally.so/embed/nW6pYJ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="216"
            title="Submit Your product"
            className="rounded-lg"
          />
        )}
      </div>
      <Script
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          if (typeof window !== "undefined" && window.Tally) {
            window.Tally.loadEmbeds();
          }
        }}
      />
    </div>
  );
}
