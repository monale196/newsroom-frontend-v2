// app/api/articulos/route.ts

import { NextResponse } from "next/server";

const S3_BASE =
  "https://newsroom-prod-content.s3.eu-north-1.amazonaws.com/articles/";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const language = searchParams.get("language") || "es";
    const section = searchParams.get("section");

    if (!date)
      return NextResponse.json(
        { error: "Missing ?date=YYYY-MM-DD" },
        { status: 400 }
      );

    const jsonUrl = `${S3_BASE}${date}/articles.${language.toLowerCase()}.json`;

    const res = await fetch(jsonUrl);
    if (!res.ok)
      return NextResponse.json(
        { articles: [], message: "No JSON found for this date." },
        { status: 200 }
      );

    let data = await res.json();

    // Filtrar si viene ?section=
    if (section) {
      data = data.filter((a: any) =>
        a.section.toLowerCase().includes(section.toLowerCase())
      );
    }

    return NextResponse.json({ articles: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
