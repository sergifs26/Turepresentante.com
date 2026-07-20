"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SiteNav from "@/components/layout/site-nav";
import AuthCta from "@/components/auth/auth-cta";

// 3D viewer loads client-side only (three.js needs the browser)
const Boot3D = dynamic(() => import("@/components/sections/boot-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]/50 animate-pulse">
        Cargando…
      </span>
    </div>
  ),
});

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroBoot() {
  return (
    <section className="relative min-h-dvh md:h-dvh overflow-hidden flex flex-col md:block">
      <SiteNav variant="overlay" />

      {/* Aura biológica: late detrás de los jugadores como un corazón */}
      <div
        aria-hidden="true"
        className="absolute right-[-10%] top-[2%] md:top-[8%] w-[80vw] md:w-[70vw] max-w-[1000px] aspect-square pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,255,0,0.14), rgba(232,255,0,0.05) 50%, transparent 72%)",
          animation: "bio-breathe 4.6s ease-in-out infinite",
        }}
      />

      {/* Jugadores 3D — modelo escaneado real, transparente para fundirse.
          En móvil ocupa su propia banda arriba (sin pisar el texto);
          en escritorio flota a la derecha a toda altura, tras el texto.
          Sin drop-shadow: filtrar un canvas WebGL cuesta GPU cada frame. */}
      <motion.div
        id="nerve-origin"
        className="relative order-1 mt-[60px] h-[29vh] w-full shrink-0 pointer-events-none md:order-none md:absolute md:right-0 md:top-0 md:mt-0 md:h-full md:w-[58vw] md:max-w-[900px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Boot3D />
      </motion.div>

      {/* Blob bioluminiscente bajo el titular */}
      <div
        aria-hidden="true"
        className="bio-blob bottom-[6%] left-[-6%] w-[46vw] max-w-[560px] aspect-square opacity-70 hidden md:block"
      />

      {/* Texto — en móvil ocupa la banda de abajo, con el CTA al alcance
          del pulgar; en escritorio flota abajo a la izquierda */}
      <div className="relative order-2 mt-auto px-5 pb-10 z-10 md:absolute md:bottom-14 md:left-10 md:px-0 md:pb-0 md:mt-0">
        <motion.div
          className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px] bg-[#0a0a0a]/60"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
        >
          <span className="bio-node shrink-0" />
          <span className="font-mono text-[11px] md:text-[12px] tracking-[0.12em] md:tracking-[0.2em] uppercase text-[#e8ff00]">
            Futbolistas · 100% gratis
          </span>
        </motion.div>

        <h1
          className="uppercase leading-[0.9] md:leading-[0.88] tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(46px, 11vw, 126px)",
          }}
        >
          <motion.span
            className="block text-[#f0f0ee]"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
          >
            Tu talento
          </motion.span>
          <motion.span
            className="block text-[#e8ff00]"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.64, duration: 0.6, ease: EASE }}
            style={{ textShadow: "0 0 42px rgba(232,255,0,0.35)" }}
          >
            merece
          </motion.span>
          <motion.span
            className="block text-[#f0f0ee]"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.78, duration: 0.6, ease: EASE }}
          >
            ser visto.
          </motion.span>
        </h1>

        <motion.p
          className="mt-4 max-w-[360px] text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.7] text-[rgba(240,240,238,0.88)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          ¿Juegas bien y nadie te representa? Sube tu vídeo, lo evaluamos y,
          si hay nivel, somos tu agencia: te movemos ante clubes y negociamos
          por ti.
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.4 }}
        >
          <AuthCta
            anonLabel="Crear mi perfil gratis"
            className="bio-btn inline-block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-8 py-[14px] no-underline"
          />
          <a
            href="#como-funciona"
            className="bio-btn-ghost inline-block border border-white/25 text-white/85 font-mono text-[12px] tracking-[0.12em] uppercase px-6 py-[13px] no-underline hover:border-[#e8ff00]/50 hover:text-white"
          >
            Cómo funciona ↓
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[rgba(240,240,238,0.3)] animate-pulse" />
        <span
          className="text-[11px] tracking-[0.2em] text-[rgba(240,240,238,0.25)] uppercase font-mono"
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
