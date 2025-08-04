"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SubmitProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleFormSubmission = async (payload: any) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

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
          alert(
            `Submission failed: ${result.error || result.details || "Unknown error"}`,
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the form. Please try again.");
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
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mt-2 pl-1.5">
        New Launch on Launch List
      </h1>
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
        <iframe
          data-tally-src="https://tally.so/embed/nW6pYJ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="216"
          title="Submit Your product"
          className="rounded-lg"
        />
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
