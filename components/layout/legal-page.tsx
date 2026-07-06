import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";

export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#0a0a0a] min-h-dvh">
      <SiteNav />

      <header className="px-5 md:px-10 pt-16 md:pt-24 pb-10">
        <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
            {eyebrow}
          </span>
        </div>
        <h1
          className="uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontSize: "clamp(44px, 7vw, 90px)",
          }}
        >
          {title}
        </h1>
        <p className="mt-4 font-mono text-[10px] tracking-[0.15em] uppercase text-white/25">
          Última actualización: {updated}
        </p>
      </header>

      <article className="px-5 md:px-10 pb-24 max-w-[720px] [&_h2]:uppercase [&_h2]:text-[#f0f0ee] [&_h2]:text-[20px] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:leading-[1.15] [&_p]:text-[14px] [&_p]:text-white/45 [&_p]:font-light [&_p]:leading-[1.8] [&_p]:mb-4 [&_ul]:text-[14px] [&_ul]:text-white/45 [&_ul]:font-light [&_ul]:leading-[1.8] [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:list-disc [&_a]:text-[#e8ff00]">
        <style>{`article h2 { font-family: var(--font-barlow-condensed); font-weight: 900; }`}</style>
        {children}
      </article>

      <SiteFooter />
    </main>
  );
}
