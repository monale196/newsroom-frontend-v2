"use client";

import { useContext, useMemo, useEffect } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { NewsContext, Contenido } from "../../../context/NewsContext";
import ArticleView from "../../../components/ArticleView";
import RecommendationsGrid from "../../../components/RecommendationsGrid";
import { SearchContext } from "../../../app/layout";

export default function SectionPage() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";
  const sectionSlug = slug.toLowerCase();
  const lang: "ES" | "EN" = pathname.startsWith("/EN/") ? "EN" : "ES";

  const { articles, loadArticles, loading } = useContext(NewsContext);
  const { dateFilter } = useContext(SearchContext);

  const queryArticleSlug = searchParams.get("article");

  // 🔄 Cargar todos los artículos del día (no solo sección) para poder mostrar recomendaciones
  useEffect(() => {
    if (!dateFilter) return;
    const [year, month, day] = dateFilter.split("-");
    loadArticles(year, month, day); // cargamos todas las secciones
  }, [dateFilter, loadArticles]);

  // Filtrar artículos de la sección actual
  const sectionArticles = useMemo(() => {
    return articles.filter(a => a.section.toLowerCase() === sectionSlug);
  }, [articles, sectionSlug]);

  // Determinar artículo principal
  const mainArticle: Contenido | undefined = useMemo(() => {
    if (loading) return undefined;

    if (queryArticleSlug) {
      return articles.find(a => a.url === queryArticleSlug);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      return sectionArticles.find(a => {
        const d = new Date(a.date);
        return (
          d.getFullYear() === filterDate.getFullYear() &&
          d.getMonth() === filterDate.getMonth() &&
          d.getDate() === filterDate.getDate()
        );
      }) || sectionArticles[0];
    }

    return sectionArticles[0];
  }, [articles, sectionArticles, queryArticleSlug, dateFilter, loading]);

  // Recomendaciones (otros artículos, de cualquier sección, excepto el principal)
  const recomendaciones = useMemo(() => {
    if (!mainArticle || loading) return [];
    return articles
      .filter(a => a.url !== mainArticle.url)
      .slice(0, 4);
  }, [articles, mainArticle, loading]);

  return (
    <div className="px-4 md:px-16 py-12 space-y-16 max-w-4xl mx-auto">
      {/* LOADING */}
      {!mainArticle && loading && (
        <p className="text-center text-gray-500 text-lg animate-pulse">
          {lang === "ES" ? "Cargando noticias…" : "Loading news…"}
        </p>
      )}

      {/* ARTÍCULO PRINCIPAL */}
      {!loading && mainArticle && (
        <ArticleView article={mainArticle} recomendaciones={recomendaciones} />
      )}

      {/* SIN ARTÍCULOS */}
      {!loading && !mainArticle && (
        <p className="text-center text-gray-600 text-lg">
          {lang === "ES"
            ? "No hay artículos disponibles para esta sección."
            : "No articles available for this section."}
        </p>
      )}
    </div>
  );
}
