import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Retorno del login OAuth (Google): canjea el código por la sesión */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}/cuenta`);
      }
    }
  }
  return NextResponse.redirect(`${origin}/login?error=google`);
}
