import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import AdminQueue, { type PerfilPendiente, type VideoPendiente } from "@/components/admin/admin-queue";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Video } from "@/lib/types";

export const metadata: Metadata = {
  title: "Panel de revisión — Turepresentante",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Solo admins: para el resto esta página no existe
  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) notFound();

  // Cola de perfiles en revisión (los más antiguos primero)
  const { data: pendientes } = await supabase
    .from("profiles")
    .select("*")
    .eq("estado", "en_revision")
    .order("enviado_revision_at", { ascending: true });
  const perfiles = (pendientes ?? []) as Profile[];
  const ids = perfiles.map((p) => p.user_id);

  let videosDe: Record<string, Video[]> = {};
  let telefonos: Record<string, string> = {};
  if (ids.length > 0) {
    const { data: vids } = await supabase
      .from("videos")
      .select("*")
      .in("user_id", ids)
      .order("created_at", { ascending: false });
    videosDe = {};
    for (const v of (vids ?? []) as Video[]) {
      (videosDe[v.user_id] ??= []).push(v);
    }
    const { data: privs } = await supabase
      .from("profile_private")
      .select("user_id, telefono")
      .in("user_id", ids);
    telefonos = Object.fromEntries(
      (privs ?? [])
        .filter((r) => r.telefono)
        .map((r) => [r.user_id as string, r.telefono as string])
    );
  }

  const cola: PerfilPendiente[] = perfiles.map((p) => ({
    profile: p,
    videos: videosDe[p.user_id] ?? [],
    telefono: telefonos[p.user_id] ?? null,
  }));

  // Vídeos nuevos de perfiles ya aprobados, pendientes de aprobar
  const { data: vidsPend } = await supabase
    .from("videos")
    .select("*")
    .eq("revision", "pendiente")
    .eq("status", "ready")
    .order("created_at", { ascending: true });
  const todosPendientes = (vidsPend ?? []) as Video[];
  let videosSueltos: VideoPendiente[] = [];
  if (todosPendientes.length > 0) {
    const { data: duenos } = await supabase
      .from("profiles")
      .select("user_id, nombre, slug, estado")
      .in("user_id", [...new Set(todosPendientes.map((v) => v.user_id))]);
    const porId = new Map((duenos ?? []).map((d) => [d.user_id as string, d]));
    videosSueltos = todosPendientes
      .filter((v) => porId.get(v.user_id)?.estado === "aprobado")
      .map((v) => {
        const d = porId.get(v.user_id)!;
        return { video: v, nombre: d.nombre as string, slug: d.slug as string };
      });
  }

  return (
    <main className="bg-[#0a0a0a] min-h-dvh flex flex-col">
      <SiteNav />

      <header className="px-5 md:px-10 pt-14 md:pt-20 pb-10">
        <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Solo admins
          </span>
        </div>
        <h1
          className="uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(44px, 7vw, 90px)",
          }}
        >
          Revisión<span className="text-[#e8ff00]">.</span>
        </h1>
        <p className="mt-4 max-w-[520px] text-[16px] leading-[1.75] text-white/75">
          Perfiles y vídeos pendientes de tu okey. Lo que apruebes sale al
          escaparate al momento; lo que rechaces vuelve al jugador con tu nota.
        </p>
      </header>

      <section className="flex-1 px-5 md:px-10 pb-24">
        <AdminQueue cola={cola} videosSueltos={videosSueltos} />
      </section>

      <SiteFooter />
    </main>
  );
}
