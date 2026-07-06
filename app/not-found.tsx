import Link from "next/link";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";

export default function NotFound() {
  return (
    <main className="bg-[#0a0a0a] min-h-dvh flex flex-col">
      <SiteNav />
      <section className="relative flex-1 flex flex-col justify-center px-5 md:px-10 py-24 overflow-hidden">
        <div
          aria-hidden="true"
          className="bio-blob top-[16%] right-[8%] w-[38vw] max-w-[460px] aspect-square opacity-60"
        />
        <div className="inline-flex w-fit items-center gap-2.5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Error 404
          </span>
        </div>
        <h1
          className="mt-4 uppercase leading-[0.88] tracking-[-0.04em] text-[#f0f0ee]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(64px, 12vw, 160px)",
          }}
        >
          Fuera de<br />
          <span className="text-[#e8ff00]">juego.</span>
        </h1>
        <p className="mt-6 max-w-[380px] text-[14px] font-light leading-[1.75] text-white/45">
          Esta página no existe o ha cambiado de sitio. Vuelve al campo y
          sigue jugando.
        </p>
        <Link
          href="/"
          className="bio-btn mt-8 inline-block w-fit bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-7 py-3.5 no-underline"
        >
          Volver al inicio
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
