"use client";

import { useState, useEffect } from "react";

export interface TopStory {
  title: string;
  intro: string;
  imgUrl: string;
  articleUrl: string;
  section: string;
  date: string;
}

export const useTopStories = (language: "ES" | "EN") => {
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingTop(true);
      try {
        const res = await fetch(`/api/topstories?language=${language}`);
        const data = await res.json();
        setTopStories(data.topStories || []);
      } catch (e) {
        console.error("Error loading top stories:", e);
        setTopStories([]);
      } finally {
        setLoadingTop(false);
      }
    };

    load();
  }, [language]);

  return { topStories, loadingTop };
};
