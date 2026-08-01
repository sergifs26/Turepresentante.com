import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import AdminQueue, {
  type Contacto,
  type PerfilPendiente,
  type PerfilRevisado,
  type VideoPendiente,
} from "@/components/admin/admin-queue";
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

  // Ya revisados: para escribirles y para poder rectificar una decisión
  const { data: revisadosRaw } = await supabase
    .from("profiles")
    .select("*")
    .in("estado", ["aprobado", "rechazado"])
    .order("revisado_at", { ascending: false })
    .limit(60);
  const yaRevisados = (revisadosRaw ?? []) as Profile[];

  const todosIds = [...perfiles, ...yaRevisados].map((p) => p.user_id);

  // Contacto (tabla protegida: solo dueño o admin) para todos los de la página
  let contactos: Record<string, Contacto> = {};
  if (todosIds.length > 0) {
    const { data: privs } = await supabase
      .from("profile_private")
      .select("user_id, telefono, email")
      .in("user_id", todosIds);
    contactos = Object.fromEntries(
      (privs ?? []).map((r) => [
        r.user_id as string,
        { telefono: (r.telefono as string | null) ?? null, email: (r.email as string | null) ?? null },
      ])
    );
  }

  // Vídeos de los perfiles en cola, para poder verlos aquí mismo
  const videosDe: Record<string, Video[]> = {};
  if (perfiles.length > 0) {
    const { data: vids } = await supabase
      .from("videos")
      .select("*")
      .in(
        "user_id",
        perfiles.map((p) => p.user_id)
      )
      .order("created_at", { ascending: false });
    for (const v of (vids ?? []) as Video[]) {
      (videosDe[v.user_id] ??= []).push(v);
    }
  }

  const cola: PerfilPendiente[] = perfiles.map((p) => ({
    profile: p,
    videos: videosDe[p.user_id] ?? [],
    contacto: contactos[p.user_id] ?? { telefono: null, email: null },
  }));

  const revisados: PerfilRevisado[] = yaRevisados.map((p) => ({
    profile: p,
    contacto: contactos[p.user_id] ?? { telefono: null, email: null },
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
        <p className="mt-4 max-w-[560px] text-[16px] leading-[1.75] text-white/75">
          Ficha completa de cada jugador y sus vídeos, con su email y teléfono
          para que le escribas tú. Lo que apruebes sale al escaparate al
          momento; lo que rechaces vuelve a su panel con tu nota.
        </p>
      </header>

      <section className="flex-1 px-5 md:px-10 pb-24">
        <AdminQueue cola={cola} videosSueltos={videosSueltos} revisados={revisados} />
      </section>

      <SiteFooter />
    </main>
  );
}
