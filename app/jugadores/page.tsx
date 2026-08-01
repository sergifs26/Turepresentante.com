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

/** Cuántas siluetas difuminadas pintamos como mucho */
const MAX_SILUETAS = 6;

export default async function JugadoresPage() {
  const supabase = await createClient();
  let profiles: Profile[] = [];
  let enRevision = 0;
  if (supabase) {
    // Solo perfiles aprobados en la revisión (la RLS de la BD también lo
    // impone; el filtro evita además que un admin logueado vea aquí la cola)
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("estado", "aprobado")
      .order("created_at", { ascending: false })
      .limit(60);
    profiles = (data ?? []) as Profile[];

    // Cuántos esperan aprobación. Solo el número: la base de datos no
    // deja salir ni el nombre ni la foto de un perfil sin aprobar.
    const { data: pendientes } = await supabase.rpc("perfiles_en_revision_count");
    enRevision = typeof pendientes === "number" ? pendientes : 0;
  }
  const siluetas = Math.min(enRevision, MAX_SILUETAS);

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
          Cada perfil ha pasado nuestra revisión: vídeo editado de calidad y
          ficha completa. Si eres club o agente y quieres que te filtremos
          candidatos,{" "}
          <Link href="/clubes" className="text-[#e8ff00] no-underline hover:opacity-80">
            cuéntanos qué buscas
          </Link>
          .
        </p>
      </header>

      <section className="flex-1 px-5 md:px-10 pb-24">
        {profiles.length === 0 && siluetas === 0 ? (
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

            {/* Perfiles esperando aprobación: silueta difuminada, sin datos */}
            {Array.from({ length: siluetas }).map((_, i) => (
              <SiluetaEnRevision key={`revision-${i}`} variante={i} />
            ))}
          </div>
        )}

        {siluetas > 0 && (
          <p className="mt-8 text-[15px] text-white/60 leading-[1.7] max-w-[520px]">
            {enRevision === 1
              ? "Hay 1 perfil en revisión. Se verá cuando pase nuestro filtro de calidad."
              : `Hay ${enRevision} perfiles en revisión. Se verán cuando pasen nuestro filtro de calidad.`}
          </p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

/* Tarjeta de un perfil que espera aprobación.
   No recibe NI el nombre NI la foto del jugador: es una silueta dibujada
   con CSS. Así el escaparate enseña que hay talento en camino sin que se
   pueda identificar a nadie mirando el código de la página. */
function SiluetaEnRevision({ variante }: { variante: number }) {
  // Pequeñas variaciones para que no parezcan calcadas
  const tonos = ["#1a1a17", "#171719", "#191714"];
  const desplazamientos = [46, 50, 54];
  const fondo = tonos[variante % tonos.length];
  const centro = desplazamientos[variante % desplazamientos.length];

  return (
    <div
      className="relative overflow-hidden border border-white/[0.07] rounded-tl-[38px] rounded-br-[38px] rounded-tr-[14px] rounded-bl-[14px]"
      style={{ aspectRatio: "3 / 4", backgroundColor: fondo }}
    >
      {/* Silueta: cabeza y hombros, muy desenfocados */}
      <div className="absolute inset-0" style={{ filter: "blur(18px)" }} aria-hidden="true">
        {/* halo cálido detrás, como el rebote de luz de un foco */}
        <span
          className="absolute rounded-full"
          style={{
            width: "76%",
            height: "52%",
            left: `${centro - 38}%`,
            top: "6%",
            background: "radial-gradient(circle, rgba(232,255,0,0.13), transparent 68%)",
          }}
        />
        <span
          className="absolute rounded-full bg-white/[0.30]"
          style={{ width: "29%", height: "21%", left: `${centro - 14.5}%`, top: "22%" }}
        />
        <span
          className="absolute bg-white/[0.24]"
          style={{
            width: "62%",
            height: "42%",
            left: `${centro - 31}%`,
            top: "43%",
            borderRadius: "48% 48% 0 0",
          }}
        />
      </div>

      {/* Degradado suave: oscurece abajo para la etiqueta sin tapar la figura */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/15 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="inline-flex items-center gap-2 border border-[#e8ff00]/25 rounded-full px-3 py-1.5">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#e8ff00]">
            En revisión
          </span>
        </span>
        <span className="block mt-2.5 text-[13px] text-white/55 leading-[1.5]">
          Perfil pendiente de aprobación
        </span>
      </div>
    </div>
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
