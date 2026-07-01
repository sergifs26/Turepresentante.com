"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// 3D viewer loads client-side only (three.js needs the browser)
const Boot3D = dynamic(() => import("@/components/sections/boot-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]/50 animate-pulse">
        Cargando…
      </span>
    </div>
  ),
});

export default function HeroBoot() {
  return (
    <section className="relative h-dvh overflow-hidden bg-[#0a0a0a]">

      {/* Nav */}
      <nav
        className="absolute top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-10"
        style={{ mixBlendMode: "difference" }}
      >
        <span
          className="font-display font-black text-[17px] tracking-[0.08em] uppercase text-[#f0f0ee]"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Turepresentante
        </span>
        <div className="flex items-center gap-8">
          <a
            href="#como-funciona"
            className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#f0f0ee] opacity-60 hover:opacity-100 transition-opacity no-underline"
          >
            Cómo funciona
          </a>
          <a
            href="#jugadores"
            className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#f0f0ee] opacity-60 hover:opacity-100 transition-opacity no-underline"
          >
            Jugadores
          </a>
          <a
            href="#perfil"
            className="font-mono text-[10px] tracking-[0.12em] uppercase bg-[#e8ff00] text-[#0a0a0a] px-4 py-[7px] no-underline font-medium hover:opacity-85 transition-opacity"
          >
            Sube tu perfil
          </a>
        </div>
      </nav>

      {/* Boot — real 3D scanned model, transparent so it melts into the page */}
      <motion.div
        className="absolute right-0 top-0 h-full w-[58vw] max-w-[900px] pointer-events-none"
        style={{ filter: "drop-shadow(0 0 60px rgba(232,255,0,0.18))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Boot3D />
      </motion.div>

      {/* Text — bottom left, overlapping boot */}
      <div className="absolute bottom-14 left-10 z-10">
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.05, duration: 0.4 }}
        >
          <span className="w-6 h-px bg-[#e8ff00] block flex-shrink-0" />
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]"
          >
            Marketplace de talento
          </span>
        </motion.div>

        <h1
          className="uppercase leading-[0.88] tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(80px, 12vw, 168px)",
          }}
        >
          <motion.span
            className="block text-[#f0f0ee]"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            Hazte
          </motion.span>
          <motion.span
            className="block text-[#e8ff00]"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            Ver.
          </motion.span>
        </h1>

        <motion.p
          className="mt-5 max-w-[260px] text-[14px] font-light leading-[1.75] text-[rgba(240,240,238,0.5)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7, duration: 0.5 }}
        >
          Sube tu perfil, nosotros te ponemos delante de los representantes y
          clubes que importan.
        </motion.p>

        <motion.a
          href="#perfil"
          className="mt-6 inline-block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-7 py-[13px] no-underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.9, duration: 0.4 }}
          whileHover={{ opacity: 0.85, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Crear mi perfil gratis
        </motion.a>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 right-10 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.3, duration: 0.5 }}
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[rgba(240,240,238,0.3)] animate-pulse" />
        <span
          className="text-[9px] tracking-[0.2em] text-[rgba(240,240,238,0.25)] uppercase font-mono"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
      </motion.div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.038]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
    </section>
  );
}
