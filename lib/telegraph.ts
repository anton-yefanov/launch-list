import * as cheerio from "cheerio";

export interface TelegraphPost {
  title: string;
  content: string;
  url: string;
}

export async function fetchTelegraphPost(url: string): Promise<TelegraphPost> {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("telegra.ph")) {
      throw new Error("Invalid Telegraph URL");
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("h1").first().text().trim();
    if (!title) {
      throw new Error("Could not extract title from Telegraph post");
    }

    const article = $("article");
    if (article.length === 0) {
      throw new Error("Could not find article content");
    }

    article.find("h1").first().remove();
    const content = article.html() || "";

    return {
      title,
      content,
      url,
    };
  } catch (error) {
    console.error("Error fetching Telegraph post:", error);
    throw error;
  }
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}
