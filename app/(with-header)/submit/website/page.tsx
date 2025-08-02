"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function SubmitProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const badgeName = "launch_list_badge_featured";

  const embedCode = `<a style={{display: "block", width: "fit-content"}}
   href="${process.env.NEXT_PUBLIC_URL}"
   target="_blank">
  <img style={{height: "50px"}}
       src="${process.env.NEXT_PUBLIC_URL}/badges/svg/${badgeName}.svg"
       alt="Launch List Badge" />
</a>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast.success("Badge code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy code");
    }
  };

  useEffect(() => {
    const handleFormSubmission = async (payload: any) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        console.log("Submitting form data:", payload);
        const response = await fetch("/api/submit/website", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          console.log("Submission successful:", result);
          router.push(`${process.env.NEXT_PUBLIC_URL}`);
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
        New Website on Launch List
      </h1>
      {/* Badge Requirement Explanation */}
      <div className="mt-4 pl-1.5">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg px-6 py-4">
          <p className="text-blue-800 text-sm leading-relaxed">
            To submit your website to Launch List, embed our badge on your
            website&#39;s homepage. Copy the code below and add it to your
            website before completing the submission form.
          </p>
          {/* Badge Section */}
          <div className="flex flex-col shrink-0 items-center justify-center gap-2 mt-4 mb-2 pl-1.5">
            <Image
              src={`/badges/svg/${badgeName}.svg`}
              alt="Launch List Badge"
              width={180}
              height={85}
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              className="active:scale-95 transition-all w-full duration-100"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-background">
        {isSubmitting && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-0 select-none">
              <CardContent className="flex flex-col text-center items-center p-6">
                <Loader2 className="size-8 animate-spin text-primary" />
                <div className="space-y-1 mt-4">
                  <p className="text-sm font-medium">Submitting your website</p>
                  <p className="text-xs text-muted-foreground">
                    Please wait a moment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <iframe
          data-tally-src="https://tally.so/embed/mKKN9K?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="216"
          title="Submit Your website"
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
