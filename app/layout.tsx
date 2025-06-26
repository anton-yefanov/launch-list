import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Launch list",
  description:
    "Discover the best platforms to launch your startup and reach early adopters, investors, and potential customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NODE_ENV === "production" && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "rxc19ieo33");`,
            }}
          />
        )}
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="pb-8 flex justify-between">
              <div className="shrink-0 select-none">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={36}
                  height={36}
                  draggable={false}
                  className="rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button className="bg-primary-color hover:bg-primary-color/90 active:scale-90 transition-all duration-120">
                  <Plus />
                  Submit
                </Button>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Login
                </Link>
              </div>
            </div>
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
