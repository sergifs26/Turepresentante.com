import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVideoStatus } from "@/lib/stream";
import { streamConfigured } from "@/lib/supabase/config";
import type { Video } from "@/lib/types";

/** Lista los vídeos del usuario. Los que siguen en proceso se
 *  consultan en Stream y se actualizan si ya están listos. */
export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, videos: [] }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, videos: [] }, { status: 401 });
  }

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (videos ?? []) as Video[];

  if (streamConfigured()) {
    const pending = list.filter((v) => v.status === "processing");
    for (const v of pending) {
      try {
        const s = await getVideoStatus(v.stream_uid);
        if (s.ready) {
          await supabase
            .from("videos")
            .update({ status: "ready", duration: s.duration })
            .eq("id", v.id);
          v.status = "ready";
          v.duration = s.duration;
        } else if (s.state === "error") {
          await supabase.from("videos").update({ status: "error" }).eq("id", v.id);
          v.status = "error";
        }
      } catch {
        // si Stream no responde, lo dejamos en processing y se reintenta
      }
    }
  }

  return NextResponse.json({ ok: true, videos: list });
}
