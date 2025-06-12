import Head from "next/head";
import { DIRECTORIES } from "@/constants/directories";

export default function SEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Best Startup Launch Directories 2025 - Where to Launch Your Startup",
    description:
      "Complete list of the best platforms and directories to launch your startup, reach early adopters, find investors, and grow your customer base.",
    url: typeof window !== "undefined" ? window.location.href : "",
    mainEntity: {
      "@type": "ItemList",
      name: "Startup Launch Directories",
      numberOfItems: DIRECTORIES?.length || 0,
      itemListElement:
        DIRECTORIES?.map((directory, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebSite",
            name: directory.name,
            description: directory.description,
            url: directory.url,
            category: directory.category,
          },
        })) || [],
    },
    author: {
      "@type": "Person",
      name: "Anton Yefanov",
      url: "https://x.com/anton_yefanov",
    },
    dateModified: new Date().toISOString(),
    inLanguage: "en-US",
  };

  return (
    <Head>
      <title>
        Best Startup Launch Directories 2025 - Where to Launch Your Startup
      </title>
      <meta
        name="description"
        content="Discover the best platforms and directories to launch your startup in 2025. Find early adopters, investors, and customers with our curated list of launch platforms including Product Hunt, Hacker News, and more."
      />
      <meta
        name="keywords"
        content="startup launch directories, where to launch startup, startup launch platforms, product hunt alternatives, startup marketing, launch checklist, startup submission sites, entrepreneur resources, startup promotion"
      />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Anton Yefanov" />
      <link
        rel="canonical"
        href={typeof window !== "undefined" ? window.location.href : ""}
      />

      {/* Open Graph tags */}
      <meta
        property="og:title"
        content="Best Startup Launch Directories 2025 - Where to Launch Your Startup"
      />
      <meta
        property="og:description"
        content="Complete curated list of the best platforms to launch your startup and reach your target audience."
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={typeof window !== "undefined" ? window.location.href : ""}
      />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Best Startup Launch Directories 2025"
      />
      <meta
        name="twitter:description"
        content="Discover the best platforms to launch your startup and reach early adopters."
      />
      <meta name="twitter:creator" content="@anton_yefanov" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
