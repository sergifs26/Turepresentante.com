import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "./config";

/** Cliente Supabase para Server Components, Route Handlers y Actions.
 *  Next 16: cookies() es asíncrono. Devuelve null si no hay claves. */
export async function createClient() {
  if (!supabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components no pueden escribir cookies; proxy.ts
          // se encarga de refrescar la sesión.
        }
      },
    },
  });
}
