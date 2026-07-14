import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Jugadores — Turepresentante",
  description:
    "El escaparate de talento: perfiles públicos de jugadores con su galería de vídeos. Descubre a los próximos protagonistas.",
};

export const dynamic = "force-dynamic";

export default async function JugadoresPage() {
  const supabase = await createClient();
  let profiles: Profile[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);
    profiles = (data ?? []) as Profile[];
  }

  return (
    <main className="bg-[#0a0a0a] min-h-dvh flex flex-col">
      <SiteNav />

      <header className="px-5 md:px-10 pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
            El escaparate
          </span>
        </div>
        <h1
          className="uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(52px, 9vw, 120px)",
          }}
        >
          Jugadores<span className="text-[#e8ff00]">.</span>
        </h1>
        <p className="mt-5 max-w-[460px] text-[15px] font-light leading-[1.75] text-white/65">
          Perfiles públicos con vídeo. Si eres club o agente y quieres que te
          filtremos candidatos,{" "}
          <Link href="/clubes" className="text-[#e8ff00] no-underline hover:opacity-80">
            cuéntanos qué buscas
          </Link>
          .
        </p>
      </header>

      <section className="flex-1 px-5 md:px-10 pb-24">
        {profiles.length === 0 ? (
          <div className="bio-cell max-w-[520px] px-8 py-10">
            <h2
              className="uppercase text-[#f0f0ee] text-[26px] leading-[1.1]"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
            >
              Los primeros están llegando
            </h2>
            <p className="mt-3 text-[14px] text-white/65 font-light leading-[1.75]">
              El escaparate acaba de abrir. Crea tu cuenta hoy y sé de los
              primeros jugadores en tener su perfil aquí.
            </p>
            <Link
              href="/registro"
              className="bio-btn mt-6 inline-block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-7 py-3.5 no-underline"
            >
              Crear mi perfil gratis
            </Link>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {profiles.map((p) => (
              <Link
                key={p.user_id}
                href={`/jugadores/${p.slug}`}
                className="bio-cell block px-7 py-8 no-underline"
              >
                <span
                  className="block uppercase text-[#f0f0ee] leading-[1.02] tracking-[-0.01em] text-[28px]"
                  style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
                >
                  {p.nombre}
                </span>
                <span className="block mt-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-[#e8ff00]">
                  {[p.posicion, p.ciudad].filter(Boolean).join(" · ") || "Perfil nuevo"}
                </span>
                <span className="block mt-3 text-[13px] text-white/60 font-light leading-[1.7]">
                  {[p.club, p.categoria, p.nacimiento ? `Nacido en ${p.nacimiento}` : null]
                    .filter(Boolean)
                    .join(" · ") || "Completando su ficha…"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
