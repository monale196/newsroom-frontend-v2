import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "opiniones.json");

// GET → Devolver opiniones
export async function GET() {
  try {
    const file = await readFile(filePath, "utf8").catch(() => "[]");
    const opiniones = JSON.parse(file);

    return NextResponse.json(opiniones);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

// POST → Guardar nueva opinión
export async function POST(req: Request) {
  try {
    const nueva = await req.json();

    const file = await readFile(filePath, "utf8").catch(() => "[]");
    const opiniones = JSON.parse(file);

    // Insertar al inicio → más reciente primero
    opiniones.unshift(nueva);

    await writeFile(filePath, JSON.stringify(opiniones, null, 2));

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
