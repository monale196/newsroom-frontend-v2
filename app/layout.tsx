"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { createContext, useState, useEffect } from "react";
import { OpinionsProvider } from "../context/OpinionsContext";
import { NewsProvider } from "../context/NewsContext";

/* Fonts */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/* LANGUAGE CONTEXT */
export const LanguageContext = createContext<{
  language: "ES" | "EN";
  setLanguage: (lang: "ES" | "EN") => void;
}>({
  language: "ES",
  setLanguage: () => {},
});

/* ENTREVISTAS CONTEXT */
export interface Entrevista {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  likes: number;
  imgUrl?: string;
}

export const EntrevistasContext = createContext<{
  entrevistas: Entrevista[];
  setEntrevistas: React.Dispatch<React.SetStateAction<Entrevista[]>>;
}>({
  entrevistas: [],
  setEntrevistas: () => {},
});

/* SEARCH CONTEXT */
export const SearchContext = createContext<{
  keyword: string;
  setKeyword: (v: string) => void;
  dateFilter: string;
  setDateFilter: (v: string) => void;
}>({
  keyword: "",
  setKeyword: () => {},
  dateFilter: "",
  setDateFilter: () => {},
});

/* ROOT LAYOUT */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<"ES" | "EN">("ES");
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [keyword, setKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Cierre de menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      document.querySelectorAll(".menu-open").forEach((menu) => {
        if (!menu.contains(target)) menu.classList.remove("menu-open");
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased bg-white text-black min-h-screen`}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <EntrevistasContext.Provider value={{ entrevistas, setEntrevistas }}>
            <SearchContext.Provider value={{ keyword, setKeyword, dateFilter, setDateFilter }}>
              <NewsProvider>
                <OpinionsProvider>
                  <Header />
                  <main className="flex-1 bg-white">{children}</main>
                  <Footer />
                </OpinionsProvider>
              </NewsProvider>
            </SearchContext.Provider>
          </EntrevistasContext.Provider>
        </LanguageContext.Provider>
      </body>
    </html>
  );
}
