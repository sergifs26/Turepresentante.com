import Link from "next/link";
import HeroBoot from "@/components/sections/hero-boot";
import PlatformScroll from "@/components/sections/platform-scroll";
import PlayersFilmstrip from "@/components/sections/players-filmstrip";
import SiteFooter from "@/components/layout/site-footer";
import NerveLine from "@/components/fx/nerve-line";
import SynapseField from "@/components/fx/synapse-field";
import ElectroCursor from "@/components/fx/electro-cursor";
import BrandMarquee from "@/components/fx/brand-marquee";

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] relative">
      <ElectroCursor />
      {/* El nervio abarca desde el hero (nace en la bota) hasta el CTA
          final (se conecta al botón): el arco narrativo de la página */}
      <div className="relative">
        <NerveLine />
        <div className="relative" style={{ zIndex: 2 }}>
          <HeroBoot />
          <BrandMarquee />
          <IntroSection />
          <PlatformScroll />
          <StatsBand />
          <ProcessSection />
          <FitSection />
          <ManifestoSection />
          <PlayersFilmstrip />
          <FaqSection />
          <CtaSection />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

/* Qué somos, en lenguaje llano: lo primero que lee quien no nos conoce */
function IntroSection() {
  const chips = ["Jugadores sin agencia", "De juvenil DH a 2ª RFEF", "Toda España"];
  return (
    <section className="px-5 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20">
      <div className="max-w-[900px]">
        <div className="inline-flex items-center gap-2.5 mb-7 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Qué es Turepresentante
          </span>
        </div>
        <p
          className="text-[#f0f0ee] leading-[1.25] tracking-[-0.01em] font-light"
          style={{ fontSize: "clamp(24px, 3.2vw, 40px)" }}
        >
          Somos una <strong className="font-semibold text-[#e8ff00]">agencia de representación</strong>{" "}
          para futbolistas que aún no tienen quien les represente. Tú subes tu
          vídeo y tu ficha; nosotros lo revisamos a mano y, si tu nivel encaja,{" "}
          <strong className="font-semibold">te representamos ante clubes y agentes</strong>{" "}
          y negociamos por ti.
        </p>
        <p className="mt-6 text-[16px] text-white/85 font-light leading-[1.8] max-w-[620px]">
          Para ti es gratis, siempre. Solo ganamos cuando tú ganas: cobramos
          al club cuando se cierra una operación. Sin cuotas, sin letra
          pequeña.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {chips.map((c) => (
            <span
              key={c}
              className="border border-white/15 rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.12em] uppercase text-white/85"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ¿Es para ti? Requisitos claros, sin dejar dudas */
function FitSection() {
  const si = [
    "Juegas federado en España, de juvenil DH a 2ª RFEF",
    "Tienes entre 16 y 26 años",
    "Puedes enseñar vídeo reciente de tus partidos",
    "No tienes representante ahora mismo",
  ];
  const no = [
    "Buscas promesas de fichaje garantizado: nadie serio puede prometer eso",
    "No tienes ningún vídeo de tu juego (grábalo y vuelve, te esperamos)",
    "Ya tienes agencia: no pisamos el trabajo de otros",
  ];
  return (
    <section className="px-5 md:px-10 pb-16 md:pb-24">
      <h2
        className="uppercase leading-[0.92] tracking-[-0.03em] text-[#f0f0ee] mb-10 md:mb-12"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 900,
          fontSize: "clamp(44px, 6.5vw, 84px)",
        }}
      >
        ¿Es <em className="text-[#e8ff00]">para ti?</em>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bio-cell px-7 py-8 md:px-9 md:py-10">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Sí, si…
          </span>
          <ul className="mt-5 flex flex-col gap-4">
            {si.map((t) => (
              <li key={t} className="flex gap-3 text-[14px] text-white/75 font-light leading-[1.7]">
                <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0 mt-[3px]" aria-hidden="true">
                  <path d="M2 8.5L6 12.5L14 3.5" stroke="#e8ff00" strokeWidth="2" fill="none" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="bio-cell px-7 py-8 md:px-9 md:py-10" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70">
            Todavía no, si…
          </span>
          <ul className="mt-5 flex flex-col gap-4">
            {no.map((t) => (
              <li key={t} className="flex gap-3 text-[14px] text-white/80 font-light leading-[1.7]">
                <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0 mt-[3px]" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Manifiesto: foto real a sangre + declaración. El momento editorial */
function ManifestoSection() {
  return (
    <section className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1800&q=80"
        alt="Jugador golpeando un balón en un campo de fútbol"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/75 to-[#0a0a0a]/40" />
      <div className="relative px-5 md:px-10 py-24 md:py-36">
        <p
          className="uppercase leading-[0.95] tracking-[-0.03em] text-[#f0f0ee] max-w-[720px]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(40px, 6vw, 78px)",
          }}
        >
          El talento sin visibilidad{" "}
          <span className="text-[#e8ff00]" style={{ textShadow: "0 0 36px rgba(232,255,0,0.3)" }}>
            no existe.
          </span>
        </p>
        <p className="mt-6 max-w-[440px] text-[15px] text-white/75 font-light leading-[1.8]">
          Cada fin de semana hay jugadores rindiendo a nivel profesional en
          campos donde no mira nadie. Nuestro trabajo es que te miren.
          Trabajamos con pocos jugadores a la vez: cuando entras, vamos a por
          todas contigo.
        </p>
      </div>
    </section>
  );
}

/* Membrana: borde ondulado orgánico que funde la banda amarilla con el negro */
function Membrane({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 44"
      preserveAspectRatio="none"
      className={`block w-full h-6 md:h-11 ${flip ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M0,44 C180,10 360,2 560,16 C760,30 900,4 1080,12 C1240,19 1360,8 1440,24 L1440,44 Z"
        fill="#e8ff00"
      />
    </svg>
  );
}

function StatsBand() {
  const stats = [
    { val: "0 €", key: "Para jugadores, siempre" },
    { val: "72 h", key: "Respuesta máxima" },
    { val: "100%", key: "Perfiles revisados a mano" },
    { val: "1:1", key: "Representación dedicada" },
  ];
  return (
    <div className="relative">
      <Membrane />
      <div
        className="grid grid-cols-2 md:grid-cols-4 px-5 md:px-10 py-2"
        style={{ background: "#e8ff00" }}
      >
        {stats.map((s) => (
          <div key={s.key} className="py-4 md:py-6">
            <span
              className="block text-[#0a0a0a] leading-none tracking-[-0.03em] text-[34px] md:text-[48px]"
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.val}
            </span>
            <span className="block font-mono text-[9px] tracking-[0.15em] text-[rgba(10,10,10,0.55)] uppercase mt-1 pr-3">
              {s.key}
            </span>
          </div>
        ))}
      </div>
      <Membrane flip />
    </div>
  );
}

/* Icons: single 1.5px-stroke set so the section doesn't rely on emojis */
function IconUpload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8ff00" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="square" />
      <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
    </svg>
  );
}
function IconScan() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8ff00" strokeWidth="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" strokeLinecap="square" />
      <path d="M8.5 11h5M11 8.5v5" strokeLinecap="square" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8ff00" strokeWidth="1.5" aria-hidden="true">
      <path d="M9 15l6-6" strokeLinecap="square" />
      <path d="M10.5 6.5L12 5a4 4 0 015.7 5.7l-1.5 1.5M13.5 17.5L12 19a4 4 0 01-5.7-5.7l1.5-1.5" />
    </svg>
  );
}

function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: ["Sube tu", "contenido"],
      desc: "Vídeos, estadísticas, historial de equipos, documentos. Cuanto más completo, más atención recibes.",
      icon: <IconUpload />,
    },
    {
      num: "02",
      title: ["Nosotros", "evaluamos"],
      desc: "Nuestro equipo revisa cada perfil. Si vemos potencial real, te seleccionamos y asumimos tu representación.",
      icon: <IconScan />,
    },
    {
      num: "03",
      title: ["Conectamos", "con clubes"],
      desc: "Los representantes y clubes nos contactan a nosotros. Gestionamos la negociación en tu nombre.",
      icon: <IconLink />,
    },
  ];

  return (
    <section id="como-funciona" className="px-5 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24 scroll-mt-16">
      <h2
        className="uppercase leading-[0.92] tracking-[-0.03em] text-[#f0f0ee] mb-4"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 900,
          fontSize: "clamp(44px, 6.5vw, 84px)",
        }}
      >
        De tu vídeo <em className="text-[#e8ff00]">al vestuario.</em>
      </h2>
      <p className="text-[14px] text-white/75 font-light leading-[1.75] max-w-[440px] mb-12 md:mb-16">
        Tres pasos. Sin promesas de humo: si hay nivel, hay representación.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((s) => (
          <div key={s.num} className="bio-cell px-7 py-9 md:px-9 md:py-11">
            <span
              className="block text-transparent leading-none tracking-[-0.04em] mb-[-16px] md:mb-[-22px] text-[80px] md:text-[110px]"
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 900,
                WebkitTextStroke: "1px rgba(232,255,0,0.13)",
              }}
              aria-hidden="true"
            >
              {s.num}
            </span>
            <h3
              className="uppercase leading-[1.05] tracking-[-0.01em] text-[#f0f0ee] text-[26px] md:text-[30px]"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
            >
              {s.title[0]}
              <br />
              {s.title[1]}
            </h3>
            <p className="mt-4 text-[14px] text-white/80 leading-[1.75] font-light max-w-[280px]">
              {s.desc}
            </p>
            <div className="bio-ring mt-7 w-11 h-11 rounded-full bg-[#e8ff00]/8 border border-[#e8ff00]/25 flex items-center justify-center">
              {s.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      q: "¿Cuánto cuesta?",
      a: "Nada. Crear tu perfil es gratis y lo será siempre. Solo ganamos si tú ganas: cobramos una comisión al club cuando se cierra una operación.",
    },
    {
      q: "¿Qué pasa si no me seleccionáis?",
      a: "Tu perfil se queda en la plataforma y puedes actualizarlo cuando quieras. Muchos jugadores entran tras subir mejor material unos meses después.",
    },
    {
      q: "¿Necesito ya un representante?",
      a: "No. De hecho, la plataforma está pensada para jugadores sin agencia. Si ya tienes representante, no podemos asumir tu representación.",
    },
    {
      q: "¿Qué material debo subir?",
      a: "Lo mínimo: un vídeo reciente (partido completo o highlights) y tu historial de equipos. Estadísticas y datos físicos suman puntos.",
    },
    {
      q: "¿En qué categorías trabajáis?",
      a: "Desde juvenil de división de honor hasta Segunda RFEF, en toda España. Si estás fuera de ese rango, súbelo igual: revisamos todo.",
    },
    {
      q: "¿Cómo sé que mi perfil se ha revisado?",
      a: "Te respondemos siempre por email en menos de 72 horas, tanto si seguimos adelante como si no.",
    },
  ];

  return (
    <section className="relative px-5 md:px-10 pt-20 md:pt-24 pb-20 md:pb-28 border-t border-white/[0.07] overflow-hidden">
      <SynapseField />
      <div className="relative">
        <h2
          className="uppercase leading-[0.92] tracking-[-0.03em] text-[#f0f0ee] mb-12 md:mb-14"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontSize: "clamp(44px, 6.5vw, 84px)",
          }}
        >
          Lo que todos <em className="text-[#e8ff00]">preguntan.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {faqs.map((f) => (
            <div key={f.q} className="flex gap-4">
              <span className="bio-node mt-[7px]" aria-hidden="true" />
              <div>
                <h3
                  className="uppercase text-[#f0f0ee] text-[20px] leading-[1.15] tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
                >
                  {f.q}
                </h3>
                <p className="mt-2.5 text-[14px] text-white/80 leading-[1.75] font-light max-w-[500px]">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative px-5 md:px-10 pt-20 md:pt-28 pb-20 md:pb-28 border-t border-white/[0.07] overflow-hidden">
      <div
        aria-hidden="true"
        className="bio-blob top-[10%] left-[16%] w-[42vw] max-w-[520px] aspect-square opacity-60"
      />
      <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-16 justify-between">
      <h2
        className="relative uppercase leading-[0.88] tracking-[-0.04em] text-[#f0f0ee]"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "clamp(56px, 10vw, 130px)",
        }}
      >
        Tu<br />
        talento<br />
        <span className="text-[#e8ff00]" style={{ textShadow: "0 0 42px rgba(232,255,0,0.3)" }}>
          merece
        </span>
        <br />
        ser visto.
      </h2>

      <div className="relative max-w-[300px] md:pb-4">
        <p className="text-[14px] text-white/75 leading-[1.75] font-light mb-7">
          Crea tu perfil hoy. Si tu nivel nos convence, nos encargamos de todo.
          Sin costes ocultos, sin intermediarios entre tú y tu futuro.
        </p>
        <Link
          id="nerve-end"
          href="/registro"
          className="bio-btn block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-7 py-4 text-center no-underline"
        >
          Crear mi perfil gratis
        </Link>
        <Link
          href="/clubes"
          className="bio-btn-ghost block mt-3 border border-white/20 text-white/85 font-mono text-[10px] tracking-[0.12em] uppercase px-7 py-3 text-center no-underline hover:border-[#e8ff00]/50 hover:text-white/80"
        >
          Soy representante o club
        </Link>
      </div>
      </div>

      {/* Bloque de ayuda: nadie se va por no saber a quién preguntar */}
      <div className="relative mt-16 md:mt-20 bio-cell px-7 py-7 md:px-9 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3
            className="uppercase text-[#f0f0ee] text-[22px] leading-[1.1]"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
          >
            ¿No lo tienes claro?
          </h3>
          <p className="mt-1.5 text-[13px] text-white/80 font-light leading-[1.7] max-w-[480px]">
            Cuéntanos tu situación y te decimos con sinceridad si encajas,
            qué vídeo grabar o por dónde empezar. Sin compromiso.
          </p>
        </div>
        <Link
          href="/contacto"
          className="bio-btn-ghost flex-shrink-0 border border-[#e8ff00]/40 text-[#e8ff00] font-mono text-[10px] tracking-[0.12em] uppercase px-7 py-3.5 no-underline text-center hover:border-[#e8ff00]"
        >
          Escríbenos
        </Link>
      </div>
    </section>
  );
}
