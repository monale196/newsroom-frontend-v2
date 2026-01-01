"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "../../context/SearchContext";
import SearchResultsPage from "../../components/SearchResultsPage";

// 🔴 ESTO ES CLAVE: evita prerender
export const dynamic = "force-dynamic";

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") || "";

  const { keyword, setKeyword } = useSearch();

  useEffect(() => {
    if (keywordFromUrl !== keyword) {
      setKeyword(keywordFromUrl);
    }
  }, [keywordFromUrl, keyword, setKeyword]);

  return <SearchResultsPage />;
}
