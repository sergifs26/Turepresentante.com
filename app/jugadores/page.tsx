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
          <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
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
        <p className="mt-5 max-w-[460px] text-[17px] leading-[1.75] text-white/80">
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
            <p className="mt-3 text-[16px] text-white/80 leading-[1.75]">
              El escaparate acaba de abrir. Crea tu cuenta hoy y sé de los
              primeros jugadores en tener su perfil aquí.
            </p>
            <Link
              href="/registro"
              className="bio-btn mt-6 inline-block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-7 py-3.5 no-underline"
            >
              Crear mi perfil gratis
            </Link>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {profiles.map((p) => {
              const sub = [p.club, p.categoria, p.ciudad].filter(Boolean).join(" · ");
              return (
                <Link
                  key={p.user_id}
                  href={`/jugadores/${p.slug}`}
                  className="group relative block overflow-hidden no-underline border border-white/10 rounded-tl-[38px] rounded-br-[38px] rounded-tr-[14px] rounded-bl-[14px] transition-all duration-500 hover:border-[#e8ff00]/40 hover:shadow-[0_0_36px_rgba(232,255,0,0.14)]"
                >
                  {/* Portada: la foto del jugador; si no tiene, un balón */}
                  <div className="relative bg-[#141414]" style={{ aspectRatio: "3 / 4" }}>
                    {p.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.foto_url}
                        alt={`Foto de ${p.nombre}`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FootballIcon />
                      </div>
                    )}

                    {/* Degradado para que el texto se lea sobre la foto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />

                    {/* Nombre + datos abajo */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span
                        className="block uppercase text-white leading-[1.02] tracking-[-0.01em] text-[26px]"
                        style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
                      >
                        {p.nombre}
                      </span>
                      <span className="block mt-1 font-mono text-[11px] tracking-[0.15em] uppercase text-[#e8ff00]">
                        {p.posicion || "Perfil nuevo"}
                      </span>
                      {sub && (
                        <span className="block mt-2 text-[13px] text-white/70 leading-[1.5]">
                          {sub}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

/* Balón de fútbol para las portadas sin foto */
function FootballIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-[38%] h-[38%] opacity-25"
      fill="none"
      stroke="#e8ff00"
      strokeWidth={2}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="26" />
      <path d="M32 18l9 6.5-3.4 10.5H26.4L23 24.5 32 18z" fill="#e8ff00" fillOpacity="0.15" />
      <path d="M32 6v12M14.7 22.5l8.3 2M14.7 41.5l9-3M32 58V46m17.3-23.5l-8.3 2M49.3 41.5l-9-3" />
    </svg>
  );
}
