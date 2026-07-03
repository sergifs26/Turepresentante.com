"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#jugadores", label: "Jugadores" },
  { href: "/clubes", label: "Clubes y agentes" },
  { href: "/contacto", label: "Contacto" },
];

export default function SiteNav({
  variant = "solid",
}: {
  /** "overlay" floats transparent over the hero; "solid" for inner pages */
  variant?: "overlay" | "solid";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isOverlay = variant === "overlay";

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
          className="font-black text-[17px] tracking-[0.08em] uppercase text-[#f0f0ee] no-underline"
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
                className={`font-mono text-[10px] tracking-[0.12em] uppercase text-[#f0f0ee] no-underline transition-opacity ${
                  active ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/perfil"
            className="font-mono text-[10px] tracking-[0.12em] uppercase bg-[#e8ff00] text-[#0a0a0a] px-4 py-[7px] no-underline font-medium hover:opacity-85 active:scale-[0.98] transition-all"
          >
            Sube tu perfil
          </Link>
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
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.35 }}
              >
                <Link
                  href="/perfil"
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[12px] tracking-[0.1em] uppercase font-medium px-8 py-4 no-underline"
                >
                  Sube tu perfil gratis
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
