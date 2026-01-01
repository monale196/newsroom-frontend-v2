"use client";

export interface NewsItem {
  txtUrl?: string;
  imageUrl?: string;
}

const BUCKET = "newsroomcache";
const S3_BASE = `https://${BUCKET}.s3.eu-north-1.amazonaws.com/`;

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("S3 utils must run in the browser");
  }
}

/**
 * Lista los días disponibles de un mes
 */
export async function listAvailableDays(year: string, month: string): Promise<string[]> {
  ensureBrowser();

  const prefix = `data/news/${year}/${month}/`;
  const res = await fetch(`${S3_BASE}?list-type=2&prefix=${prefix}`);
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");

  const keys = Array.from(xml.querySelectorAll("Contents > Key")).map((k) => k.textContent || "");

  const days = new Set<string>();
  for (const key of keys) {
    const day = key.replace(prefix, "").split("/")[0];
    if (day) days.add(day);
  }

  return Array.from(days).sort((a, b) => Number(a) - Number(b));
}

/**
 * Lista noticias de un día
 */
export async function listNews(
  year: string,
  month: string,
  day: string,
  lang: string,
  section: string
): Promise<NewsItem[]> {
  ensureBrowser();

  const prefix = `data/news/${year}/${month}/${day}/${lang}/${section}/`;
  const res = await fetch(`${S3_BASE}?list-type=2&prefix=${prefix}`);
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");

  const keys = Array.from(xml.querySelectorAll("Contents > Key")).map((k) => k.textContent || "");

  const newsMap: Record<string, NewsItem> = {};

  // Filtramos solo txt
  const txtFiles = keys.filter(k => k.endsWith(".txt"));

  for (const txtKey of txtFiles) {
    newsMap[txtKey] = {
      txtUrl: `${S3_BASE}${txtKey}`,
    };

    // Buscamos la primera imagen en la misma carpeta que el txt
    const folderPrefix = txtKey.substring(0, txtKey.lastIndexOf("/") + 1);
    const imagesInFolder = keys.filter(k => /\.(jpg|jpeg)$/i.test(k) && k.startsWith(folderPrefix));
    if (imagesInFolder.length > 0) {
      newsMap[txtKey].imageUrl = `${S3_BASE}${imagesInFolder[0]}`; // primera imagen
    }
  }

  return Object.values(newsMap);
}
