"use client";

import { useRef } from "react";

const PLAYERS = [
  { name: "Alejandro V.", pos: "Mediocentro · Madrid", age: 24, goals: 23, parts: 87, bg: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80", rep: true },
  { name: "Marco T.", pos: "Delantero · Barcelona", age: 21, goals: 31, parts: 64, bg: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400&q=80", rep: false },
  { name: "Diego R.", pos: "Portero · Sevilla", age: 26, goals: 0, parts: 102, bg: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80", rep: true },
  { name: "Luis P.", pos: "Lateral Izq. · Valencia", age: 23, goals: 9, parts: 55, bg: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&q=80", rep: false },
  { name: "Ivan M.", pos: "Extremo Der. · Bilbao", age: 20, goals: 14, parts: 38, bg: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80", rep: true },
];

export default function PlayersFilmstrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!stripRef.current) return;
    dragState.current = { isDown: true, startX: e.pageX - stripRef.current.offsetLeft, scrollLeft: stripRef.current.scrollLeft };
    stripRef.current.style.cursor = "grabbing";
  };
  const onMouseLeave = () => {
    dragState.current.isDown = false;
    if (stripRef.current) stripRef.current.style.cursor = "grab";
  };
  const onMouseUp = () => {
    dragState.current.isDown = false;
    if (stripRef.current) stripRef.current.style.cursor = "grab";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDown || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    stripRef.current.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX) * 1.4;
  };

  return (
    <section id="jugadores" className="pb-28">
      <div className="flex flex-col md:flex-row md:items-end gap-5 justify-between px-5 md:px-10 pt-20 pb-12">
        <h2
          className="uppercase leading-[0.92] tracking-[-0.03em] text-[#f0f0ee]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontSize: "clamp(56px, 8vw, 96px)",
          }}
        >
          Talento<br />
          <em className="text-[#e8ff00]">en el</em><br />
          escaparate
        </h2>
        <p className="max-w-[200px] text-[15px] text-white/70 leading-relaxed pb-2 md:text-right">
          Selección de perfiles actualmente representados.
        </p>
      </div>

      <p className="px-5 md:px-10 mb-3 flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] text-white/55 uppercase">
        <span className="w-5 h-px bg-white/15 block" />
        Arrastra para ver más
      </p>

      <div
        ref={stripRef}
        className="flex gap-0.5 px-5 md:px-10 overflow-x-auto select-none"
        style={{ cursor: "grab", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {PLAYERS.map((p) => (
          <div
            key={p.name}
            className="flex-shrink-0 w-[280px] bg-[#1a1a1a] relative overflow-hidden rounded-tl-[38px] rounded-br-[38px] rounded-tr-[14px] rounded-bl-[14px] border border-transparent transition-all duration-500 hover:scale-[1.02] hover:z-10 hover:border-[#e8ff00]/30 hover:shadow-[0_0_36px_rgba(232,255,0,0.14)]"
          >
            <div
              className="relative overflow-hidden"
              style={{ height: 340, background: `url(${p.bg}) center/cover` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/15 to-transparent" />
              <span
                className={`absolute top-3.5 left-3.5 text-[8px] font-mono font-medium tracking-widest uppercase px-2 py-1 ${
                  p.rep ? "bg-[#e8ff00] text-[#0a0a0a]" : "bg-white/10 text-white/75 border border-white/15"
                }`}
              >
                {p.rep ? "Representado" : "En proceso"}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div
                  className="text-[26px] font-black uppercase text-white leading-tight tracking-tight"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {p.name}
                </div>
                <div className="text-[#e8ff00] text-[11px] font-mono tracking-widest uppercase mt-1">{p.pos}</div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="block font-mono text-[17px] font-medium text-white">{p.goals || "—"}</span>
                    <span className="block font-mono text-[8px] text-white/65 uppercase tracking-wider mt-0.5">Goles</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[17px] font-medium text-white">{p.age}</span>
                    <span className="block font-mono text-[8px] text-white/65 uppercase tracking-wider mt-0.5">Edad</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[17px] font-medium text-white">{p.parts}</span>
                    <span className="block font-mono text-[8px] text-white/65 uppercase tracking-wider mt-0.5">Part.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* "Únete" card — la siguiente célula del organismo eres tú */}
        <a
          href="/registro"
          className="bio-cell flex-shrink-0 w-[280px] flex flex-col items-center justify-center no-underline"
          style={{ height: 340 }}
        >
          <span className="bio-node mb-4" aria-hidden="true" />
          <div
            className="text-[#e8ff00] font-black uppercase leading-[0.95] tracking-[-0.02em] text-center"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 42 }}
          >
            Tu sitio<br />está aquí
          </div>
          <div className="font-mono text-[11px] tracking-[0.15em] text-white/65 uppercase mt-3">
            Sube tu perfil gratis
          </div>
        </a>
      </div>
    </section>
  );
}
