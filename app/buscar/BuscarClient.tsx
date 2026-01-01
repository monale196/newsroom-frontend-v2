"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "../../context/SearchContext";
import SearchResultsPage from "../../components/SearchResultsPage";

// 🔴 Evita que Next intente prerenderizar
export const dynamic = "force-dynamic";

export default function BuscarClient() {
  const searchParams = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") || "";

  const { keyword, setKeyword } = useSearch();

  // Sincroniza la keyword de la URL con el contexto
  useEffect(() => {
    if (keywordFromUrl !== keyword) {
      setKeyword(keywordFromUrl);
    }
  }, [keywordFromUrl, keyword, setKeyword]);

  return <SearchResultsPage />;
}
