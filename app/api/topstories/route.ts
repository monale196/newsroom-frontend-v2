import { NextResponse } from "next/server";

const S3_BASE =
  "https://newsroom-prod-content.s3.eu-north-1.amazonaws.com/articles/";

function shuffleArray(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") || "es";

    // Fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);

    const jsonUrl = `${S3_BASE}${today}/articles.${language.toLowerCase()}.json`;

    const res = await fetch(jsonUrl);

    if (!res.ok) {
      return NextResponse.json({ topStories: [] });
    }

    const allArticles = await res.json();

    if (!Array.isArray(allArticles) || allArticles.length === 0) {
      return NextResponse.json({ topStories: [] });
    }

    // Mezclar y elegir 4 aleatorios
    const shuffled = shuffleArray(allArticles);
    const selected = shuffled.slice(0, 4);

    return NextResponse.json({
      date: today,
      topStories: selected,
    });
  } catch (error) {
    console.error("Error in /api/topstories:", error);
    return NextResponse.json({ topStories: [] }, { status: 200 });
  }
}
