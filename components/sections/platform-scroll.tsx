"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const PLAYERS = [
  {
    name: "Alejandro V.",
    pos: "Mediocentro",
    age: 24,
    goals: 23,
    bg: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=300&q=80",
    rep: true,
  },
  {
    name: "Marco T.",
    pos: "Delantero",
    age: 21,
    goals: 31,
    bg: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=300&q=80",
    rep: false,
  },
  {
    name: "Diego R.",
    pos: "Portero",
    age: 26,
    goals: 0,
    bg: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=300&q=80",
    rep: true,
  },
  {
    name: "Luis P.",
    pos: "Lateral Izq.",
    age: 23,
    goals: 9,
    bg: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300&q=80",
    rep: false,
  },
];

function PlatformMockup() {
  return (
    <div className="h-full w-full bg-[#0d0d0d] overflow-hidden flex flex-col select-none rounded-xl">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-white/5 bg-[#111] flex-shrink-0">
        <span
          className="text-[13px] font-black tracking-wide text-[#e8ff00] uppercase"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Turepresentante
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/30 font-mono">
            🔍 Buscar jugadores...
          </div>
          <div className="w-6 h-6 bg-[#e8ff00]/10 border border-[#e8ff00]/20 flex items-center justify-center text-[10px]">
            +
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.04] flex-shrink-0">
        {["Todos", "Delantero", "Mediocentro", "Portero"].map((f, i) => (
          <span
            key={f}
            className={`text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 ${
              i === 0
                ? "bg-[#e8ff00] text-[#0a0a0a]"
                : "border border-white/10 text-white/35"
            }`}
          >
            {f}
          </span>
        ))}
        <span className="ml-auto text-[9px] font-mono text-white/20 tracking-wider">
          2,401 jugadores
        </span>
      </div>

      {/* Player grid */}
      <div className="flex-1 p-3 grid grid-cols-2 md:grid-cols-4 gap-2 overflow-hidden">
        {PLAYERS.map((p) => (
          <div key={p.name} className="bg-[#1a1a1a] overflow-hidden relative">
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4", background: `url(${p.bg}) center/cover` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <span
                className={`absolute top-2 left-2 text-[8px] font-mono font-medium tracking-wider px-1.5 py-0.5 ${
                  p.rep
                    ? "bg-[#e8ff00] text-[#0a0a0a]"
                    : "bg-white/10 text-white/60 border border-white/15"
                }`}
              >
                {p.rep ? "Representado" : "Nuevo"}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <div
                  className="text-[12px] font-black uppercase text-white tracking-tight"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {p.name}
                </div>
                <div className="text-[#e8ff00] text-[8px] font-mono tracking-widest uppercase mt-0.5">
                  {p.pos}
                </div>
                <div className="flex gap-3 mt-1.5 pt-1.5 border-t border-white/[0.08]">
                  <div>
                    <span className="block text-[11px] font-mono font-medium text-white">
                      {p.goals || "—"}
                    </span>
                    <span className="block text-[7px] font-mono text-white/30 uppercase tracking-wider">
                      Goles
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-mono font-medium text-white">
                      {p.age}
                    </span>
                    <span className="block text-[7px] font-mono text-white/30 uppercase tracking-wider">
                      Edad
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlatformScroll() {
  return (
    <div className="bg-[#0a0a0a]">
      <ContainerScroll
        titleComponent={
          <div className="text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="w-6 h-px bg-[#e8ff00] block" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
                La plataforma
              </span>
              <span className="w-6 h-px bg-[#e8ff00] block" />
            </div>
            <h2
              className="uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(40px, 6vw, 80px)",
              }}
            >
              Tu talento,{" "}
              <span className="text-[#e8ff00]">donde tiene</span>
              <br />
              que estar.
            </h2>
          </div>
        }
      >
        <PlatformMockup />
      </ContainerScroll>
    </div>
  );
}
