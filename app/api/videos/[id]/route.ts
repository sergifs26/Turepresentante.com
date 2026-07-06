import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteStreamVideo } from "@/lib/stream";
import { streamConfigured } from "@/lib/supabase/config";

/** Borra un vídeo propio: primero el archivo en Stream, luego la fila */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!video) {
    return NextResponse.json({ ok: false, error: "Vídeo no encontrado." }, { status: 404 });
  }

  if (streamConfigured()) {
    try {
      await deleteStreamVideo(video.stream_uid);
    } catch {
      // si ya no existe en Stream seguimos y limpiamos la BD igualmente
    }
  }
  await supabase.from("videos").delete().eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
