import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  // Usuario y contraseña: user-entrevistas / Entrevistas2025
  const user = "user-entrevistas";
  const pass = "Entrevistas2025";

  const basicAuth = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

  if (auth === basicAuth) {
    return NextResponse.next();
  }

  // Si no está autorizado → solicitar login
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

// Aplicar solo a /admin/entrevistas y subrutas
export const config = {
  matcher: ["/admin/entrevistas/:path*"],
};
