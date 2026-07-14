import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import PublicGallery from "@/components/video/public-gallery";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Video } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getProfile(slug: string) {
  const supabase = await createClient();
  if (!supabase) return { profile: null, videos: [] as Video[] };
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!profile) return { profile: null, videos: [] as Video[] };
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", profile.user_id)
    .eq("status", "ready")
    .order("created_at", { ascending: false });
  return { profile: profile as Profile, videos: (videos ?? []) as Video[] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { profile } = await getProfile(slug);
  if (!profile) return { title: "Jugador no encontrado — Turepresentante" };
  return {
    title: `${profile.nombre} — Turepresentante`,
    description: `Perfil y vídeos de ${profile.nombre}${profile.posicion ? `, ${profile.posicion.toLowerCase()}` : ""}${profile.club ? ` (${profile.club})` : ""}. Talento verificado en Turepresentante.`,
  };
}

export default async function JugadorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { profile, videos } = await getProfile(slug);
  if (!profile) notFound();

  const datos = [
    { k: "Posición", v: profile.posicion },
    { k: "Club", v: profile.club },
    { k: "Categoría", v: profile.categoria },
    { k: "Ciudad", v: profile.ciudad },
    { k: "Nacimiento", v: profile.nacimiento ? String(profile.nacimiento) : null },
    { k: "Pierna", v: profile.pierna },
  ].filter((d) => d.v);

  return (
    <main className="bg-[#0a0a0a] min-h-dvh">
      <SiteNav />

      <header className="px-5 md:px-10 pt-16 md:pt-24 pb-10">
        <Link
          href="/jugadores"
          className="font-mono text-[12px] tracking-[0.15em] uppercase text-white/65 no-underline hover:text-white/75 transition-colors"
        >
          ← Todos los jugadores
        </Link>
        <h1
          className="mt-6 uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(48px, 8vw, 110px)",
          }}
        >
          {profile.nombre}
          <span className="text-[#e8ff00]">.</span>
        </h1>
        {profile.posicion && (
          <div className="mt-4 inline-flex items-center gap-2.5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
            <span className="bio-node" aria-hidden="true" />
            <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
              {profile.posicion}
            </span>
          </div>
        )}
        {profile.bio && (
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.8] text-white/85">
            {profile.bio}
          </p>
        )}
      </header>

      {datos.length > 0 && (
        <section className="px-5 md:px-10 pb-12">
          <div className="flex flex-wrap gap-3">
            {datos.map((d) => (
              <div key={d.k} className="border border-white/10 rounded-2xl px-5 py-3">
                <span className="block font-mono text-[8px] tracking-[0.2em] uppercase text-white/65">
                  {d.k}
                </span>
                <span className="block text-[16px] text-white/80 mt-0.5">{d.v}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-5 md:px-10 pb-20">
        <h2
          className="uppercase text-[#f0f0ee] text-[26px] leading-[1.1] mb-6"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
        >
          Galería <span className="text-[#e8ff00]">({videos.length})</span>
        </h2>
        <PublicGallery videos={videos} nombre={profile.nombre} />
      </section>

      <section className="px-5 md:px-10 pb-24">
        <div className="bio-cell px-8 py-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2
              className="uppercase text-[#f0f0ee] text-[26px] leading-[1.1]"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
            >
              ¿Te interesa este perfil?
            </h2>
            <p className="mt-2 text-[16px] text-white/80 leading-[1.7] max-w-[440px]">
              Si eres club o agente, gestionamos el contacto y la negociación.
              Escríbenos y te respondemos en 24-48 h.
            </p>
          </div>
          <Link
            href="/clubes"
            className="bio-btn flex-shrink-0 bg-[#e8ff00] text-[#0a0a0a] font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-8 py-4 no-underline text-center"
          >
            Contactar
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
