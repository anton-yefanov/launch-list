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
      <div className="select-none rounded-2xl shadow-none text-center py-10 px-10 bg-gradient-to-b from-[#00449D] to-[#2FB2FF] relative overflow-hidden">
        <div
          className="absolute z-1 inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="z-2">
          <h1 className="text-3xl text-white font-bold mt-2 mb-1 pl-1.5">
            New Launch on Launch List
          </h1>
          {/*<h2 className="text-white relative font-md">*/}
          {/*  Top 3 products receive winner badges and a dofollow backlink*/}
          {/*  <Tooltip>*/}
          {/*    <TooltipTrigger asChild>*/}
          {/*      <HelpCircle className="size-3 ml-1 inline" />*/}
          {/*    </TooltipTrigger>*/}
          {/*    <TooltipContent side="bottom">*/}
          {/*      <p>Remove from Launch List</p>*/}
          {/*    </TooltipContent>*/}
          {/*  </Tooltip>*/}
          {/*</h2>*/}
        </div>
      </div>
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
