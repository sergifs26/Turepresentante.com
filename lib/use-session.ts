"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type SessionInfo =
  | { estado: "cargando" }
  | { estado: "anonimo" }
  | { estado: "dentro"; fotoUrl: string | null; inicial: string };

/** Sesión del visitante para la UI (navegación, CTAs).
 *  Mientras carga no se pinta nada de auth para evitar parpadeos. */
export function useSession(): SessionInfo {
  const [info, setInfo] = useState<SessionInfo>({ estado: "cargando" });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setInfo({ estado: "anonimo" });
      return;
    }
    let activo = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!activo) return;
      if (!user) {
        setInfo({ estado: "anonimo" });
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("foto_url, nombre")
        .eq("user_id", user.id)
        .single();
      if (!activo) return;
      const nombre =
        data?.nombre ||
        ((user.user_metadata?.nombre ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name) as string | undefined) ||
        user.email ||
        "J";
      setInfo({
        estado: "dentro",
        fotoUrl: data?.foto_url ?? null,
        inicial: nombre.trim().charAt(0).toUpperCase() || "J",
      });
    })();

    return () => {
      activo = false;
    };
  }, []);

  return info;
}
