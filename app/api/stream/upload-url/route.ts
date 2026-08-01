import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createDirectUpload, deleteStreamVideo, getVideoStatus } from "@/lib/stream";
import { streamConfigured } from "@/lib/supabase/config";
import { MAX_TOTAL_VIDEO_SECONDS } from "@/lib/types";

const MAX_VIDEOS = 8;
// Por debajo de esto no cabe ni una jugada: pedimos hueco antes de subir
const MIN_CLIP_SECONDS = 10;

/** Crea una URL de subida directa a Stream y registra el vídeo en la BD */
export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase || !streamConfigured()) {
    return NextResponse.json(
      { ok: false, error: "La subida de vídeos aún no está activada." },
      { status: 503 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Inicia sesión primero." }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("videos")
    .select("id, stream_uid, status, duration")
    .eq("user_id", user.id);
  const list = existing ?? [];

  if (list.length >= MAX_VIDEOS) {
    return NextResponse.json(
      { ok: false, error: `Máximo ${MAX_VIDEOS} vídeos en la galería. Borra alguno para subir otro.` },
      { status: 400 }
    );
  }

  // Con un vídeo aún procesándose no sabemos su duración: esperamos para
  // poder garantizar el tope de 10 minutos en total.
  if (list.some((v) => v.status === "processing")) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Tu último vídeo aún se está subiendo o procesando. Si crees que se quedó colgado, bórralo de la galería y vuelve a intentarlo.",
      },
      { status: 409 }
    );
  }

  // La duración se pide a Cloudflare, no a la BD: la fila la puede tocar el
  // dueño, la respuesta de Stream no. Si Stream no contesta, usamos la BD.
  const ready = list.filter((v) => v.status === "ready");
  const durations = await Promise.all(
    ready.map(async (v) => {
      try {
        const s = await getVideoStatus(v.stream_uid);
        return s.duration ?? 0;
      } catch {
        return v.duration ? Number(v.duration) : 0;
      }
    })
  );
  const usedSeconds = durations.reduce((a, b) => a + b, 0);
  const remaining = Math.floor(MAX_TOTAL_VIDEO_SECONDS - usedSeconds);
  if (remaining < MIN_CLIP_SECONDS) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Has llegado al tope de 10 minutos de vídeo en total. Borra algún vídeo para subir otro mejor.",
      },
      { status: 400 }
    );
  }

  let title = "Sin título";
  try {
    const body = (await request.json()) as { title?: string };
    if (typeof body.title === "string" && body.title.trim()) {
      title = body.title.trim().slice(0, 80);
    }
  } catch {
    // sin cuerpo: usamos el título por defecto
  }

  try {
    // Cloudflare rechaza en origen cualquier vídeo más largo que el hueco
    // libre: el tope de 10 min en total no se puede saltar desde el cliente.
    const { uploadURL, uid } = await createDirectUpload(user.id, remaining);
    const { data: video, error } = await supabase
      .from("videos")
      .insert({ user_id: user.id, stream_uid: uid, title, status: "processing" })
      .select()
      .single();
    if (error) throw error;

    // Guarda anti-carrera: si dos subidas entraron a la vez, solo sigue la
    // más antigua; la otra se limpia y devuelve un aviso.
    const { data: procesando } = await supabase
      .from("videos")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "processing")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });
    if ((procesando ?? []).length > 1 && procesando![0].id !== video.id) {
      await supabase.from("videos").delete().eq("id", video.id);
      try {
        await deleteStreamVideo(uid);
      } catch {
        // la subida jamás llegó a usarse; Stream la purga solo
      }
      return NextResponse.json(
        { ok: false, error: "Ya hay otra subida en marcha. Espera a que termine." },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true, uploadURL, video, remaining });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No hemos podido preparar la subida. Inténtalo de nuevo." },
      { status: 502 }
    );
  }
}
