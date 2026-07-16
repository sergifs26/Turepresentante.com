"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "@/lib/use-session";

const LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/jugadores", label: "Jugadores" },
  { href: "/clubes", label: "Clubes y agentes" },
];

/** Foto del usuario (o su inicial sobre amarillo si no tiene) */
function Avatar({
  fotoUrl,
  inicial,
  size = 36,
}: {
  fotoUrl: string | null;
  inicial: string;
  size?: number;
}) {
  return fotoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fotoUrl}
      alt=""
      className="rounded-full object-cover border-2 border-[#e8ff00]/60 block"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="rounded-full bg-[#e8ff00] text-[#0a0a0a] flex items-center justify-center uppercase"
      style={{
        width: size,
        height: size,
        fontFamily: "var(--font-barlow-condensed)",
        fontWeight: 900,
        fontSize: Math.round(size * 0.5),
      }}
      aria-hidden="true"
    >
      {inicial}
    </span>
  );
}

export default function SiteNav({
  variant = "solid",
}: {
  /** "overlay" floats transparent over the hero; "solid" for inner pages */
  variant?: "overlay" | "solid";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();

  const isOverlay = variant === "overlay";
  const dentro = session.estado === "dentro";

  return (
    <>
      <nav
        className={
          isOverlay
            ? "absolute top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-5 md:px-10"
            : "sticky top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-5 md:px-10 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/[0.06]"
        }
        style={isOverlay ? { mixBlendMode: "difference" } : undefined}
      >
        <Link
          href="/"
          className="font-black text-[19px] tracking-[0.08em] uppercase text-[#f0f0ee] no-underline"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Turepresentante
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => {
            const active = !l.href.includes("#") && pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`font-mono text-[12px] tracking-[0.12em] uppercase text-[#f0f0ee] no-underline transition-opacity ${
                  active ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          {session.estado === "anonimo" && (
            <>
              <Link
                href="/login"
                className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#f0f0ee] no-underline transition-opacity opacity-60 hover:opacity-100"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="bio-btn font-mono text-[12px] tracking-[0.12em] uppercase bg-[#e8ff00] text-[#0a0a0a] px-5 py-[8px] no-underline font-medium"
              >
                Sube tu perfil
              </Link>
            </>
          )}

          {/* Con sesión: en overlay el hueco lo ocupa el avatar flotante de
              fuera (el blend "difference" invertiría los colores de la foto) */}
          {dentro &&
            (isOverlay ? (
              <span className="block w-9 h-9" aria-hidden="true" />
            ) : (
              <Link href="/cuenta" aria-label="Ir a mi panel" className="no-underline">
                <Avatar fotoUrl={session.fotoUrl} inicial={session.inicial} />
              </Link>
            ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 items-end bg-transparent border-0 cursor-pointer"
        >
          <span
            className={`block h-[2px] bg-[#f0f0ee] transition-all duration-300 ${open ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`}
          />
          <span
            className={`block h-[2px] bg-[#f0f0ee] transition-all duration-300 ${open ? "opacity-0" : "w-4"}`}
          />
          <span
            className={`block h-[2px] bg-[#f0f0ee] transition-all duration-300 ${open ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5"}`}
          />
        </button>
      </nav>

      {/* Avatar flotante para el modo overlay (fuera del contenedor con
          mix-blend-mode para que la foto conserve sus colores) */}
      {isOverlay && dentro && (
        <Link
          href="/cuenta"
          aria-label="Ir a mi panel"
          className="hidden md:block absolute top-3 right-10 z-50 no-underline"
        >
          <Avatar fotoUrl={session.fotoUrl} inicial={session.inicial} />
        </Link>
      )}

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-end px-6 pb-12 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block uppercase no-underline text-[#f0f0ee] leading-[1.1] py-2"
                    style={{
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 900,
                      fontSize: 44,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              {session.estado === "anonimo" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.35 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block uppercase no-underline text-[#f0f0ee] leading-[1.1] py-2"
                    style={{
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 900,
                      fontSize: 44,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Entrar
                  </Link>
                </motion.div>
              )}

              {dentro && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.35 }}
                >
                  <Link
                    href="/cuenta"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 uppercase no-underline text-[#e8ff00] leading-[1.1] py-2"
                    style={{
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 900,
                      fontSize: 44,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <Avatar fotoUrl={session.fotoUrl} inicial={session.inicial} size={44} />
                    Mi panel
                  </Link>
                </motion.div>
              )}

              {session.estado !== "dentro" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.35 }}
                >
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    className="bio-btn mt-6 inline-block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[14px] tracking-[0.1em] uppercase font-medium px-8 py-4 no-underline"
                  >
                    Sube tu perfil gratis
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
