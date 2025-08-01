import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Launch List — Don't forget to launch everywhere!",
  description:
    "Launch your product here and on 100+ websites to increase Domain Rating and bring traffic to your website",
  metadataBase: new URL("https://www.launch-list.org"),
  alternates: {
    canonical: "/",
  },
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
        <Script src="https://tally.so/widgets/embed.js" />
        <SessionProvider>
          {process.env.NODE_ENV === "production" && (
            <>
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
              <Script
                defer
                src="https://cloud.umami.is/script.js"
                data-website-id="a71a99b4-a72a-412c-95ee-e7ece1ed0970"
              />
            </>
          )}
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pb-8 px-4">
            <div className="max-w-2xl mx-auto">{children}</div>
          </div>
          <Analytics />
          <Toaster richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
