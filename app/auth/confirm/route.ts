import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Destino del enlace de confirmación del email de Supabase */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) {
        return NextResponse.redirect(`${origin}/cuenta`);
      }
    }
  }
  return NextResponse.redirect(`${origin}/login?error=confirmacion`);
}
