import HeroBoot from "@/components/sections/hero-boot";
import PlatformScroll from "@/components/sections/platform-scroll";
import PlayersFilmstrip from "@/components/sections/players-filmstrip";

export default function Home() {
  return (
    <main className="bg-[#0a0a0a]">
      <HeroBoot />
      <PlatformScroll />
      <StatsBand />
      <ProcessSection />
      <PlayersFilmstrip />
      <CtaSection />
      <SiteFooter />
    </main>
  );
}

function StatsBand() {
  const stats = [
    { val: "2.4k", key: "Jugadores activos" },
    { val: "180", key: "Representantes" },
    { val: "34", key: "Fichajes cerrados" },
    { val: "12", key: "Países alcanzados" },
  ];
  return (
    <div
      className="grid border-y-2 border-[#0a0a0a] px-10"
      style={{ background: "#e8ff00", gridTemplateColumns: "repeat(4, 1fr)" }}
    >
      {stats.map((s, i) => (
        <div
          key={s.key}
          className="py-7"
          style={{ borderRight: i < 3 ? "1px solid rgba(10,10,10,0.12)" : "none" }}
        >
          <span
            className="block text-[#0a0a0a] leading-none tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900, fontSize: 48 }}
          >
            {s.val}
          </span>
          <span className="block font-mono text-[9px] tracking-[0.15em] text-[rgba(10,10,10,0.55)] uppercase mt-1">
            {s.key}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: ["Sube tu", "contenido"],
      desc: "Vídeos, estadísticas, historial de equipos, documentos. Cuanto más completo, más atención recibes.",
      icon: "📹",
    },
    {
      num: "02",
      title: ["Nosotros", "evaluamos"],
      desc: "Nuestro equipo revisa cada perfil. Si vemos potencial real, te seleccionamos y asumimos tu representación.",
      icon: "🔍",
    },
    {
      num: "03",
      title: ["Conectamos", "con clubes"],
      desc: "Los representantes y clubes nos contactan a nosotros. Gestionamos la negociación en tu nombre.",
      icon: "🤝",
    },
  ];

  return (
    <section id="como-funciona" className="bg-[#0a0a0a] px-10 pt-28 pb-24">
      <div className="flex items-center gap-3 mb-16">
        <span className="w-6 h-px bg-[#e8ff00] block" />
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
          Proceso
        </span>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="pt-12 pb-12"
            style={{
              paddingLeft: i > 0 ? 40 : 0,
              paddingRight: i < 2 ? 40 : 0,
              borderRight: i < 2 ? "1px solid rgba(240,240,238,0.07)" : "none",
            }}
          >
            <span
              className="block text-transparent leading-none tracking-[-0.04em] mb-[-24px]"
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 900,
                fontSize: 120,
                WebkitTextStroke: "1px rgba(240,240,238,0.06)",
              }}
              aria-hidden="true"
            >
              {s.num}
            </span>
            <h3
              className="uppercase leading-[1.05] tracking-[-0.01em] text-[#f0f0ee]"
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 900,
                fontSize: 32,
              }}
            >
              {s.title[0]}
              <br />
              {s.title[1]}
            </h3>
            <p className="mt-4 text-[14px] text-white/45 leading-[1.75] font-light max-w-[280px]">
              {s.desc}
            </p>
            <div className="mt-7 w-9 h-9 bg-[#e8ff00]/8 border border-[#e8ff00]/20 flex items-center justify-center text-base">
              {s.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section
      className="bg-[#0a0a0a] px-10 pt-28 pb-28 grid gap-16 border-t border-white/[0.07]"
      style={{ gridTemplateColumns: "1fr auto", alignItems: "flex-end" }}
    >
      <h2
        className="uppercase leading-[0.88] tracking-[-0.04em] text-[#f0f0ee]"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "clamp(64px, 10vw, 130px)",
        }}
      >
        Tu<br />
        talento<br />
        <span className="text-[#e8ff00]">merece</span><br />
        ser visto.
      </h2>

      <div className="max-w-[300px] pb-4">
        <p className="text-[14px] text-white/40 leading-[1.75] font-light mb-7">
          Crea tu perfil hoy. Si tu nivel nos convence, nos encargamos de todo.
          Sin costes ocultos, sin intermediarios entre tú y tu futuro.
        </p>
        <a
          href="#"
          className="block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-7 py-3.5 text-center no-underline hover:opacity-85 transition-opacity"
        >
          Crear mi perfil gratis
        </a>
        <a
          href="#"
          className="block mt-3 border border-white/20 text-white/50 font-mono text-[10px] tracking-[0.12em] uppercase px-7 py-[10px] text-center no-underline hover:border-white/50 hover:text-white/80 transition-all"
        >
          Soy representante o club
        </a>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="px-10 py-7 border-t border-white/[0.07] flex items-center justify-between">
      <span className="font-mono text-[10px] tracking-[0.12em] text-white/20 uppercase">
        Turepresentante 2026
      </span>
      <div className="flex gap-7">
        {["Privacidad", "Términos", "Contacto"].map((l) => (
          <a
            key={l}
            href="#"
            className="font-mono text-[10px] tracking-[0.1em] text-white/20 uppercase no-underline hover:text-white/50 transition-colors"
          >
            {l}
          </a>
        ))}
      </div>
    </footer>
  );
}
