"use client";

import { useContext, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CookieBanner from "../components/CookieBanner";
import { LanguageContext } from "./layout";
import { NewsContext, Contenido } from "../context/NewsContext";
import { useOpinions } from "../context/OpinionsContext";
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-merriweather",
});

export default function Home() {
  const { language } = useContext(LanguageContext);
  const { articles, loading } = useContext(NewsContext);
  const { opinions } = useOpinions();

  const [expanded, setExpanded] = useState(false);
  const [opinionIndex, setOpinionIndex] = useState(0);

  const ultimaHora: Contenido | undefined = useMemo(() => {
    return articles
      .filter(a => a.section === "ultima-hora")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [articles]);

  useEffect(() => {
    if (!opinions || opinions.length === 0) return;
    const interval = setInterval(() => {
      setOpinionIndex(prev => (prev + 1) % opinions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [opinions]);

  return (
    <div className={`${merriweather.variable} flex flex-col min-h-screen bg-white text-[#0a1b2e]`}>
      <main className="flex-1 px-4 md:px-16 py-10 space-y-28">

        {/* ===============================
            ÚLTIMA HORA
           =============================== */}
        {!loading && ultimaHora && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <article className="bg-gray-50 rounded-3xl p-6 md:p-10 shadow-xl">

              <span className="block text-xs uppercase tracking-wide text-red-600 font-semibold text-center">
                {language === "ES" ? "Última hora" : "Breaking news"}
              </span>

              {/* TÍTULO LIMPIO */}
              <h2 className="text-4xl md:text-5xl mt-4 mb-6 font-bold leading-tight text-center">
                {ultimaHora.title.replace(/\*\*Título:\*\*/gi, "").trim()}
              </h2>

              {/* IMAGEN */}
              {ultimaHora.imageUrl && (
                <img
                  src={ultimaHora.imageUrl}
                  alt={ultimaHora.title.replace(/\*\*Título:\*\*/gi, "").trim()}
                  className="w-full h-72 md:h-96 object-cover rounded-2xl mb-6"
                />
              )}

              {/* SUBTÍTULO LIMPIO */}
              {ultimaHora.subtitle && (
                <p className="text-lg text-gray-600 mb-4 text-center max-w-3xl mx-auto">
                  {ultimaHora.subtitle.replace(/\*\*Subtítulo:\*\*/gi, "").trim()}
                </p>
              )}

              {/* FECHA */}
              <p className="text-xs text-gray-400 mb-6 text-center">
                {new Date(ultimaHora.date).toLocaleDateString(
                  language === "ES" ? "es-ES" : "en-US",
                  { day: "2-digit", month: "long", year: "numeric" }
                )}
              </p>

              {/* TEXTO DEL BODY */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={expanded ? "open" : "closed"}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="whitespace-pre-line overflow-hidden leading-relaxed text-base"
                >
                  {(() => {
                    const cleanBody = ultimaHora.body.trim();

                    return expanded
                      ? cleanBody
                      : cleanBody.split("\n").slice(0, 3).join("\n");
                  })()}
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-6 block mx-auto text-blue-900 font-semibold hover:underline"
              >
                {expanded
                  ? language === "ES" ? "Leer menos" : "Read less"
                  : language === "ES" ? "Leer más" : "Read more"}
              </button>
            </article>
          </motion.section>
        )}

        {/* ===============================
            OPINIONES
           =============================== */}
        {opinions && opinions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl mb-8 font-semibold">
              {language === "ES" ? "Opiniones" : "Opinions"}
            </h2>

            <div className="relative overflow-hidden rounded-2xl">
              {opinions.map((o, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: idx === opinionIndex ? 1 : 0,
                    scale: idx === opinionIndex ? 1 : 0.95,
                    position: idx === opinionIndex ? "relative" : "absolute",
                    inset: 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-100 rounded-2xl shadow-lg p-8"
                >
                  <h3 className="mb-3 font-semibold">{o.author}</h3>
                  <p className="mb-4">{o.text}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(o.fecha).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {opinions.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx === opinionIndex ? "bg-blue-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <CookieBanner language={language} />
    </div>
  );
}
