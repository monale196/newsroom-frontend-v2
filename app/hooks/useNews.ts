"use client";

import { useState, useEffect } from "react";

export interface Article {
  id: number;
  tipo: "noticia" | "entrevista";
  title: string;
  intro: string;
  body?: string;
  date: string;
  section: string;
  imgUrl?: string;
  txtUrl?: string;
}

const S3_BASE = "https://newsroom-prod-content.s3.eu-north-1.amazonaws.com/articles/";

interface UseNewsProps {
  language: string; // "ES" | "EN"
  section?: string;
  keyword?: string;
  dateFilter?: string; // "YYYY-MM-DD"
}

export function useNews({ language, section = "", keyword, dateFilter }: UseNewsProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const date = dateFilter || new Date().toISOString().slice(0, 10);
        const [yearMonth, day] = [date.slice(0, 7), date.slice(8, 10)];
        const lang = language.toLowerCase();

        // JSON público del S3
        const jsonUrl = `${S3_BASE}${yearMonth}/${day}/${lang}/${section}articles.${lang}.json`;
        const res = await fetch(jsonUrl);
        if (!res.ok) {
          setArticles([]);
          setLoading(false);
          return;
        }

        const data = await res.json();

        const mapped: Article[] = data.map((item: any, idx: number) => ({
          id: 1000 + idx,
          tipo: "noticia",
          title: item.title || item.url.split("/").pop() || "Sin título",
          intro: item.intro || item.descripcion || "",
          body: "", // opcional: se puede cargar desde index.txt
          date: item.date || date,
          section,
          txtUrl: `${S3_BASE}${yearMonth}/${day}/${lang}/${section}index.txt`,
          imgUrl: item.images?.[0] ? `${S3_BASE}${yearMonth}/${day}/${lang}/${section}${item.images[0]}` : "",
        }));

        const filtered = keyword
          ? mapped.filter(
              (a) =>
                a.title.toLowerCase().includes(keyword.toLowerCase()) ||
                a.intro.toLowerCase().includes(keyword.toLowerCase())
            )
          : mapped;

        setArticles(filtered);
      } catch (error) {
        console.error("Error fetch news:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [language, section, keyword, dateFilter]);

  return { articles, loading };
}
