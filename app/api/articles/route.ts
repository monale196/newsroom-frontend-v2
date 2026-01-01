// app/api/articles/route.ts
import { NextResponse } from "next/server";

const S3_BASE = "https://newsroom-prod-content.s3.eu-north-1.amazonaws.com/articles/";
const SECCIONES = [
  "www-https-www-elconfidencial-com-empresas/",
  "www-https-www-elconfidencial-com-espana/",
  "www-https-www-elconfidencial-com-mercados/",
  "www-https-www-elconfidencial-com-mundo-europa/",
  "www-https-www-elconfidencial-com-tags-temas-brexit-17151/",
  "www-https-www-elconfidencial-com-tags-temas-estados-unidos-10821/",
  "www-https-www-elconfidencial-com-ultima-hora-en-vivo/",
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") || "es";
    const date = searchParams.get("date");

    const now = date ? new Date(date) : new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const yearMonth = `${year}-${month}`;
    const lang = language === "es" ? "es" : "en";

    console.log("📅 API ARTICLES → Fecha usada:", yearMonth, day);

    const articles = [];

    for (const sec of SECCIONES) {
      const basePath = `${S3_BASE}${yearMonth}/${day}/${lang}/${sec}`;
      const jsonUrl = `${basePath}articles.${lang}.json`;
      const txtUrl = `${basePath}index.txt`;

      console.log("\n=============================");
      console.log("📁 Sección:", sec);
      console.log("📄 JSON URL:", jsonUrl);
      console.log("📄 TXT URL:", txtUrl);
      console.log("=============================\n");

      try {
        const jsonRes = await fetch(jsonUrl);
        if (!jsonRes.ok) {
          console.log("❌ JSON no encontrado");
          continue;
        }

        const data = await jsonRes.json();
        console.log("📥 JSON CARGADO:", data);

        if (!Array.isArray(data) || data.length === 0) continue;

        const art = data[0];

        let imgUrl;
        if (art.images?.[0]) {
          imgUrl = `${basePath}images/${art.images[0]}`;
          console.log("🖼 IMG URL:", imgUrl);
        } else {
          console.log("⚠️ No hay imagen en JSON");
        }

        // ---------- TXT ----------
        let txtContent = "";
        try {
          const txtRes = await fetch(txtUrl);
          if (txtRes.ok) {
            txtContent = await txtRes.text();
            console.log("📥 TXT DESCARGADO");
          } else {
            console.log("❌ No se pudo descargar TXT");
          }
        } catch (e) {
          console.log("⚠️ Error descargando TXT:", e);
        }

        articles.push({
          id: art.id || Date.now(),
          titulo: art.titulo || "Sin título",
          fecha: art.fecha || `${yearMonth}-${day}`,
          descripcion: art.descripcion || "",
          imgUrl,
          txtUrl,
          fullText: txtContent,
          section: sec,
          type: "noticia",
        });

        console.log("✅ ARTÍCULO AÑADIDO\n");
      } catch (err) {
        console.log("❌ Error cargando sección:", sec, err);
      }
    }

    if (articles.length === 0) {
      console.log("⚠️ Ningún artículo encontrado. Devolviendo MOCK.");
      articles.push({
        id: 999999,
        titulo: "No hay artículos disponibles",
        fecha: `${yearMonth}-${day}`,
        descripcion: "Se mostrará contenido real cuando esté disponible.",
        imgUrl: "/placeholder/news.webp",
        fullText: "",
        section: "mock",
        type: "noticia",
      });
    }

    return NextResponse.json(articles);
  } catch (err) {
    console.log("❌ ERROR API /articles:", err);
    return NextResponse.json({ error: "Error al cargar artículos" }, { status: 500 });
  }
}
