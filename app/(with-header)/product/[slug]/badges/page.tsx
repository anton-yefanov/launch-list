"use client";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, use, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BadgesPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BadgesPage({ params }: BadgesPageProps) {
  const { slug } = use(params);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Explore badges</h1>
      <h2 className="mb-4">
        Add a badge to your website to build trust with your visitors <br /> and
        highlight your Launch List presence
      </h2>
      <div className="grid grid-cols-1 gap-2">
        <>
          <BadgeCard
            title="Launching soon"
            description="For those that launch soon"
            slug={slug}
            badgeName="launch_list_badge_launching_soon"
          />
          <BadgeCard
            title="Live now"
            description="For those that are currently live"
            slug={slug}
            badgeName="launch_list_badge_live"
          />
          <BadgeCard
            title="Featured"
            description="For those that launched in the past"
            slug={slug}
            badgeName="launch_list_badge_featured"
          />
          <BadgeCard
            title="№1 Product of the Week"
            description="For those that ranked 1st"
            slug={slug}
            badgeName="launch_list_badge_1_product_of_the_week"
          />
          <BadgeCard
            title="№2 Product of the Week"
            description="For those that ranked 2nd"
            slug={slug}
            badgeName="launch_list_badge_2_product_of_the_week"
          />
          <BadgeCard
            title="№3 Product of the Week"
            description="For those that ranked 3rd"
            slug={slug}
            badgeName="launch_list_badge_3_product_of_the_week"
          />
        </>
      </div>
    </div>
  );
}

const BadgeCard = ({
  title,
  description,
  slug,
  badgeName,
}: {
  title: string;
  description: ReactNode;
  slug: string;
  badgeName: string;
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedCode = `<a style={{display: "block", width: "fit-content"}}
   href="${process.env.NEXT_PUBLIC_URL}/product/${slug}"
   target="_blank">
  <img style={{height: "50px"}}
       src="${process.env.NEXT_PUBLIC_URL}/badges/svg/${badgeName}.svg"
       alt="Launch List Badge" />
</a>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const renderHighlightedCode = () => {
    return (
      <ScrollArea>
        <code className="block" style={{ maxWidth: 200 }}>
          <span className="text-red-400">{"<a"}</span>
          <br />
          <span className="text-blue-300">{"  style={{ "}</span>
          <span className="text-green-300">
            {'display: "block", width: "fit-content"'}
          </span>
          <span className="text-blue-300">{` }}`}</span>
          <br />
          <span className="text-blue-300">{"  href="}</span>
          <span className="text-green-300">{`"${process.env.NEXT_PUBLIC_URL}/product/${slug}"`}</span>
          <br />
          <span className="text-blue-300">{"  target="}</span>
          <span className="text-green-300">{'"_blank"'}</span>
          <br />
          <span className="text-red-400">{">"}</span>
          <br />
          <span className="text-slate-500">{"  "}</span>
          <span className="text-red-400">{"<img"}</span>
          <br />
          <span className="text-blue-300">{"    style={{ "}</span>
          <span className="text-green-300">{'height: "50px"'}</span>
          <span className="text-blue-300">{` }}`}</span>

          <br />
          <span className="text-blue-300">{"    src="}</span>
          <span className="text-green-300">{`"${process.env.NEXT_PUBLIC_URL}/badges/svg/${badgeName}.svg"`}</span>
          <br />
          <span className="text-blue-300">{"    alt="}</span>
          <span className="text-green-300">{'"Launch List Badge"'}</span>
          <span className="text-red-400">{" />"}</span>
          <br />
          <span className="text-red-400">{"</a>"}</span>
        </code>
      </ScrollArea>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center select-none border rounded-md gap-6 p-10 sm:p-2 sm:pl-4">
      <div className="flex flex-col gap-1 justify-center flex-1 sm:my-auto">
        <div className="text-2xl font-bold">{title}</div>
        <div className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Image
          src={`/badges/svg/${badgeName}.svg`}
          alt={badgeName}
          width={180}
          height={85}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bottom-2 active:scale-95 transition-all duration-100"
            >
              <Code size={16} />
              Get code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Code size={20} />
                How to add Badge to your website
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Copy HTML code below</li>
                  <li>Paste it into your website&#39;s HTML</li>
                  <li>The badge will link back to your product page</li>
                </ol>
              </div>
              {/* Code Block */}
              <div className="relative">
                <div className="bg-slate-950 rounded-lg border overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <Button
                      onClick={handleCopy}
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  {/* Code Content */}
                  <div className="p-4 max-w-full">
                    <pre className="text-sm font-mono leading-relaxed overflow-hidden">
                      {renderHighlightedCode()}
                    </pre>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  className="flex-1 bg-primary-color hover:bg-primary-color/90"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Code
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
