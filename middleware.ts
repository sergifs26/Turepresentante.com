import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/** Refresca la sesión de Supabase en cada petición (los Server
 *  Components no pueden escribir cookies).
 *  Nota: usamos la convención `middleware` (runtime edge) y no la nueva
 *  `proxy` de Next 16 porque el adaptador de Cloudflare no soporta
 *  middleware en runtime Node.js. */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Obligatorio para refrescar el token si ha caducado
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Solo donde hay sesión en juego: cuenta, auth y APIs de vídeo
    "/cuenta/:path*",
    "/login",
    "/registro",
    "/auth/:path*",
    "/api/stream/:path*",
    "/api/videos/:path*",
  ],
};
