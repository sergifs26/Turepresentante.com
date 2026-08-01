import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** El jugador envía su perfil a revisión. Validamos requisitos con
 *  mensajes claros (la BD los vuelve a comprobar con un trigger) y
 *  avisamos por email al equipo. */
export async function POST() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Las cuentas aún no están activadas." },
      { status: 503 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Inicia sesión primero." }, { status: 401 });
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  const profile = data as Profile | null;
  if (!profile) {
    return NextResponse.json({ ok: false, error: "No encontramos tu perfil." }, { status: 404 });
  }

  if (profile.estado === "en_revision") {
    return NextResponse.json(
      { ok: false, error: "Tu perfil ya está en revisión. Te respondemos en menos de 72 h." },
      { status: 409 }
    );
  }
  if (profile.estado === "aprobado") {
    return NextResponse.json(
      { ok: false, error: "Tu perfil ya está publicado." },
      { status: 409 }
    );
  }

  // Requisitos con mensajes concretos (el trigger de la BD es la red final)
  const faltan: string[] = [];
  if (!profile.nombre?.trim()) faltan.push("tu nombre");
  if (!profile.posicion) faltan.push("tu posición");
  if (!profile.nacimiento) faltan.push("tu año de nacimiento");
  if (!profile.club?.trim()) faltan.push("tu club actual");
  if (!profile.categoria?.trim()) faltan.push("tu categoría");

  const { count: readyCount } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "ready");
  if (!readyCount) faltan.push("al menos un vídeo listo");

  if (faltan.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Antes de enviar te falta: ${faltan.join(", ")}.` },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      estado: "en_revision",
      enviado_revision_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);
  if (error) {
    return NextResponse.json(
      { ok: false, error: "No hemos podido enviar tu perfil. Inténtalo de nuevo." },
      { status: 502 }
    );
  }

  // Aviso al equipo (mejor esfuerzo: si el email falla, la revisión sigue en cola)
  try {
    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ?? "15408549-f732-41cc-a42f-57ce1d6dcf64";
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Perfil enviado a REVISIÓN — ${profile.nombre}`,
        from_name: "Turepresentante.com",
        email: user.email ?? "info@turepresentante.com",
        message: [
          `Jugador: ${profile.nombre}`,
          `Email: ${user.email ?? "—"}`,
          `Posición: ${profile.posicion ?? "—"} · Club: ${profile.club ?? "—"} · Categoría: ${profile.categoria ?? "—"}`,
          `Vídeos listos: ${readyCount}`,
          "",
          "Revisar en: https://turepresentante.com/admin",
          `Vista previa: https://turepresentante.com/jugadores/${profile.slug}`,
        ].join("\n"),
      }),
    });
  } catch {
    // sin bloqueo: el perfil ya está en la cola del panel /admin
  }

  return NextResponse.json({ ok: true });
}
