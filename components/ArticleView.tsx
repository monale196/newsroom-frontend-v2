"use client";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Contenido, NewsContext } from "../context/NewsContext";
import { LanguageContext } from "../app/layout";
import RecommendationsGrid from "./RecommendationsGrid";

interface ArticleViewProps {
  article: Contenido;
  recomendaciones?: Contenido[];
}

export default function ArticleView({ article, recomendaciones = [] }: ArticleViewProps) {
  const { language } = useContext(LanguageContext);
  const { articles } = useContext(NewsContext);

  const [expanded, setExpanded] = useState(false);
  const [body, setBody] = useState(article.body || "");
  const [confidencialLine, setConfidencialLine] = useState("");
  const [cleanTitle, setCleanTitle] = useState(article.title || "");
  const [cleanSubtitle, setCleanSubtitle] = useState(article.subtitle || "");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    async function fetchBody() {
      if (!article.txtUrl) return;

      try {
        const res = await fetch(article.txtUrl);
        const text = await res.text();
        const lines = text
          .split("\n")
          .map(l => l.trim())
          .filter(l => l !== "");

        const titleRegex = /^\**\s*(Título|Title):\**\s*/i;
        const subtitleRegex = /^\**\s*(Subtítulo|Subtitle):\**\s*/i;
        const dateRegex = /^\**\s*(Fecha|Date):\**\s*/i;

        const tLine = lines.find(l => titleRegex.test(l)) || "";
        const stLine = lines.find(l => subtitleRegex.test(l)) || "";
        const dLine = lines.find(l => dateRegex.test(l)) || article.date || "";

        const t = tLine.replace(titleRegex, "").replace(/\*/g, "").trim() || "Sin título";
        const st = stLine.replace(subtitleRegex, "").replace(/\*/g, "").trim() || "";
        const rawDate = dLine.replace(dateRegex, "").replace(/\*/g, "").trim();

        let parsedDate = new Date(rawDate);
        if (isNaN(parsedDate.getTime())) parsedDate = new Date(article.date || Date.now());
        const formatted = !isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString(language === "ES" ? "es-ES" : "en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })
          : "";

        const bodyStartIndex = Math.max(
          tLine ? lines.indexOf(tLine) + 1 : 0,
          stLine ? lines.indexOf(stLine) + 1 : 0,
          dLine ? lines.indexOf(dLine) + 1 : 0
        );

        const bodyLines = lines.slice(bodyStartIndex);
        let detectedConfidencial = "";
        const filteredBody = bodyLines.filter(line => {
          const esLine = line.includes("Artículo basado en información de El Confidencial");
          const enLine = line.includes("Article based on information from El Confidencial");
          if (esLine || enLine) {
            detectedConfidencial = line.replace(/\*/g, "");
            return false;
          }
          return true;
        }).join("\n");

        setCleanTitle(t);
        setCleanSubtitle(st);
        setFormattedDate(formatted);
        setBody(filteredBody);
        setConfidencialLine(detectedConfidencial);

      } catch {
        setCleanTitle(article.title || "");
        setCleanSubtitle(article.subtitle || "");
        setBody(article.body || "");
        const fallbackDate = new Date(article.date || Date.now());
        setFormattedDate(fallbackDate.toLocaleDateString(language === "ES" ? "es-ES" : "en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit"
        }));
      }
    }

    fetchBody();
  }, [article, language]);

  if (!article) return null;

  const previewLines = body
    .split("\n")
    .filter(line => line.trim() !== "")
    .slice(0, 3)
    .join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="rounded-3xl shadow-lg p-8 mx-auto max-w-6xl space-y-8"
      style={{ color: "#0a1b2e" }}
    >
      {/* TÍTULO */}
      <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-snug text-center">{cleanTitle}</h1>

      {/* SUBTÍTULO */}
      {cleanSubtitle && (
        <h3 className="text-xl md:text-2xl font-medium mb-2 text-gray-700 text-center">{cleanSubtitle}</h3>
      )}

      {/* FECHA */}
      {formattedDate && (
        <p className="text-sm md:text-base mb-4 text-gray-500 text-center">{formattedDate}</p>
      )}

      {/* IMAGEN */}
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={cleanTitle}
          className="w-full max-h-[600px] object-cover rounded-xl mb-6"
        />
      )}

      {/* CUERPO */}
      <p className="whitespace-pre-wrap text-lg md:text-xl leading-relaxed">
        {expanded ? body : previewLines}
      </p>

      {/* LEER MÁS / MENOS */}
      {body && body.length > previewLines.length && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 px-6 py-3 bg-[#0a1b2e] text-white rounded-md hover:opacity-80 transition"
        >
          {expanded
            ? (language === "ES" ? "Leer menos" : "Read less")
            : (language === "ES" ? "Leer más" : "Read more")}
        </button>
      )}

      {/* CONFIDENCIAL */}
      {confidencialLine && (
        <p className="mt-6 text-sm italic text-gray-600 text-center">{confidencialLine}</p>
      )}

      {/* RECOMMENDATIONS */}
      {recomendaciones.length > 0 && (
        <RecommendationsGrid articles={recomendaciones} />
      )}
    </motion.div>
  );
}
