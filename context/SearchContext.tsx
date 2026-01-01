"use client";

import { createContext, useContext, useState } from "react";

interface SearchContextType {
  keyword: string;
  dateFilter: string | null;
  setKeyword: (v: string) => void;
  setDateFilter: (v: string | null) => void;
  clearSearch: () => void;
}

export const SearchContext = createContext<SearchContextType>({
  keyword: "",
  dateFilter: null,
  setKeyword: () => {},
  setDateFilter: () => {},
  clearSearch: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [keyword, setKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const clearSearch = () => {
    setKeyword("");
    setDateFilter(null);
  };

  return (
    <SearchContext.Provider value={{ keyword, dateFilter, setKeyword, setDateFilter, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
