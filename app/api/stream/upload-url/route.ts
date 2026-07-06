import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createDirectUpload } from "@/lib/stream";
import { streamConfigured } from "@/lib/supabase/config";

const MAX_VIDEOS = 8;

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

  const { count } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((count ?? 0) >= MAX_VIDEOS) {
    return NextResponse.json(
      { ok: false, error: `Máximo ${MAX_VIDEOS} vídeos en la galería. Borra alguno para subir otro.` },
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
    const { uploadURL, uid } = await createDirectUpload(user.id);
    const { data: video, error } = await supabase
      .from("videos")
      .insert({ user_id: user.id, stream_uid: uid, title, status: "processing" })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, uploadURL, video });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No hemos podido preparar la subida. Inténtalo de nuevo." },
      { status: 502 }
    );
  }
}
