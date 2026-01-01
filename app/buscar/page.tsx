"use client";

import { useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { SearchContext } from "../../app/layout"; // tu contexto de búsqueda
import SearchResultsPage from "../../components/SearchResultsPage";

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") || "";

  const { keyword, setKeyword } = useContext(SearchContext);

  // Sincroniza la keyword de la URL con el SearchContext
  useEffect(() => {
    if (keywordFromUrl !== keyword) {
      setKeyword(keywordFromUrl);
    }
  }, [keywordFromUrl, keyword, setKeyword]);

  return <SearchResultsPage />;
}
