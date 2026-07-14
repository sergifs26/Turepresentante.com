import Link from "next/link";

const NAV = [
  { href: "/perfil", label: "Sube tu perfil" },
  { href: "/clubes", label: "Clubes y agentes" },
  { href: "/contacto", label: "Contacto" },
];

const LEGAL = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.07] px-5 md:px-10 pt-14 pb-7">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <span
            className="block uppercase text-[#f0f0ee] leading-none tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 900,
              fontSize: "clamp(34px, 5vw, 56px)",
            }}
          >
            Turepresentante
          </span>
          <p className="mt-3 max-w-[340px] text-[13px] text-white/70 font-light leading-[1.7]">
            Representación de talento futbolístico. Sube tu perfil y deja que
            tu juego hable por ti.
          </p>
        </div>

        <div className="flex gap-14">
          <div className="flex flex-col gap-2.5">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[10px] tracking-[0.12em] text-white/75 uppercase no-underline hover:text-[#e8ff00] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            {LEGAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[10px] tracking-[0.12em] text-white/75 uppercase no-underline hover:text-[#e8ff00] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="mailto:info@turepresentante.com"
              className="font-mono text-[10px] tracking-[0.12em] text-white/75 uppercase no-underline hover:text-[#e8ff00] transition-colors"
            >
              info@turepresentante.com
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.12em] text-white/55 uppercase">
          © {new Date().getFullYear()} Turepresentante
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-white/55 uppercase">
          Hecho en España
        </span>
      </div>
    </footer>
  );
}
